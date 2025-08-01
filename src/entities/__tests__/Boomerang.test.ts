import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Boomerang } from '../Boomerang';
import { BoomerangState } from '../../types';

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

describe('Boomerang', () => {
  let boomerang: Boomerang;
  let mockWorld: any;
  let mockContainer: PIXI.Container;
  let mockRigidBody: any;
  let mockCollider: any;
  
  beforeEach(() => {
    // Mock RAPIER world
    mockRigidBody = {
      translation: vi.fn(() => ({ x: 0, y: 0 })),
      setTranslation: vi.fn(),
      handle: 1
    };
    
    mockCollider = {
      handle: 2
    };
    
    mockWorld = {
      createRigidBody: vi.fn(() => mockRigidBody),
      createCollider: vi.fn(() => mockCollider),
      removeRigidBody: vi.fn(),
      removeCollider: vi.fn(),
      intersectionPair: vi.fn(),
      intersectionsWith: vi.fn(),
      getCollider: vi.fn((handle) => mockCollider),
      getRigidBody: vi.fn((handle) => mockRigidBody)
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
  
  describe('initialization', () => {
    it('should start in Caught state', () => {
      expect(boomerang.getState()).toBe(BoomerangState.Caught);
    });
    
    it('should have no position when caught', () => {
      expect(boomerang.getPosition()).toBeNull();
    });
    
    it('should have no collider when caught', () => {
      expect(boomerang.getCollider()).toBeNull();
    });
  });
  
  describe('throwing', () => {
    const throwParams = {
      origin: { x: 100, y: 200 },
      angle: 150,
      facingRight: true
    };
    
    it('should transition to Throwing state when thrown', () => {
      boomerang.throw(throwParams);
      expect(boomerang.getState()).toBe(BoomerangState.Throwing);
    });
    
    it('should create rigid body at throw position', () => {
      boomerang.throw(throwParams);
      expect(mockWorld.createRigidBody).toHaveBeenCalled();
    });
    
    it('should not throw if already in flight', () => {
      boomerang.throw(throwParams);
      mockWorld.createRigidBody.mockClear();
      
      boomerang.throw(throwParams);
      expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
    });
    
    it('should determine straight line trajectory for angles >= 168', () => {
      boomerang.throw({ ...throwParams, angle: 180 });
      // Implementation detail - would need to expose isStraightLine for proper testing
      expect(boomerang.getState()).toBe(BoomerangState.Throwing);
    });
  });
  
  describe('physics update', () => {
    beforeEach(() => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
    });
    
    it('should update position during throwing state', () => {
      boomerang.update(0.016); // 16ms
      expect(mockRigidBody.setTranslation).toHaveBeenCalled();
    });
    
    it('should enter hang state when reaching max distance', () => {
      // Simulate traveling max distance
      for (let i = 0; i < 100; i++) {
        boomerang.update(0.1);
        if (boomerang.getState() === BoomerangState.Hanging) break;
      }
      expect(boomerang.getState()).toBe(BoomerangState.Hanging);
    });
  });
  
  describe('wall collision', () => {
    beforeEach(() => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 150,
        facingRight: true
      });
    });
    
    it('should enter hang state on wall collision', () => {
      boomerang.checkWallCollision();
      expect(boomerang.getState()).toBe(BoomerangState.Hanging);
    });
    
    it('should not affect state if already hanging', () => {
      boomerang.checkWallCollision();
      expect(boomerang.getState()).toBe(BoomerangState.Hanging);
      
      boomerang.checkWallCollision();
      expect(boomerang.getState()).toBe(BoomerangState.Hanging);
    });
  });
  
  describe('catching', () => {
    beforeEach(() => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
    });
    
    it('should return to Caught state when caught', () => {
      boomerang.catch();
      expect(boomerang.getState()).toBe(BoomerangState.Caught);
    });
    
    it('should cleanup physics bodies when caught', () => {
      boomerang.catch();
      expect(mockWorld.removeCollider).toHaveBeenCalled();
      expect(mockWorld.removeRigidBody).toHaveBeenCalled();
    });
    
    it('should have no position after being caught', () => {
      boomerang.catch();
      expect(boomerang.getPosition()).toBeNull();
    });
  });
  
  describe('collision callbacks', () => {
    it('should call player collision callback when set', () => {
      const mockCallback = vi.fn();
      boomerang.setOnPlayerCollision(mockCallback);
      
      boomerang.handlePlayerCollision();
      expect(mockCallback).toHaveBeenCalled();
    });
    
    it('should not error if no callback is set', () => {
      expect(() => boomerang.handlePlayerCollision()).not.toThrow();
    });
  });
  
  describe('cleanup', () => {
    it('should cleanup resources when destroyed', () => {
      boomerang.throw({
        origin: { x: 0, y: 0 },
        angle: 180,
        facingRight: true
      });
      
      boomerang.destroy();
      expect(mockWorld.removeCollider).toHaveBeenCalled();
      expect(mockWorld.removeRigidBody).toHaveBeenCalled();
    });
  });
});