import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../constants/game.constants';

// Simplified time slow effect - keeps the cool visuals but with way less code
export class TimeSlowEffect {
  private overlay: PIXI.Graphics;
  private vignette: PIXI.Graphics;
  private isActive: boolean = false;
  private opacity: number = 0;
  
  constructor(container: PIXI.Container) {
    // Blue tint overlay
    this.overlay = new PIXI.Graphics();
    this.overlay.rect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.overlay.fill({ color: 0x4466ff, alpha: 1 });
    this.overlay.alpha = 0;
    
    // Dark edge vignette for dramatic effect
    this.vignette = new PIXI.Graphics();
    const v = 80; // vignette size
    this.vignette.rect(0, 0, GAME_CONFIG.WIDTH, v); // top
    this.vignette.rect(0, GAME_CONFIG.HEIGHT - v, GAME_CONFIG.WIDTH, v); // bottom
    this.vignette.rect(0, 0, v, GAME_CONFIG.HEIGHT); // left
    this.vignette.rect(GAME_CONFIG.WIDTH - v, 0, v, GAME_CONFIG.HEIGHT); // right
    this.vignette.fill({ color: 0x000000, alpha: 1 });
    this.vignette.alpha = 0;
    
    container.addChild(this.overlay);
    container.addChild(this.vignette);
  }
  
  public startTimeSlow(): void {
    this.isActive = true;
  }
  
  public stopTimeSlow(): void {
    this.isActive = false;
  }
  
  public getIsActive(): boolean {
    return this.isActive;
  }
  
  public update(deltaTime: number): void {
    // Smooth fade in/out
    const target = this.isActive ? 1 : 0;
    const speed = 8; // Transition speed
    this.opacity += (target - this.opacity) * speed * deltaTime;
    
    // Apply opacity
    this.overlay.alpha = this.opacity * 0.15; // Blue tint at 15%
    this.vignette.alpha = this.opacity * 0.3; // Vignette at 30%
  }
}