import { StateMachine } from '../../systems/StateMachine';
import { PlayerState, PlayerStateContext } from '../../types/player.types';
import { PLAYER_CONFIG } from '../../constants';

export class PlayerStateMachine extends StateMachine<PlayerState, PlayerStateContext> {
  private timeAtZeroVelocity: number = 0;
  private wasMovingInSlide: boolean = false;
  
  constructor() {
    super(PlayerState.Idle);
  }
  
  protected getNextState(currentState: PlayerState, context: PlayerStateContext): PlayerState {
    const { isGrounded, velocity } = context;
    
    // Airborne takes priority - if not grounded, must be airborne
    if (!isGrounded) {
      return PlayerState.Airborne;
    }
    
    // Ground-based state transitions
    switch (currentState) {
      case PlayerState.Idle:
        if (Math.abs(velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD) {
          return PlayerState.Moving;
        }
        break;
        
      case PlayerState.Moving:
        if (Math.abs(velocity.x) <= PLAYER_CONFIG.VELOCITY_THRESHOLD) {
          return PlayerState.Idle;
        }
        break;
        
      case PlayerState.Crouching:
        // Crouching transitions handled by input
        break;
        
      case PlayerState.Sliding:
        // Check if enough time has passed at zero velocity
        if (Math.abs(velocity.x) <= PLAYER_CONFIG.VELOCITY_THRESHOLD && 
            this.timeAtZeroVelocity >= 1.0) { // slideTransitionDelay from GDD
          return PlayerState.Crouching;
        }
        break;
        
      case PlayerState.Blocking:
        // Blocking transitions handled by input release
        break;
        
      case PlayerState.Airborne:
        if (isGrounded) {
          // Landing transitions
          if (Math.abs(velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD) {
            return PlayerState.Moving;
          } else {
            return PlayerState.Idle;
          }
        }
        break;
        
      case PlayerState.Aiming:
        // Exit aiming if player is no longer grounded (falling/jumping)
        if (!isGrounded) {
          return PlayerState.Airborne;
        }
        break;
    }
    
    return currentState;
  }
  
  protected onEnter(state: PlayerState): void {
    // Reset sliding velocity tracking when entering slide state
    if (state === PlayerState.Sliding) {
      this.timeAtZeroVelocity = 0;
      this.wasMovingInSlide = true;
    }
  }
  
  protected onExit(_state: PlayerState): void {
    // State exit logic will be handled by Player class
  }
  
  protected onUpdate(state: PlayerState, deltaTime: number, context: PlayerStateContext): void {
    // Handle time-based state logic here instead of in getNextState
    if (state === PlayerState.Sliding) {
      const { velocity } = context;
      if (Math.abs(velocity.x) <= PLAYER_CONFIG.VELOCITY_THRESHOLD) {
        if (this.wasMovingInSlide) {
          this.timeAtZeroVelocity = 0;
          this.wasMovingInSlide = false;
        }
        this.timeAtZeroVelocity += deltaTime;
      } else {
        this.wasMovingInSlide = true;
      }
    }
  }
  
  // Manual state transitions for input-driven changes
  public requestCrouch(): void {
    const currentState = this.getCurrentState();
    if (currentState === PlayerState.Idle || currentState === PlayerState.Moving) {
      this.transition(PlayerState.Crouching);
    }
  }
  
  public requestStand(): void {
    if (this.getCurrentState() === PlayerState.Crouching) {
      this.transition(PlayerState.Idle);
    }
  }
  
  public requestSlide(velocity: { x: number }): void {
    const currentState = this.getCurrentState();
    if (currentState === PlayerState.Moving && Math.abs(velocity.x) >= PLAYER_CONFIG.MOVE_SPEED * 0.9) {
      this.transition(PlayerState.Sliding);
    }
  }
  
  public requestBlock(hasBoomerang: boolean): void {
    const currentState = this.getCurrentState();
    if (!hasBoomerang && 
        (currentState === PlayerState.Idle || 
         currentState === PlayerState.Moving || 
         currentState === PlayerState.Crouching)) {
      this.transition(PlayerState.Blocking);
    }
  }
  
  public requestStopBlocking(): void {
    if (this.getCurrentState() === PlayerState.Blocking) {
      this.transition(PlayerState.Idle);
    }
  }
  
  public requestStopSliding(): void {
    if (this.getCurrentState() === PlayerState.Sliding) {
      // Transition to Moving if still has velocity, otherwise Idle
      const shouldMove = Math.abs(this.previousContext?.velocity.x || 0) > PLAYER_CONFIG.VELOCITY_THRESHOLD;
      this.transition(shouldMove ? PlayerState.Moving : PlayerState.Idle);
    }
  }
  
  public requestAiming(): void {
    const currentState = this.getCurrentState();
    if (currentState === PlayerState.Idle || currentState === PlayerState.Moving) {
      this.transition(PlayerState.Aiming);
    }
  }
  
  public requestStopAiming(): void {
    if (this.getCurrentState() === PlayerState.Aiming) {
      this.transition(PlayerState.Idle);
    }
  }
  
  private previousContext?: PlayerStateContext;
  
  public update(deltaTime: number, context: PlayerStateContext): void {
    this.previousContext = context;
    super.update(deltaTime, context);
  }
}