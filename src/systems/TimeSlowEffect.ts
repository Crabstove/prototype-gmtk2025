import * as PIXI from 'pixi.js';
import { TIME_SLOW_CONFIG, GAME_CONFIG } from '../constants';

interface Particle {
  sprite: PIXI.Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export class TimeSlowEffect {
  private container: PIXI.Container;
  private effectContainer: PIXI.Container;
  private overlay: PIXI.Graphics;
  private vignette: PIXI.Graphics;
  private particles: Particle[] = [];
  private currentScale: number = 1.0;
  private targetScale: number = 1.0;
  private transitionSpeed: number = TIME_SLOW_CONFIG.TRANSITION_SPEED;
  private isActive: boolean = false;
  
  constructor(container: PIXI.Container) {
    this.container = container;
    
    // Create effect container
    this.effectContainer = new PIXI.Container();
    this.effectContainer.zIndex = 1000;
    
    // Create overlay for color tint
    this.overlay = new PIXI.Graphics();
    
    // Create vignette effect
    this.vignette = new PIXI.Graphics();
    
    this.effectContainer.addChild(this.overlay);
    this.effectContainer.addChild(this.vignette);
    this.container.addChild(this.effectContainer);
  }
  
  public startTimeSlow(): void {
    if (this.isActive) return; // Already active
    this.targetScale = TIME_SLOW_CONFIG.TIME_SCALE;
    this.isActive = true;
    this.drawEffects(true);
    this.createParticles();
  }
  
  public stopTimeSlow(): void {
    if (!this.isActive) return; // Already inactive
    this.targetScale = 1.0;
    this.isActive = false;
    this.clearParticles();
  }
  
  public getIsActive(): boolean {
    return this.isActive;
  }
  
  public update(deltaTime: number): void {
    // Smooth transition
    const diff = this.targetScale - this.currentScale;
    this.currentScale += diff * this.transitionSpeed;
    
    // Update opacity based on time scale
    const effectStrength = 1 - this.currentScale;
    this.overlay.alpha = effectStrength * TIME_SLOW_CONFIG.OVERLAY_ALPHA;
    this.vignette.alpha = effectStrength * TIME_SLOW_CONFIG.VIGNETTE_ALPHA;
    
    // Update particles
    if (this.isActive) {
      this.updateParticles(deltaTime * 0.3); // Particles move slowly
    }
    
    // Clear effects when fully transitioned out
    if (!this.isActive && this.currentScale > 0.99) {
      this.drawEffects(false);
    }
  }
  
  private drawEffects(active: boolean): void {
    const width = GAME_CONFIG.WIDTH;
    const height = GAME_CONFIG.HEIGHT;
    
    this.overlay.clear();
    this.vignette.clear();
    
    if (active) {
      // Simple blue-ish tint overlay
      this.overlay.rect(0, 0, width, height);
      this.overlay.fill({ color: TIME_SLOW_CONFIG.OVERLAY_COLOR, alpha: 1 });
      
      // Simple vignette - just dark borders
      const vignetteSize = 100;
      
      // Top
      this.vignette.rect(0, 0, width, vignetteSize);
      this.vignette.fill({ color: 0x000000, alpha: 0.3 });
      
      // Bottom
      this.vignette.rect(0, height - vignetteSize, width, vignetteSize);
      this.vignette.fill({ color: 0x000000, alpha: 0.3 });
      
      // Left
      this.vignette.rect(0, 0, vignetteSize, height);
      this.vignette.fill({ color: 0x000000, alpha: 0.3 });
      
      // Right
      this.vignette.rect(width - vignetteSize, 0, vignetteSize, height);
      this.vignette.fill({ color: 0x000000, alpha: 0.3 });
    }
  }
  
  private createParticles(): void {
    for (let i = 0; i < TIME_SLOW_CONFIG.PARTICLE_DENSITY; i++) {
      const particle = new PIXI.Graphics();
      particle.circle(0, 0, 2);
      particle.fill({ color: 0xffffff, alpha: 0.3 });
      
      const x = Math.random() * GAME_CONFIG.WIDTH;
      const y = Math.random() * GAME_CONFIG.HEIGHT;
      
      particle.x = x;
      particle.y = y;
      
      this.particles.push({
        sprite: particle,
        x,
        y,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 30 - 10,
        alpha: Math.random() * 0.5 + 0.2
      });
      
      this.effectContainer.addChild(particle);
    }
  }
  
  private updateParticles(deltaTime: number): void {
    this.particles.forEach(particle => {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Wrap around screen
      if (particle.y < -10) {
        particle.y = GAME_CONFIG.HEIGHT + 10;
        particle.x = Math.random() * GAME_CONFIG.WIDTH;
      }
      
      particle.sprite.x = particle.x;
      particle.sprite.y = particle.y;
      particle.sprite.alpha = particle.alpha * (1 - this.currentScale);
    });
  }
  
  private clearParticles(): void {
    this.particles.forEach(particle => {
      particle.sprite.destroy();
    });
    this.particles = [];
  }
  
  public destroy(): void {
    this.clearParticles();
    this.overlay.destroy();
    this.vignette.destroy();
    this.effectContainer.destroy();
  }
}