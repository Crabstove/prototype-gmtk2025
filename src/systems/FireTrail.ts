import * as PIXI from 'pixi.js';
import { FIRE_TRAIL_CONFIG } from '../constants/game.constants';

interface Spark {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  age: number;
  lifetime: number;
  active: boolean;
}

export class FireTrail {
  private container: PIXI.Container;
  private sparks: Spark[] = [];
  private sparkTexture: PIXI.Texture;
  private spawnTimer = 0;
  
  constructor(parent: PIXI.Container) {
    // Use regular container for now
    this.container = new PIXI.Container();
    this.container.blendMode = 'add'; // Additive blending for glow
    parent.addChild(this.container);
    
    // Create simple circle texture for sparks
    this.sparkTexture = this.createSparkTexture();
    
    // Initialize sprite pool
    for (let i = 0; i < FIRE_TRAIL_CONFIG.PARTICLE_COUNT; i++) {
      const sprite = new PIXI.Sprite(this.sparkTexture);
      sprite.anchor.set(0.5);
      sprite.visible = false;
      this.container.addChild(sprite);
      
      this.sparks.push({
        sprite,
        vx: 0,
        vy: 0,
        age: 0,
        lifetime: 0,
        active: false
      });
    }
  }
  
  private createSparkTexture(): PIXI.Texture {
    // Create a glowing spark texture
    const size = 12;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create bright red gradient for hot spark effect
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(255, 200, 200, 1)'); // Light red-white center
    gradient.addColorStop(0.3, 'rgba(255, 100, 100, 0.9)'); // Bright red
    gradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.6)'); // Pure red
    gradient.addColorStop(1, 'rgba(200, 0, 0, 0)'); // Dark red fade out
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    return PIXI.Texture.from(canvas);
  }
  
  update(deltaTime: number, isSliding: boolean, playerX: number, playerY: number, playerVelocityX: number) {
    // Update existing sparks
    for (const spark of this.sparks) {
      if (!spark.active) continue;
      
      spark.age += deltaTime;
      if (spark.age >= spark.lifetime) {
        spark.active = false;
        spark.sprite.visible = false;
        continue;
      }
      
      // Apply dramatic physics like racing games
      spark.vy += 200 * deltaTime; // Gravity pulls sparks down
      spark.vx *= Math.pow(0.85, deltaTime); // Moderate air drag
      spark.vy *= Math.pow(0.9, deltaTime); // Light vertical drag
      
      // Add turbulence for realistic spark movement
      spark.vx += Math.sin(spark.age * 15) * 80 * deltaTime;
      
      // Update position
      spark.sprite.x += spark.vx * deltaTime;
      spark.sprite.y += spark.vy * deltaTime;
      
      // Update visual properties based on age
      const progress = spark.age / spark.lifetime;
      
      // Red-themed spark colors (bright red -> dark red)
      let tint: number;
      if (progress < 0.2) {
        // Light red-white to bright red
        const t = progress / 0.2;
        tint = this.lerpColor(0xFFCCCC, 0xFF0000, t);
      } else if (progress < 0.6) {
        // Bright red maintained
        tint = 0xFF0000;
      } else {
        // Bright red to dark red
        const t = (progress - 0.6) / 0.4;
        tint = this.lerpColor(0xFF0000, 0x660000, t);
      }
      spark.sprite.tint = tint;
      
      // Fade out
      spark.sprite.alpha = 1 - progress;
      
      // Dynamic scale - grow then shrink like real sparks
      let scale: number;
      if (progress < 0.1) {
        // Quick growth
        scale = 0.2 + (progress / 0.1) * 0.6;
      } else if (progress < 0.3) {
        // Maintain size
        scale = 0.8;
      } else {
        // Gradual shrink
        scale = 0.8 * (1 - (progress - 0.3) / 0.7);
      }
      spark.sprite.scale.set(scale);
    }
    
    // Spawn new sparks when sliding (no speed requirement)
    if (isSliding) {
      this.spawnTimer += deltaTime;
      
      while (this.spawnTimer >= FIRE_TRAIL_CONFIG.SPAWN_RATE) {
        this.spawnTimer -= FIRE_TRAIL_CONFIG.SPAWN_RATE;
        this.spawnSpark(playerX, playerY, playerVelocityX);
      }
    } else {
      this.spawnTimer = 0;
    }
  }
  
  private spawnSpark(x: number, y: number, velocityX: number) {
    // Find inactive spark
    const spark = this.sparks.find(s => !s.active);
    if (!spark) return;
    
    // Initialize spark
    spark.active = true;
    spark.age = 0;
    spark.lifetime = FIRE_TRAIL_CONFIG.MIN_LIFETIME + Math.random() * (FIRE_TRAIL_CONFIG.MAX_LIFETIME - FIRE_TRAIL_CONFIG.MIN_LIFETIME);
    
    // Position at player's feet with wider spread for multiple contact points
    const spreadX = (Math.random() - 0.5) * 24; // Wider horizontal spread
    spark.sprite.x = x + spreadX;
    spark.sprite.y = y + 22; // Fine-tuned position for sliding sparks
    spark.sprite.visible = true;
    
    // Initial velocity - dramatic spray pattern opposite to movement
    const speedFactor = Math.abs(velocityX) / 600;
    const direction = velocityX > 0 ? -1 : 1; // Opposite to movement
    
    // Fan-shaped spray with more aggressive scattering
    const sprayAngle = (Math.random() - 0.5) * 0.8; // Spray angle variation
    spark.vx = direction * (150 + Math.random() * 250) + sprayAngle * 200; // Strong horizontal spray
    spark.vy = -150 - Math.random() * 150; // Strong upward launch
    
    // Reset visual properties
    spark.sprite.alpha = 1; // Full opacity for bright sparks
    spark.sprite.scale.set(0.2); // Start small
    spark.sprite.tint = 0xFFCCCC; // Start light red (matching our red theme)
  }
  
  private lerpColor(color1: number, color2: number, t: number): number {
    const r1 = (color1 >> 16) & 0xFF;
    const g1 = (color1 >> 8) & 0xFF;
    const b1 = color1 & 0xFF;
    
    const r2 = (color2 >> 16) & 0xFF;
    const g2 = (color2 >> 8) & 0xFF;
    const b2 = color2 & 0xFF;
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return (r << 16) | (g << 8) | b;
  }
  
  clear() {
    for (const spark of this.sparks) {
      spark.active = false;
      spark.sprite.visible = false;
    }
  }
}