export abstract class StateMachine<TState, TContext> {
  protected currentState: TState;
  protected previousState: TState;
  protected stateStartTime: number;
  
  constructor(initialState: TState) {
    this.currentState = initialState;
    this.previousState = initialState;
    this.stateStartTime = performance.now();
  }
  
  public getCurrentState(): TState {
    return this.currentState;
  }
  
  public getPreviousState(): TState {
    return this.previousState;
  }
  
  public getTimeInCurrentState(): number {
    return (performance.now() - this.stateStartTime) / 1000; // Convert milliseconds to seconds
  }
  
  protected transition(newState: TState): void {
    if (newState !== this.currentState) {
      this.onExit(this.currentState);
      this.previousState = this.currentState;
      this.currentState = newState;
      this.stateStartTime = performance.now();
      this.onEnter(newState);
    }
  }
  
  public update(deltaTime: number, context: TContext): void {
    const nextState = this.getNextState(this.currentState, context);
    if (nextState !== this.currentState) {
      this.transition(nextState);
    }
    this.onUpdate(this.currentState, deltaTime, context);
  }
  
  protected abstract getNextState(currentState: TState, context: TContext): TState;
  protected abstract onEnter(state: TState): void;
  protected abstract onExit(state: TState): void;
  protected abstract onUpdate(state: TState, deltaTime: number, context: TContext): void;
}