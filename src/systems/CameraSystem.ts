import * as PIXI from 'pixi.js';
import { Vector2 } from '../types';
import { CAMERA_CONFIG, GAME_CONFIG } from '../constants';

export class CameraSystem {
  private container: PIXI.Container;
  private targetPosition: Vector2 = { x: 0, y: 0 };
  
  constructor(container: PIXI.Container) {
    this.container = container;
  }
  
  public setTarget(position: Vector2): void {
    this.targetPosition = position;
  }
  
  public update(_deltaTime: number): void {
    const targetX = -this.targetPosition.x + GAME_CONFIG.WIDTH / 2;
    const targetY = -this.targetPosition.y + GAME_CONFIG.HEIGHT / 2 + CAMERA_CONFIG.OFFSET_Y;
    
    this.container.x += (targetX - this.container.x) * CAMERA_CONFIG.LERP_FACTOR;
    this.container.y += (targetY - this.container.y) * CAMERA_CONFIG.LERP_FACTOR;
  }
  
  public getPosition(): Vector2 {
    return {
      x: -this.container.x,
      y: -this.container.y,
    };
  }
}