import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateMachine } from '../StateMachine';

// Test implementation of StateMachine
enum TestState {
  StateA = 'stateA',
  StateB = 'stateB',
  StateC = 'stateC',
}

interface TestContext {
  shouldTransition: boolean;
  value: number;
}

class TestStateMachine extends StateMachine<TestState, TestContext> {
  public onEnterCalled = false;
  public onExitCalled = false;
  public onUpdateCalled = false;
  public lastEnteredState: TestState | null = null;
  public lastExitedState: TestState | null = null;

  protected getNextState(currentState: TestState, context: TestContext): TestState {
    if (context.shouldTransition) {
      switch (currentState) {
        case TestState.StateA:
          return TestState.StateB;
        case TestState.StateB:
          return TestState.StateC;
        case TestState.StateC:
          return TestState.StateA;
      }
    }
    return currentState;
  }

  protected onEnter(state: TestState): void {
    this.onEnterCalled = true;
    this.lastEnteredState = state;
  }

  protected onExit(state: TestState): void {
    this.onExitCalled = true;
    this.lastExitedState = state;
  }

  protected onUpdate(_state: TestState, _deltaTime: number, _context: TestContext): void {
    this.onUpdateCalled = true;
  }

  // Expose transition for testing
  public testTransition(newState: TestState): void {
    this.transition(newState);
  }
}

describe('StateMachine', () => {
  let stateMachine: TestStateMachine;
  let mockContext: TestContext;

  beforeEach(() => {
    stateMachine = new TestStateMachine(TestState.StateA);
    mockContext = { shouldTransition: false, value: 0 };
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with the correct initial state', () => {
      expect(stateMachine.getCurrentState()).toBe(TestState.StateA);
      expect(stateMachine.getPreviousState()).toBe(TestState.StateA);
    });

    it('should have zero time in current state initially', () => {
      expect(stateMachine.getTimeInCurrentState()).toBeGreaterThanOrEqual(0);
      expect(stateMachine.getTimeInCurrentState()).toBeLessThan(100);
    });
  });

  describe('state transitions', () => {
    it('should transition to a new state when conditions are met', () => {
      mockContext.shouldTransition = true;
      stateMachine.update(16, mockContext);

      expect(stateMachine.getCurrentState()).toBe(TestState.StateB);
      expect(stateMachine.getPreviousState()).toBe(TestState.StateA);
    });

    it('should not transition when conditions are not met', () => {
      mockContext.shouldTransition = false;
      stateMachine.update(16, mockContext);

      expect(stateMachine.getCurrentState()).toBe(TestState.StateA);
      expect(stateMachine.getPreviousState()).toBe(TestState.StateA);
    });

    it('should call lifecycle methods during transition', () => {
      stateMachine.testTransition(TestState.StateB);

      expect(stateMachine.onExitCalled).toBe(true);
      expect(stateMachine.lastExitedState).toBe(TestState.StateA);
      expect(stateMachine.onEnterCalled).toBe(true);
      expect(stateMachine.lastEnteredState).toBe(TestState.StateB);
    });

    it('should not transition to the same state', () => {
      stateMachine.onEnterCalled = false;
      stateMachine.onExitCalled = false;

      stateMachine.testTransition(TestState.StateA);

      expect(stateMachine.onExitCalled).toBe(false);
      expect(stateMachine.onEnterCalled).toBe(false);
      expect(stateMachine.getCurrentState()).toBe(TestState.StateA);
    });
  });

  describe('time tracking', () => {
    it('should reset time when transitioning to a new state', async () => {
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Transition to new state
      stateMachine.testTransition(TestState.StateB);
      
      const newTime = stateMachine.getTimeInCurrentState();
      expect(newTime).toBeLessThan(20); // Should be near zero
    });
  });

  describe('update cycle', () => {
    it('should call onUpdate during update', () => {
      stateMachine.update(16, mockContext);
      expect(stateMachine.onUpdateCalled).toBe(true);
    });

    it('should handle multiple state transitions', () => {
      mockContext.shouldTransition = true;

      // A -> B
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(TestState.StateB);

      // B -> C
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(TestState.StateC);

      // C -> A
      stateMachine.update(16, mockContext);
      expect(stateMachine.getCurrentState()).toBe(TestState.StateA);
    });
  });
});