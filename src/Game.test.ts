import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Game } from './Game';
import { PlayerState } from './types';

// Mock PIXI
vi.mock('pixi.js', () => ({
  Application: vi.fn(() => ({
    init: vi.fn().mockResolvedValue(true),
    stage: {
      addChild: vi.fn(),
    },
    ticker: {
      add: vi.fn(),
      deltaMS: 16.67,
    },
    canvas: document.createElement('canvas'),
  })),
  Container: vi.fn(() => ({
    addChild: vi.fn(),
    removeChild: vi.fn(),
    sortableChildren: false,
    zIndex: 0,
  })),
  Graphics: vi.fn(() => ({
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    clear: vi.fn().mockReturnThis(),
    moveTo: vi.fn().mockReturnThis(),
    lineTo: vi.fn().mockReturnThis(),
    circle: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    visible: false,
    alpha: 0,
    tint: 0,
    x: 0,
    y: 0,
  })),
}));

// Mock Rapier
const mockRapier = {
  World: vi.fn((gravity) => ({
    step: vi.fn(),
    createRigidBody: vi.fn().mockReturnValue({
      translation: vi.fn().mockReturnValue({ x: 0, y: 0 }),
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
    castRay: vi.fn().mockReturnValue({ toi: 1 }),
    intersectionPair: vi.fn().mockReturnValue(false),
    intersectionsWith: vi.fn(),
  })),
  RigidBodyDesc: {
    dynamic: vi.fn().mockReturnValue({
      setTranslation: vi.fn().mockReturnThis(),
      lockRotations: vi.fn().mockReturnThis(),
    }),
    kinematicPositionBased: vi.fn().mockReturnValue({
      setTranslation: vi.fn().mockReturnThis(),
    }),
    fixed: vi.fn().mockReturnValue({
      setTranslation: vi.fn().mockReturnThis(),
    }),
  },
  ColliderDesc: {
    cuboid: vi.fn().mockReturnValue({
      setRestitution: vi.fn().mockReturnThis(),
      setFriction: vi.fn().mockReturnThis(),
      setCollisionGroups: vi.fn().mockReturnThis(),
      setActiveEvents: vi.fn().mockReturnThis(),
    }),
    ball: vi.fn().mockReturnValue({
      setSensor: vi.fn().mockReturnThis(),
      setActiveEvents: vi.fn().mockReturnThis(),
      setCollisionGroups: vi.fn().mockReturnThis(),
    }),
  },
  ActiveEvents: {
    COLLISION_EVENTS: 1,
  },
  Ray: vi.fn().mockImplementation((origin, dir) => ({ origin, dir })),
};

describe('Game', () => {
  let game: Game;

  beforeEach(async () => {
    vi.clearAllMocks();
    game = new Game();
    await game.init(mockRapier as any);
  });

  describe('initialization', () => {
    it('should initialize PIXI application', () => {
      expect(game['app']).toBeDefined();
      expect(game['app'].init).toHaveBeenCalled();
    });

    it('should create physics world', () => {
      expect(mockRapier.World).toHaveBeenCalled();
      expect(game['world']).toBeDefined();
    });

    it('should create game entities', () => {
      expect(game['player']).toBeDefined();
      expect(game['level']).toBeDefined();
      expect(game['projectileManager']).toBeDefined();
    });

    it('should setup input and camera systems', () => {
      expect(game['inputSystem']).toBeDefined();
      expect(game['cameraSystem']).toBeDefined();
      expect(game['timeSlowEffect']).toBeDefined();
    });
  });

  describe('game loop', () => {
    it('should update physics at fixed timestep', () => {
      // Simulate a frame
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();

      expect(game['world'].step).toHaveBeenCalled();
    });

    it('should update entities in correct order', () => {
      // Spy on update methods
      const playerUpdateSpy = vi.spyOn(game['player'], 'update');
      const projectileUpdateSpy = vi.spyOn(game['projectileManager'], 'update');

      // Simulate a frame
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();

      // Projectiles should update before player (for riding mechanics)
      const playerCallOrder = playerUpdateSpy.mock.invocationCallOrder[0];
      const projectileCallOrder = projectileUpdateSpy.mock.invocationCallOrder[0];
      
      expect(projectileCallOrder).toBeLessThan(playerCallOrder);
    });
  });

  describe('input handling', () => {
    let mockInputActions: any;

    beforeEach(() => {
      mockInputActions = {
        moveLeft: false,
        moveRight: false,
        crouch: false,
        action: false,
      };
      game['inputSystem'].getActions = vi.fn().mockReturnValue(mockInputActions);
    });

    it('should handle movement inputs', () => {
      const moveLeftSpy = vi.spyOn(game['player'], 'moveLeft');
      const moveRightSpy = vi.spyOn(game['player'], 'moveRight');
      
      // Test left movement
      mockInputActions.moveLeft = true;
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(moveLeftSpy).toHaveBeenCalled();
      
      // Test right movement
      mockInputActions.moveLeft = false;
      mockInputActions.moveRight = true;
      updateFn();
      
      expect(moveRightSpy).toHaveBeenCalled();
    });

    it('should handle crouch input', () => {
      const crouchSpy = vi.spyOn(game['player'], 'crouch');
      const standSpy = vi.spyOn(game['player'], 'stand');
      
      mockInputActions.crouch = true;
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(crouchSpy).toHaveBeenCalled();
      
      mockInputActions.crouch = false;
      updateFn();
      
      expect(standSpy).toHaveBeenCalled();
    });

    it('should handle action button for aiming', () => {
      const startAimingSpy = vi.spyOn(game['player'], 'startAiming');
      game['player'].getHasBoomerang = vi.fn().mockReturnValue(true);
      game['player'].getState = vi.fn().mockReturnValue(PlayerState.Idle);
      
      mockInputActions.action = true;
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(startAimingSpy).toHaveBeenCalled();
    });

    it('should handle action button for blocking', () => {
      const startBlockingSpy = vi.spyOn(game['player'], 'startBlocking');
      game['player'].getHasBoomerang = vi.fn().mockReturnValue(false);
      
      mockInputActions.action = true;
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(startBlockingSpy).toHaveBeenCalled();
    });
  });

  describe('time slow effect', () => {
    beforeEach(() => {
      game['inputSystem'].getActions = vi.fn().mockReturnValue({
        moveLeft: false,
        moveRight: false,
        crouch: false,
        action: false,
      });
    });

    it('should activate time slow when aiming', () => {
      const startTimeSlowSpy = vi.spyOn(game['timeSlowEffect'], 'startTimeSlow');
      
      // Mock the player being able to aim and then aiming
      game['player'].getHasBoomerang = vi.fn().mockReturnValue(true);
      game['player'].getState = vi.fn().mockReturnValue(PlayerState.Aiming);
      
      // Mock action button being pressed
      game['inputSystem'].getActions = vi.fn().mockReturnValue({
        moveLeft: false,
        moveRight: false,
        crouch: false,
        action: true,
      });
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(startTimeSlowSpy).toHaveBeenCalled();
    });

    it('should deactivate time slow when not aiming', () => {
      const stopTimeSlowSpy = vi.spyOn(game['timeSlowEffect'], 'stopTimeSlow');
      game['timeSlowEffect'].getIsActive = vi.fn().mockReturnValue(true);
      game['player'].getState = vi.fn().mockReturnValue(PlayerState.Idle);
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(stopTimeSlowSpy).toHaveBeenCalled();
    });

    it('should scale deltaTime when time slow is active', () => {
      const playerUpdateSpy = vi.spyOn(game['player'], 'update');
      game['player'].getState = vi.fn().mockReturnValue(PlayerState.Aiming);
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      // Player should receive scaled deltaTime
      const deltaTime = game['app'].ticker.deltaMS / 1000;
      const scaledDeltaTime = deltaTime * 0.1; // TIME_SLOW_CONFIG.TIME_SCALE
      
      expect(playerUpdateSpy).toHaveBeenCalledWith(expect.closeTo(scaledDeltaTime, 5));
    });
  });

  describe('riding mechanics', () => {
    beforeEach(() => {
      game['inputSystem'].getActions = vi.fn().mockReturnValue({
        moveLeft: false,
        moveRight: false,
        crouch: false,
        action: false,
      });
    });

    it('should handle catch while riding', () => {
      const mockBoomerang = {
        getCurrentVelocity: vi.fn().mockReturnValue({ x: 100, y: -50 }),
        catch: vi.fn(),
      };
      
      game['player'].getIsRiding = vi.fn().mockReturnValue(true);
      game['player']['ridingBoomerang'] = mockBoomerang;
      game['player'].dismountBoomerang = vi.fn();
      game['player'].setHasBoomerang = vi.fn();
      
      game['inputSystem'].getActions = vi.fn().mockReturnValue({ action: true });
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(game['player'].dismountBoomerang).toHaveBeenCalledWith({ x: 100, y: -50 });
      expect(mockBoomerang.catch).toHaveBeenCalled();
      expect(game['player'].setHasBoomerang).toHaveBeenCalledWith(true);
    });
  });

  describe('collision detection', () => {
    it('should check projectile collisions each frame', () => {
      const checkCollisionsSpy = vi.spyOn(game['projectileManager'], 'checkCollisions');
      const playerCollider = { handle: 1 };
      game['player'].getCollider = vi.fn().mockReturnValue(playerCollider);
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(checkCollisionsSpy).toHaveBeenCalledWith(playerCollider);
    });
  });

  describe('camera system', () => {
    it('should follow player position', () => {
      const setTargetSpy = vi.spyOn(game['cameraSystem'], 'setTarget');
      const playerPos = { x: 200, y: 300 };
      game['player'].getPosition = vi.fn().mockReturnValue(playerPos);
      
      const updateFn = game['app'].ticker.add.mock.calls[0][0];
      updateFn();
      
      expect(setTargetSpy).toHaveBeenCalledWith(playerPos);
    });
  });
});