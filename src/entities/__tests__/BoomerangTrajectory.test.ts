import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Boomerang } from '../Boomerang';
import { BoomerangState } from '../../types';
import { BOOMERANG_CONFIG } from '../../constants';

// Mock PIXI
vi.mock('pixi.js', () => ({
  Graphics: vi.fn(() => ({
    visible: false,
    circle: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    clear: vi.fn().mockReturnThis(),
    moveTo: vi.fn().mockReturnThis(),
    lineTo: vi.fn().mockReturnThis(),
    closePath: vi.fn().mockReturnThis(),
    x: 0,
    y: 0,
    rotation: 0,
    zIndex: 0,
    destroy: vi.fn(),
    parent: null,
    renderable: true,
    worldVisible: true,
    alpha: 1,
    tint: 0xffffff,
    getBounds: vi.fn(() => ({ x: 0, y: 0, width: 60, height: 60 }))
  }))
}));

describe('Boomerang Trajectory', () => {
  let boomerang: Boomerang;
  let mockWorld: any;
  let mockContainer: any;
  let mockRigidBody: any;
  let mockCollider: any;
  let currentPosition = { x: 0, y: 0 };
  
  beforeEach(() => {
    // Reset position
    currentPosition = { x: 0, y: 0 };
    
    // Mock RAPIER world
    mockRigidBody = {
      translation: vi.fn(() => ({ ...currentPosition })),
      setTranslation: vi.fn((pos) => {
        currentPosition.x = pos.x;
        currentPosition.y = pos.y;
      }),
      handle: 1
    };
    
    mockCollider = {
      handle: 2
    };
    
    mockWorld = {
      createRigidBody: vi.fn(() => {
        // Set initial position when body is created
        if (mockRigidBody.setTranslation.mock.calls.length > 0) {
          const lastCall = mockRigidBody.setTranslation.mock.calls[mockRigidBody.setTranslation.mock.calls.length - 1];
          currentPosition.x = lastCall[0].x;
          currentPosition.y = lastCall[0].y;
        }
        return mockRigidBody;
      }),
      createCollider: vi.fn(() => mockCollider),
      removeRigidBody: vi.fn(),
      removeCollider: vi.fn(),
      intersectionPair: vi.fn(),
      intersectionsWith: vi.fn(),
      getCollider: vi.fn(() => mockCollider),
      getRigidBody: vi.fn(() => mockRigidBody)
    };
    
    // Mock PIXI container
    mockContainer = {
      addChild: vi.fn((child) => {
        child.parent = mockContainer;
        return child;
      })
    } as any;
    
    // Mock RAPIER module
    const mockRapierModule = {
      RigidBodyDesc: {
        kinematicPositionBased: () => ({
          setTranslation: () => ({})
        })
      },
      ColliderDesc: {
        ball: vi.fn(() => ({
          setSensor: vi.fn().mockReturnThis(),
          setActiveEvents: vi.fn().mockReturnThis(),
          setCollisionGroups: vi.fn().mockReturnThis(),
        }))
      },
      ActiveEvents: {
        COLLISION_EVENTS: 1
      }
    } as any;
    
    boomerang = new Boomerang(mockWorld, mockContainer, mockRapierModule);
  });
  
  describe('angle calculations', () => {
    it('should calculate correct velocity for right-facing straight throw (180°)', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      const velocity = boomerang.getTargetVelocity();
      expect(velocity.x).toBeCloseTo(400); // cos(0°) * 400 = 400
      expect(velocity.y).toBeCloseTo(0);    // sin(0°) * 400 = 0
    });
    
    it('should calculate correct velocity for left-facing straight throw (180°)', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: false
      });
      
      const velocity = boomerang.getTargetVelocity();
      expect(velocity.x).toBeCloseTo(-400); // cos(180°) * 400 = -400
      expect(velocity.y).toBeCloseTo(0);     // sin(180°) * 400 = 0
    });
    
    it('should calculate correct velocity for right-facing upward throw (110°)', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 110,
        facingRight: true
      });
      
      const velocity = boomerang.getTargetVelocity();
      // Boomerang uses simple horizontal velocity
      expect(velocity.x).toBe(BOOMERANG_CONFIG.THROW_SPEED);
      expect(velocity.y).toBe(0);
    });
    
    it('should calculate correct velocity for left-facing upward throw (110°)', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 110,
        facingRight: false
      });
      
      const velocity = boomerang.getTargetVelocity();
      // Boomerang uses simple horizontal velocity
      expect(velocity.x).toBe(-BOOMERANG_CONFIG.THROW_SPEED);
      expect(velocity.y).toBe(0);
    });
    
    it('should identify straight line trajectories', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 170,
        facingRight: true
      });
      
      expect(boomerang.getIsStraightLine()).toBe(true);
    });
    
    it('should identify parabolic trajectories', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 150,
        facingRight: true
      });
      
      expect(boomerang.getIsStraightLine()).toBe(false);
    });
  });
  
  describe('position updates', () => {
    it('should start at throw origin', () => {
      const origin = { x: 100, y: 200 };
      boomerang.throw({
        origin,
        angle: 180,
        facingRight: true
      });
      
      const position = boomerang.getPosition();
      expect(position).toEqual(origin);
    });
    
    it('should update velocity based on position changes', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      // Initial velocity should be zero
      const initialVel = boomerang.getCurrentVelocity();
      expect(initialVel.x).toBe(0);
      expect(initialVel.y).toBe(0);
      
      // After update, velocity is calculated from position delta
      boomerang.update(0.05);
      const currentVel = boomerang.getCurrentVelocity();
      
      // Velocity should be non-zero after movement
      expect(Math.abs(currentVel.x)).toBeGreaterThan(0);
    });
    
    it('should move in correct direction for right-facing throw', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      // Skip acceleration phase
      boomerang.update(0.1);
      
      // Update for 1 second
      boomerang.update(1.0);
      
      const position = boomerang.getPosition();
      expect(position!.x).toBeGreaterThan(300); // Should move right
      expect(position!.y).toBeCloseTo(0, 1);    // Should stay level
    });
    
    it('should move in correct direction for left-facing throw', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: false
      });
      
      // Skip acceleration phase
      boomerang.update(0.1);
      
      // Update for 1 second
      boomerang.update(1.0);
      
      const position = boomerang.getPosition();
      expect(position!.x).toBeLessThan(-300); // Should move left
      expect(position!.y).toBeCloseTo(0, 1);   // Should stay level
    });
    
    it('should follow parabolic path for angled throw', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 150,
        facingRight: true
      });
      
      // Skip acceleration
      boomerang.update(0.1);
      
      // Track positions over time
      const positions: Array<{x: number, y: number}> = [];
      for (let i = 0; i < 10; i++) {
        boomerang.update(0.05);
        const pos = boomerang.getPosition();
        if (pos) positions.push({ ...pos });
      }
      
      // Should move right and up
      expect(positions[9].x).toBeGreaterThan(positions[0].x);
      expect(positions[9].y).toBeLessThan(positions[0].y); // Y decreases as we go up
      
      // Verify parabolic motion
      const xDistances = positions.map((_, i) => 
        i > 0 ? positions[i].x - positions[i-1].x : 0
      ).slice(1);
      
      // X distance should be roughly constant
      const avgXDist = xDistances.reduce((a, b) => a + b) / xDistances.length;
      xDistances.forEach(dist => {
        expect(dist).toBeCloseTo(avgXDist, 1);
      });
    });
  });
  
  describe('distance tracking', () => {
    it('should track horizontal distance traveled', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      // Skip acceleration
      boomerang.update(0.1);
      
      // Reset distance after acceleration
      const distanceAfterAccel = boomerang.getDistanceTraveled();
      
      // Travel for 0.5 seconds at 400 units/sec
      boomerang.update(0.5);
      
      const totalDistance = boomerang.getDistanceTraveled();
      const travelDistance = totalDistance - distanceAfterAccel;
      expect(travelDistance).toBeCloseTo(200, 1); // 400 * 0.5 = 200
    });
    
    it('should enter hang state at max distance', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      // Skip acceleration
      boomerang.update(0.1);
      
      // Travel until hang state
      let updates = 0;
      while (boomerang.getState() === BoomerangState.Throwing && updates < 100) {
        boomerang.update(0.016);
        updates++;
      }
      
      expect(boomerang.getState()).toBe(BoomerangState.Hanging);
      // Allow for small floating point errors
      const distance = boomerang.getDistanceTraveled();
      expect(distance).toBeGreaterThanOrEqual(BOOMERANG_CONFIG.THROW_DISTANCE);
      expect(distance).toBeLessThan(BOOMERANG_CONFIG.THROW_DISTANCE + 5);
    });
  });
  
  describe('sprite visibility', () => {
    it('should be invisible when caught', () => {
      expect(boomerang.getState()).toBe(BoomerangState.Caught);
      // Sprite visibility is set in constructor
    });
    
    it('should become visible when thrown', () => {
      const sprite = (boomerang as any).sprite;
      expect(sprite.visible).toBe(false);
      
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      expect(sprite.visible).toBe(true);
    });
  });
  
  describe('physics body creation', () => {
    it('should create rigid body on throw', () => {
      expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
      
      boomerang.throw({
        origin: { x: 100, y: 200 },
        angle: 180,
        facingRight: true
      });
      
      expect(mockWorld.createRigidBody).toHaveBeenCalledOnce();
    });
    
    it('should create physics bodies only once per throw', () => {
      // First throw
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      expect(mockWorld.createRigidBody).toHaveBeenCalledOnce();
      expect(mockWorld.createCollider).toHaveBeenCalledOnce();
      
      // Try to throw again while in flight - should not create new bodies
      mockWorld.createRigidBody.mockClear();
      mockWorld.createCollider.mockClear();
      
      boomerang.throw({
        origin: { x: 100, y: 100 },
        angle: 180,
        facingRight: true
      });
      
      // Should not create new bodies since boomerang is already in flight
      expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
      expect(mockWorld.createCollider).not.toHaveBeenCalled();
    });
  });
});