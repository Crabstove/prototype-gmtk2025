import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlayerStateMachine } from '../PlayerStateMachine';
import { PlayerState, PlayerStateContext } from '../../../types/player.types';
import { PLAYER_CONFIG } from '../../../constants';

describe('PlayerStateMachine', () => {
  let stateMachine: PlayerStateMachine;
  let mockContext: PlayerStateContext;

  beforeEach(() => {
    stateMachine = new PlayerStateMachine();
    mockContext = {
      hasBoomerang: true,
      isGrounded: true,
      velocity: { x: 0, y: 0 },
      isFacingRight: true,
      timeSinceStateChange: 0,
    };
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should start in Idle state', () => {
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });
  });

  describe('automatic transitions', () => {
    it('should transition from Idle to Moving when velocity exceeds threshold', () => {
      mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD + 1;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Moving);
    });

    it('should transition from Moving to Idle when velocity falls below threshold', () => {
      // First get to Moving state
      mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD + 1;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Moving);

      // Then slow down
      mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD - 1;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });

    it('should transition to Airborne when not grounded', () => {
      mockContext.isGrounded = false;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);
    });

    it('should transition from Airborne to Moving when landing with velocity', () => {
      // First go airborne
      mockContext.isGrounded = false;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);

      // Then land with velocity
      mockContext.isGrounded = true;
      mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD + 1;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Moving);
    });

    it('should transition from Airborne to Idle when landing without velocity', () => {
      // First go airborne
      mockContext.isGrounded = false;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);

      // Then land without velocity
      mockContext.isGrounded = true;
      mockContext.velocity.x = 0;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });
  });

  describe('manual transitions - crouching', () => {
    it('should transition from Idle to Crouching when requested', () => {
      stateMachine.requestCrouch();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Crouching);
    });

    it('should transition from Moving to Crouching when requested', () => {
      // First get to Moving state
      mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD + 1;
      stateMachine.update(16, mockContext);
      
      stateMachine.requestCrouch();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Crouching);
    });

    it('should transition from Crouching to Idle when standing', () => {
      stateMachine.requestCrouch();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Crouching);
      
      stateMachine.requestStand();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });

    it('should not crouch when in Airborne state', () => {
      mockContext.isGrounded = false;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);
      
      stateMachine.requestCrouch();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);
    });
  });

  describe('manual transitions - sliding', () => {
    it('should transition to Sliding when moving at max speed and crouch requested', () => {
      // First get to Moving state at max speed
      mockContext.velocity.x = PLAYER_CONFIG.MOVE_SPEED;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Moving);
      
      stateMachine.requestSlide({ x: PLAYER_CONFIG.MOVE_SPEED });
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Sliding);
    });

    it('should not slide when velocity is below 90% of max speed', () => {
      mockContext.velocity.x = PLAYER_CONFIG.MOVE_SPEED * 0.85; // Below 90% threshold
      stateMachine.update(16, mockContext);
      
      stateMachine.requestSlide({ x: mockContext.velocity.x });
      expect(stateMachine.getCurrentState()).not.toBe(PlayerState.Sliding);
    });

    it('should stay in Sliding state until velocity drops and time passes', () => {
      // Start sliding
      mockContext.velocity.x = PLAYER_CONFIG.MOVE_SPEED;
      stateMachine.update(16, mockContext);
      stateMachine.requestSlide({ x: PLAYER_CONFIG.MOVE_SPEED });
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Sliding);

      // Velocity drops but not enough time passed
      mockContext.velocity.x = 0;
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Sliding);
    });
  });

  describe('manual transitions - blocking', () => {
    it('should transition to Blocking when requested without boomerang', () => {
      mockContext.hasBoomerang = false;
      stateMachine.requestBlock(false);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Blocking);
    });

    it('should not block when player has boomerang', () => {
      mockContext.hasBoomerang = true;
      stateMachine.requestBlock(true);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });

    it('should transition from Blocking to Idle when stop blocking', () => {
      mockContext.hasBoomerang = false;
      stateMachine.requestBlock(false);
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Blocking);
      
      stateMachine.requestStopBlocking();
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Idle);
    });

    it('should allow blocking from Idle, Moving, and Crouching states', () => {
      const states = [PlayerState.Idle, PlayerState.Moving, PlayerState.Crouching];
      
      states.forEach(startState => {
        stateMachine = new PlayerStateMachine();
        mockContext.hasBoomerang = false;
        
        // Get to the start state
        if (startState === PlayerState.Moving) {
          mockContext.velocity.x = PLAYER_CONFIG.VELOCITY_THRESHOLD + 1;
          stateMachine.update(16, mockContext);
        } else if (startState === PlayerState.Crouching) {
          stateMachine.requestCrouch();
        }
        
        expect(stateMachine.getCurrentState()).toBe(startState);
        
        stateMachine.requestBlock(false);
        expect(stateMachine.getCurrentState()).toBe(PlayerState.Blocking);
      });
    });
  });

  describe('edge cases', () => {
    it('should prioritize Airborne state over all ground states', () => {
      // Even if we try to crouch while airborne
      mockContext.isGrounded = false;
      stateMachine.update(16, mockContext);
      stateMachine.requestCrouch();
      
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Airborne);
    });

    it('should handle rapid state change requests gracefully', () => {
      stateMachine.requestCrouch();
      stateMachine.requestStand();
      stateMachine.requestCrouch();
      
      expect(stateMachine.getCurrentState()).toBe(PlayerState.Crouching);
    });
  });
});