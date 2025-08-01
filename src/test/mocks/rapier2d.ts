import { vi } from 'vitest';

export const World = vi.fn().mockImplementation(() => ({
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
}));

export const RigidBodyDesc = {
  dynamic: vi.fn().mockReturnValue({
    setTranslation: vi.fn().mockReturnThis(),
    lockRotations: vi.fn().mockReturnThis(),
  }),
  fixed: vi.fn().mockReturnValue({
    setTranslation: vi.fn().mockReturnThis(),
  }),
};

export const ColliderDesc = {
  cuboid: vi.fn().mockReturnValue({
    setRestitution: vi.fn().mockReturnThis(),
    setFriction: vi.fn().mockReturnThis(),
  }),
};

export const Ray = vi.fn().mockImplementation(() => ({
  origin: { x: 0, y: 0 },
  direction: { x: 0, y: 1 },
}));

const rapierMock = {
  World,
  RigidBodyDesc,
  ColliderDesc,
  Ray,
};

export default rapierMock;