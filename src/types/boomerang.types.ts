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