import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from './Player';
import { PlayerState } from './types';
import { PLAYER_CONFIG, PHYSICS_CONFIG, PARRY_CONFIG } from './constants';

// Mock PIXI
vi.mock('pixi.js', () => ({
  Graphics: vi.fn(() => ({
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    clear: vi.fn().mockReturnThis(),
    tint: 0,
    x: 0,
    y: 0,
  })),
}));

// Mock TrajectoryPreview
vi.mock('./systems/TrajectoryPreview', () => ({
  TrajectoryPreview: vi.fn(() => ({
    show: vi.fn(),
    hide: vi.fn(),
    updateTrajectory: vi.fn(),
  })),
}));

// Mock Rapier
const mockRapier = {
  RigidBodyDesc: {
    dynamic: vi.fn().mockReturnValue({
      setTranslation: vi.fn().mockReturnThis(),
      lockRotations: vi.fn().mockReturnThis(),
    }),
  },
  ColliderDesc: {
    cuboid: vi.fn().mockReturnValue({
      setRestitution: vi.fn().mockReturnThis(),
      setFriction: vi.fn().mockReturnThis(),
      setCollisionGroups: vi.fn().mockReturnThis(),
      setActiveEvents: vi.fn().mockReturnThis(),
    }),
  },
  ActiveEvents: {
    COLLISION_EVENTS: 1,
  },
  Ray: vi.fn().mockImplementation((origin, dir) => ({ origin, dir })),
};

const mockWorld = {
  createRigidBody: vi.fn().mockReturnValue({
    translation: vi.fn().mockReturnValue({ x: 100, y: 400 }),
    setTranslation: vi.fn(),
    linvel: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    setLinvel: vi.fn(),
    handle: 1,
  }),
  createCollider: vi.fn().mockReturnValue({
    setFriction: vi.fn(),
    setActiveEvents: vi.fn(),
    setCollisionGroups: vi.fn(),
    handle: 1,
  }),
  removeCollider: vi.fn(),
  castRay: vi.fn(),
};

const mockContainer = {
  addChild: vi.fn(),
  removeChild: vi.fn(),
};

const mockProjectileManager = {
  spawnBoomerang: vi.fn(),
};

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    vi.clearAllMocks();
    player = new Player(mockWorld as any, mockContainer as any, 100, 400, mockRapier as any);
    player.setProjectileManager(mockProjectileManager as any);
  });

  describe('initialization', () => {
    it('should create player at specified position', () => {
      expect(mockRapier.RigidBodyDesc.dynamic).toHaveBeenCalled();
      expect(mockWorld.createRigidBody).toHaveBeenCalled();
      expect(mockContainer.addChild).toHaveBeenCalled();
    });

    it('should start in idle state with boomerang', () => {
      expect(player.getState()).toBe(PlayerState.Idle);
      expect(player.getHasBoomerang()).toBe(true);
    });
  });

  describe('movement', () => {
    beforeEach(() => {
      // Mock ground detection to return grounded
      mockWorld.castRay.mockReturnValue({ toi: 1 });
    });

    it('should move left when moveLeft is called', () => {
      // Set initial state
      player['isGrounded'] = true;
      player.moveLeft(1/60);
      
      // Force velocity update by running multiple frames
      for (let i = 0; i < 10; i++) {
        player.update(1/60);
      }
      
      // Manually set velocity above threshold and update state machine
      player['currentVelocityX'] = -15;
      player['stateMachine'].update(1/60, {
        hasBoomerang: true,
        isGrounded: true,
        velocity: { x: -15, y: 0 },
        isFacingRight: false,
        timeSinceStateChange: 0.2
      });
      
      expect(player.getState()).toBe(PlayerState.Moving);
    });

    it('should move right when moveRight is called', () => {
      player.moveRight(1/60);
      // Simulate velocity building up above threshold
      player['currentVelocityX'] = 15; // Above VELOCITY_THRESHOLD of 10
      player['rigidBody'].linvel.mockReturnValue({ x: 15, y: 0 });
      player.update(1/60);
      
      expect(player.getState()).toBe(PlayerState.Moving);
    });

    it('should stop moving when stopMoving is called', () => {
      player.moveRight(1/60);
      player.update(1/60);
      player.stopMoving(1/60);
      
      // Target velocity should be 0
      expect(player['targetVelocityX']).toBe(0);
    });

    it('should respect max move speed', () => {
      player.moveRight(1);
      player.update(1);
      
      expect(player['targetVelocityX']).toBe(PLAYER_CONFIG.MOVE_SPEED);
    });
  });

  describe('crouching', () => {
    beforeEach(() => {
      // Mock ground detection
      mockWorld.castRay.mockReturnValue({ toi: 1 });
      player['isGrounded'] = true;
    });

    it('should crouch when grounded', () => {
      player.crouch();
      
      expect(player.getState()).toBe(PlayerState.Crouching);
    });

    it('should not crouch when airborne', () => {
      player['isGrounded'] = false;
      player.crouch();
      
      expect(player.getState()).not.toBe(PlayerState.Crouching);
    });

    it('should slide when crouching at high speed', () => {
      // Set velocity to 90% of max speed
      player['currentVelocityX'] = PLAYER_CONFIG.MOVE_SPEED * 0.9;
      player.moveRight(1/60);
      player.update(1/60);
      player.crouch();
      
      expect(player.getState()).toBe(PlayerState.Sliding);
    });

    it('should stand up when stand is called', () => {
      player.crouch();
      player.stand();
      
      expect(player.getState()).not.toBe(PlayerState.Crouching);
    });
  });

  describe('aiming and throwing', () => {
    it('should start aiming when has boomerang', () => {
      player.startAiming();
      
      expect(player.getState()).toBe(PlayerState.Aiming);
    });

    it('should not aim without boomerang', () => {
      player.setHasBoomerang(false);
      player.startAiming();
      
      expect(player.getState()).not.toBe(PlayerState.Aiming);
    });

    it('should throw boomerang when stopping aim', () => {
      player.startAiming();
      player.stopAiming();
      
      expect(mockProjectileManager.spawnBoomerang).toHaveBeenCalled();
      expect(player.getHasBoomerang()).toBe(false);
    });

    it('should update aim angle from mouse delta', () => {
      player.startAiming();
      player.updateAimAngleFromMouseDelta(70); // Half of max distance
      
      // Should be 140 degrees (180 - 40)
      expect(player['aimAngle']).toBe(140);
    });

    it('should clamp aim angle to valid range', () => {
      player.startAiming();
      player.updateAimAngle(200); // Above max
      expect(player['aimAngle']).toBe(180);
      
      player.updateAimAngle(90); // Below min
      expect(player['aimAngle']).toBe(100);
    });
  });

  describe('blocking and parrying', () => {
    it('should start blocking without boomerang', () => {
      player.setHasBoomerang(false);
      player.startBlocking();
      
      expect(player.getState()).toBe(PlayerState.Blocking);
    });

    it('should have parry window when blocking', () => {
      player.setHasBoomerang(false);
      player.startBlocking();
      player.update(0.1); // 0.1 seconds
      
      expect(player.isInParryWindow()).toBe(true);
    });

    it('should lose parry window after duration', () => {
      player.setHasBoomerang(false);
      player.startBlocking();
      player.update(PARRY_CONFIG.WINDOW_DURATION + 0.1);
      
      expect(player.isInParryWindow()).toBe(false);
    });
  });

  describe('boomerang riding', () => {
    let mockBoomerang: any;

    beforeEach(() => {
      mockBoomerang = {
        getPosition: vi.fn().mockReturnValue({ x: 200, y: 300 }),
        getCurrentVelocity: vi.fn().mockReturnValue({ x: 100, y: 50 }),
      };
    });

    it('should mount boomerang', () => {
      player.mountBoomerang(mockBoomerang);
      
      expect(player.getIsRiding()).toBe(true);
      expect(player['isGrounded']).toBe(false);
    });

    it('should follow boomerang position when riding', () => {
      player.mountBoomerang(mockBoomerang);
      player.update(1/60);
      
      expect(mockBoomerang.getPosition).toHaveBeenCalled();
      // Player should be 20 units above boomerang
      expect(player['rigidBody'].setTranslation).toHaveBeenCalledWith(
        { x: 200, y: 280 }, 
        true
      );
    });

    it('should dismount with launch velocity', () => {
      player.mountBoomerang(mockBoomerang);
      player.dismountBoomerang({ x: 150, y: -100 });
      
      expect(player.getIsRiding()).toBe(false);
      expect(player['rigidBody'].setLinvel).toHaveBeenCalledWith(
        { x: 150, y: -100 }, 
        true
      );
    });
  });

  describe('physics integration', () => {
    it('should apply gravity when falling', () => {
      player['isGrounded'] = false;
      const mockVel = { x: 0, y: 100 };
      player['rigidBody'].linvel.mockReturnValue(mockVel);
      
      player.update(1/60);
      
      // Should apply fall gravity multiplier
      const expectedGravity = PHYSICS_CONFIG.GRAVITY.y * (PHYSICS_CONFIG.FALL_GRAVITY_MULTIPLIER - 1) * (1/60);
      expect(player['rigidBody'].setLinvel).toHaveBeenCalled();
    });

    it('should cap fall speed at terminal velocity', () => {
      player['isGrounded'] = false;
      const mockVel = { x: 0, y: 1000 }; // Above terminal velocity
      player['rigidBody'].linvel.mockReturnValue(mockVel);
      
      player.update(1/60);
      
      const setVelCall = player['rigidBody'].setLinvel.mock.calls[0][0];
      expect(setVelCall.y).toBeLessThanOrEqual(PHYSICS_CONFIG.MAX_FALL_SPEED);
    });
  });

  describe('state machine transitions', () => {
    it('should transition from idle to moving', () => {
      player.moveRight(1/60);
      player.update(1/60);
      
      expect(player.getState()).toBe(PlayerState.Moving);
    });

    it('should transition to airborne when not grounded', () => {
      // Mock no ground hit
      mockWorld.castRay.mockReturnValue(null);
      player.update(1/60);
      
      expect(player.getState()).toBe(PlayerState.Airborne);
    });

    it('should exit blocking when trying to move', () => {
      player.setHasBoomerang(false);
      player.startBlocking();
      player.moveLeft(1/60);
      
      expect(player.getState()).not.toBe(PlayerState.Blocking);
    });
  });

  describe('collision detection', () => {
    it('should update collider size when crouching', () => {
      const initialHeight = PLAYER_CONFIG.HEIGHT;
      player.crouch();
      
      expect(mockWorld.removeCollider).toHaveBeenCalled();
      expect(mockWorld.createCollider).toHaveBeenCalled();
      expect(mockRapier.ColliderDesc.cuboid).toHaveBeenCalledWith(
        PLAYER_CONFIG.WIDTH / 2,
        PLAYER_CONFIG.CROUCH_HEIGHT / 2
      );
    });

    it('should restore collider size when standing', () => {
      player.crouch();
      player.stand();
      
      const lastCuboidCall = mockRapier.ColliderDesc.cuboid.mock.calls.slice(-1)[0];
      expect(lastCuboidCall[1]).toBe(PLAYER_CONFIG.HEIGHT / 2);
    });
  });
});