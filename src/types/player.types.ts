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