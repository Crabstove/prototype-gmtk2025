import type * as RAPIER from '@dimforge/rapier2d';

// ============= Physics Types =============
export interface Vector2 {
  x: number;
  y: number;
}

export type RapierWorld = RAPIER.World;
export type RapierRigidBody = RAPIER.RigidBody;
export type RapierCollider = RAPIER.Collider;

// ============= Player Types =============
export enum PlayerState {
  Idle = 'idle',
  Moving = 'moving',
  Crouching = 'crouching',
  Sliding = 'sliding',
  Blocking = 'blocking',
  Airborne = 'airborne',
  Aiming = 'aiming',
}

export interface PlayerStateContext {
  hasBoomerang: boolean;
  isGrounded: boolean;
  velocity: { x: number; y: number };
  isFacingRight: boolean;
  timeSinceStateChange: number;
}

export interface StateTransitionResult {
  newState: PlayerState;
  shouldTransition: boolean;
}

// ============= Boomerang Types =============
export enum BoomerangState {
  Throwing,
  Hanging,
  Returning,
  Caught
}

export interface BoomerangThrowParams {
  origin: { x: number; y: number };
  angle: number; // degrees
  facingRight: boolean;
}

export interface IBoomerang {
  getPosition(): { x: number; y: number } | null;
  getCurrentVelocity(): { x: number; y: number };
  catch(): void;
}

// ============= Input Types =============
export type InputKey = 'KeyA' | 'KeyD' | 'KeyS' | 'KeyF' | 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ControlLeft' | 'ControlRight' | 'KeyC';

export interface InputState {
  [key: string]: boolean;
}

export interface InputActions {
  moveLeft: boolean;
  moveRight: boolean;
  crouch: boolean;
  action: boolean; // throw/block/catch
}