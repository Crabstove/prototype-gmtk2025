import * as PIXI from 'pixi.js';

export interface GhostTrailConfig {
  maxGhosts: number;
  spawnInterval: number; // seconds between ghost spawns
  fadeTime: number; // seconds for ghost to fade out
  initialAlpha: number;
  trailColor: number; // Red tint color
}

class Ghost {
  public sprite: PIXI.Graphics;
  public age: number = 0;
  public maxAge: number;
  public active: boolean = false;
  private width: number = 0;
  private height: number = 0;
  private startAlpha: number = 1;
  
  constructor() {
    this.sprite = new PIXI.Graphics();
    this.sprite.visible = false;
    this.maxAge = 1;
  }
  
  spawn(width: number, height: number, x: number, y: number, fadeTime: number, initialAlpha: number, tintColor: number): void {
    // Store dimensions
    this.width = width;
    this.height = height;
    this.startAlpha = initialAlpha;
    
    // Clear and draw a simple rectangle ghost
    this.sprite.clear();
    
    // Draw a filled rectangle matching player size
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    this.sprite.rect(-halfWidth, -halfHeight, width, height);
    this.sprite.fill({ color: tintColor, alpha: 1.0 }); // Full alpha in fill, control via sprite.alpha
    
    // Set position and initial alpha
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.alpha = initialAlpha;
    this.sprite.visible = true;
    
    // Reset age
    this.age = 0;
    this.maxAge = fadeTime;
    this.active = true;
  }
  
  update(deltaTime: number): void {
    if (!this.active) return;
    
    this.age += deltaTime;
    
    if (this.age >= this.maxAge) {
      this.active = false;
      this.sprite.visible = false;
      return;
    }
    
    // Fade out over time from initial alpha to 0
    const progress = this.age / this.maxAge;
    this.sprite.alpha = (1 - progress) * this.startAlpha;
  }
  
  reset(): void {
    this.active = false;
    this.sprite.visible = false;
    this.sprite.alpha = 0;
  }
}

export class GhostTrail {
  private ghosts: Ghost[] = [];
  private container: PIXI.Container;
  private config: GhostTrailConfig;
  private spawnTimer: number = 0;
  
  constructor(container: PIXI.Container, config?: Partial<GhostTrailConfig>) {
    this.container = container;
    this.config = {
      maxGhosts: 10,
      spawnInterval: 0.05, // Spawn every 50ms
      fadeTime: 0.3, // Fade over 300ms
      initialAlpha: 0.5,
      trailColor: 0xff0000, // Red tint
      ...config
    };
    
    // Create ghost pool
    for (let i = 0; i < this.config.maxGhosts; i++) {
      const ghost = new Ghost();
      this.ghosts.push(ghost);
      // Add ghosts to container at the beginning (behind everything)
      this.container.addChildAt(ghost.sprite, 0);
    }
  }
  
  spawn(width: number, height: number, x: number, y: number, alphaMultiplier: number = 1.0): void {
    // Find inactive ghost
    const ghost = this.ghosts.find(g => !g.active);
    if (!ghost) return;
    
    ghost.spawn(
      width,
      height,
      x,
      y,
      this.config.fadeTime,
      this.config.initialAlpha * alphaMultiplier,
      this.config.trailColor
    );
  }
  
  update(deltaTime: number, shouldSpawn: boolean, width: number, height: number, x: number, y: number, intensity: number = 1.0): void {
    // Update all ghosts
    for (const ghost of this.ghosts) {
      ghost.update(deltaTime);
    }
    
    // Handle spawning with intensity modifier
    if (shouldSpawn) {
      this.spawnTimer += deltaTime;
      
      // Use base spawn interval (intensity affects alpha, not frequency)
      if (this.spawnTimer >= this.config.spawnInterval) {
        this.spawnTimer = 0;
        // Pass intensity as alpha multiplier
        this.spawn(width, height, x, y, intensity);
      }
    } else {
      this.spawnTimer = 0;
    }
  }
  
  clear(): void {
    for (const ghost of this.ghosts) {
      ghost.reset();
    }
  }
}