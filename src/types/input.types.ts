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