import type * as RAPIER from '@dimforge/rapier2d';

export interface Vector2 {
  x: number;
  y: number;
}

export type RapierWorld = RAPIER.World;
export type RapierRigidBody = RAPIER.RigidBody;
export type RapierCollider = RAPIER.Collider;