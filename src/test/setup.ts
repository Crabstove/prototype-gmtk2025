import 'vitest-canvas-mock';
import { vi } from 'vitest';

// Mock PIXI.js
vi.mock('pixi.js', () => ({
  Application: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    stage: {
      addChild: vi.fn(),
    },
    ticker: {
      add: vi.fn(),
      deltaMS: 16.67,
    },
    view: {},
    screen: {
      width: 800,
      height: 600,
    },
  })),
  Container: vi.fn().mockImplementation(() => ({
    addChild: vi.fn(),
    x: 0,
    y: 0,
  })),
  Graphics: vi.fn().mockImplementation(() => ({
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    clear: vi.fn().mockReturnThis(),
    x: 0,
    y: 0,
    tint: 0xffffff,
    destroy: vi.fn(),
  })),
}));

// Mock Rapier2D - make it a proper ES module mock
vi.mock('@dimforge/rapier2d', () => {
  const mockModule = {
    World: vi.fn().mockImplementation(() => ({
      createRigidBody: vi.fn().mockReturnValue({
        translation: vi.fn().mockReturnValue({ x: 0, y: 0 }),
        linvel: vi.fn().mockReturnValue({ x: 0, y: 0 }),
        setLinvel: vi.fn(),
        colliders: vi.fn().mockReturnValue([]),
      }),
      createCollider: vi.fn(),
      removeCollider: vi.fn(),
      step: vi.fn(),
      castRay: vi.fn(),
    })),
    RigidBodyDesc: {
      dynamic: vi.fn().mockReturnValue({
        setTranslation: vi.fn().mockReturnThis(),
        lockRotations: vi.fn().mockReturnThis(),
      }),
      fixed: vi.fn().mockReturnValue({
        setTranslation: vi.fn().mockReturnThis(),
      }),
    },
    ColliderDesc: {
      cuboid: vi.fn().mockReturnValue({
        setRestitution: vi.fn().mockReturnThis(),
        setFriction: vi.fn().mockReturnThis(),
      }),
    },
    Ray: vi.fn().mockImplementation(() => ({
      origin: { x: 0, y: 0 },
      direction: { x: 0, y: 1 },
    })),
  };
  
  return {
    default: mockModule,
    ...mockModule,
  };
});

// Mock performance.now() for consistent timing in tests
global.performance = {
  now: vi.fn(() => Date.now()),
} as any;