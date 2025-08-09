import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, PlayerState, BoomerangThrowParams, IBoomerang } from './types';
import { PLAYER_CONFIG, PHYSICS, BOOMERANG_CONFIG, COLLISION_GROUPS, PARRY_CONFIG, TRAJECTORY_CONFIG } from './constants/game.constants';
import { drawBoomerangTrajectory } from './drawTrajectory';
import { GhostTrail } from './GhostTrail';
import { FireTrail } from './systems/FireTrail';

export class Player {
  private world: RapierWorld;
  private rigidBody!: RapierRigidBody;
  private collider!: RAPIER.Collider;
  private sprite!: PIXI.Graphics;
  private fireEffect!: PIXI.Graphics;
  private glowAura!: PIXI.Graphics;
  private ghostTrail!: GhostTrail;
  private fireTrail!: FireTrail;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  private fireAnimationFrame: number = 0;
  private fireAnimationTimer: number = 0;
  
  // Custom physics system (Celeste-style)
  private velocity: Vector2 = { x: 0, y: 0 };
  private slideInitiated = false; // Track if we just started sliding
  
  private targetVelocityX = 0;
  private currentState: PlayerState = PlayerState.Idle;
  private hasBoomerang = true;
  private isGrounded = true;
  private isFacingRight = true;
  private groundRaycast: RAPIER.Ray;
  private previousState: PlayerState = PlayerState.Idle;
  private trajectoryGraphics: PIXI.Graphics;
  private aimAngle: number = 180; // Default aim angle - straight ahead (degrees)
  private isAiming: boolean = false;
  private currentColliderHeight: number = PLAYER_CONFIG.HEIGHT;
  private gameInstance: any = null;  // Reference to Game for spawning boomerang
  private parryWindowTime: number = 0;
  private isRidingBoomerang: boolean = false;
  private ridingBoomerang: IBoomerang | null = null;
  private catchCooldown: number = 0;
  

  constructor(
    world: RapierWorld,
    container: PIXI.Container,
    x: number,
    y: number,
    RapierModule: typeof RAPIER
  ) {
    this.world = world;
    this.container = container;
    this.RAPIER = RapierModule;
    
    this.createRigidBody(x, y);
    this.createGhostTrail();
    this.createFireTrail();
    this.createGlowAura();
    this.createSprite();
    this.createFireEffect();
    // Draw initial glow and fire frames
    this.drawGlowAura();
    this.drawFireFrame();
    this.currentState = PlayerState.Idle;
    this.trajectoryGraphics = new PIXI.Graphics();
    this.trajectoryGraphics.alpha = 0.5;
    this.container.addChild(this.trajectoryGraphics);
    this.groundRaycast = new RapierModule.Ray(
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    );
    // Trajectory preview is now just a graphics object, already created above
  }

  private createRigidBody(x: number, y: number): void {
    const rigidBodyDesc = this.RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y)
      .lockRotations();
    
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
    // Disable Rapier gravity - we'll use custom gravity
    this.rigidBody.setGravityScale(0, false);
    
    const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
      PLAYER_CONFIG.WIDTH / 2,
      PLAYER_CONFIG.HEIGHT / 2
    )
      .setRestitution(PLAYER_CONFIG.RESTITUTION)
      .setFriction(PLAYER_CONFIG.FRICTION)
      .setCollisionGroups(this.getCollisionGroups(false)); // Standing initially
    
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    
    // Set collision groups to prevent unwanted interactions
    this.collider.setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
  }

  private createGhostTrail(): void {
    // Ghost trail renders behind everything
    this.ghostTrail = new GhostTrail(this.container, {
      maxGhosts: 10,
      spawnInterval: 0.05, // More frequent base spawn rate
      fadeTime: 0.25, // Longer fade for visibility
      initialAlpha: 0.6, // Set to 0.6
      trailColor: 0xff0000 // Red ghosts
    });
  }
  
  private createFireTrail(): void {
    // Fire trail sparks when sliding
    this.fireTrail = new FireTrail(this.container);
  }

  private createGlowAura(): void {
    this.glowAura = new PIXI.Graphics();
    // Add glow aura as the first layer (behind sprite)
    this.container.addChild(this.glowAura);
  }

  private createSprite(): void {
    this.sprite = new PIXI.Graphics();
    this.sprite.wiggle = 2;
    this.sprite.maxSegmentLength = 10;
    
    // Draw enhanced character with more details
    this.drawDetailedCharacter(this.sprite, PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT, this.isFacingRight);
    
    this.container.addChild(this.sprite);
  }
  
  private createFireEffect(): void {
    this.fireEffect = new PIXI.Graphics();
    // Add fire effect on top of the main sprite for visibility
    this.container.addChild(this.fireEffect);
  }
  
  private updateFireAnimation(deltaTime: number): void {
    this.fireAnimationTimer += deltaTime;
    
    // Change frame every 200ms (5 FPS for fire animation) - slower, more subtle
    if (this.fireAnimationTimer > 0.2) {
      this.fireAnimationTimer = 0;
      this.fireAnimationFrame = (this.fireAnimationFrame + 1) % 3;
    }
    // Always redraw the glow and fire frames
    this.drawGlowAura();
    this.drawFireFrame();
  }
  
  private drawGlowAura(): void {
    this.glowAura.clear();
    
    const width = PLAYER_CONFIG.WIDTH;
    const height = this.currentColliderHeight;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Draw multiple layered rectangles with decreasing alpha for soft glow
    // Outermost layer - very faint and large
    this.glowAura.rect(-halfWidth - 8, -halfHeight - 8, width + 16, height + 16);
    this.glowAura.stroke({color: 0xff0000, width: 3, alpha: 0.08});
    
    // Second layer
    this.glowAura.rect(-halfWidth - 6, -halfHeight - 6, width + 12, height + 12);
    this.glowAura.stroke({color: 0xff0000, width: 2.5, alpha: 0.12});
    
    // Third layer
    this.glowAura.rect(-halfWidth - 4, -halfHeight - 4, width + 8, height + 8);
    this.glowAura.stroke({color: 0xff3300, width: 2, alpha: 0.15});
    
    // Fourth layer - closer to body
    this.glowAura.rect(-halfWidth - 2, -halfHeight - 2, width + 4, height + 4);
    this.glowAura.stroke({color: 0xff6600, width: 1.5, alpha: 0.18});
    
    // Innermost layer - brightest but still subtle
    this.glowAura.rect(-halfWidth - 1, -halfHeight - 1, width + 2, height + 2);
    this.glowAura.stroke({color: 0xff9900, width: 1, alpha: 0.22});
  }
  
  private drawFireFrame(): void {
    this.fireEffect.clear();
    
    const width = PLAYER_CONFIG.WIDTH;
    const height = this.currentColliderHeight;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // More pronounced decaying fire effect - corrupted borders peeling upwards
    const frame = this.fireAnimationFrame;
    
    // Draw main body outline with more dramatic distortions
    this.fireEffect.beginPath();
    
    // Top edge with pronounced upward decay
    this.fireEffect.moveTo(-halfWidth - 1, -halfHeight);
    if (frame === 0) {
      this.fireEffect.lineTo(-halfWidth + 2, -halfHeight - 2); // Deeper peel
      this.fireEffect.lineTo(-halfWidth + 3, -halfHeight - 3.5); // Peak
      this.fireEffect.lineTo(-halfWidth + 5, -halfHeight);
      this.fireEffect.lineTo(-halfWidth + 7, -halfHeight - 1);
      this.fireEffect.lineTo(-halfWidth + 8, -halfHeight - 4); // Large peel
      this.fireEffect.lineTo(-halfWidth + 9, -halfHeight - 2);
      this.fireEffect.lineTo(-halfWidth + 11, -halfHeight);
    } else if (frame === 1) {
      this.fireEffect.lineTo(-halfWidth + 1, -halfHeight - 1);
      this.fireEffect.lineTo(-halfWidth + 3, -halfHeight);
      this.fireEffect.lineTo(-halfWidth + 4, -halfHeight - 3); // Different spot
      this.fireEffect.lineTo(-halfWidth + 5, -halfHeight - 4); // Higher
      this.fireEffect.lineTo(-halfWidth + 7, -halfHeight);
      this.fireEffect.lineTo(-halfWidth + 10, -halfHeight - 2.5);
      this.fireEffect.lineTo(-halfWidth + 12, -halfHeight);
    } else {
      this.fireEffect.lineTo(-halfWidth + 1, -halfHeight - 2);
      this.fireEffect.lineTo(-halfWidth + 2, -halfHeight - 1);
      this.fireEffect.lineTo(-halfWidth + 6, -halfHeight);
      this.fireEffect.lineTo(-halfWidth + 8, -halfHeight - 1);
      this.fireEffect.lineTo(-halfWidth + 9, -halfHeight - 5); // Highest peel
      this.fireEffect.lineTo(-halfWidth + 10, -halfHeight - 3);
      this.fireEffect.lineTo(-halfWidth + 12, -halfHeight);
    }
    this.fireEffect.lineTo(halfWidth - 5, -halfHeight);
    if (frame === 2) {
      this.fireEffect.lineTo(halfWidth - 3, -halfHeight - 2.5); // Right side peel
      this.fireEffect.lineTo(halfWidth - 2, -halfHeight - 1);
    } else if (frame === 0) {
      this.fireEffect.lineTo(halfWidth - 4, -halfHeight - 1.5);
    }
    this.fireEffect.lineTo(halfWidth + 1, -halfHeight);
    
    // Right edge with more dramatic corruption
    this.fireEffect.lineTo(halfWidth, -halfHeight + 3);
    if (frame === 1) {
      this.fireEffect.lineTo(halfWidth + 2.5, -halfHeight + 5); // More outward
      this.fireEffect.lineTo(halfWidth + 3, -halfHeight + 7); // Pronounced decay
      this.fireEffect.lineTo(halfWidth + 1, -halfHeight + 9);
      this.fireEffect.lineTo(halfWidth, -halfHeight + 11);
    } else if (frame === 2) {
      this.fireEffect.lineTo(halfWidth + 1.5, -halfHeight + 6);
      this.fireEffect.lineTo(halfWidth, -halfHeight + 8);
    }
    this.fireEffect.lineTo(halfWidth, 0);
    if (frame === 0) {
      this.fireEffect.lineTo(halfWidth + 3, 2); // Larger corruption
      this.fireEffect.lineTo(halfWidth + 2.5, 4);
      this.fireEffect.lineTo(halfWidth, 6);
    } else if (frame === 2) {
      this.fireEffect.lineTo(halfWidth + 2, 1);
      this.fireEffect.lineTo(halfWidth + 1, 3);
    }
    this.fireEffect.lineTo(halfWidth, halfHeight);
    
    // Bottom edge with dramatic upward peeling
    this.fireEffect.lineTo(halfWidth - 2, halfHeight);
    if (frame === 2) {
      this.fireEffect.lineTo(halfWidth - 3, halfHeight - 2); // Peeling up
      this.fireEffect.lineTo(halfWidth - 4, halfHeight - 3.5); // Higher
      this.fireEffect.lineTo(halfWidth - 5, halfHeight - 1);
      this.fireEffect.lineTo(halfWidth - 7, halfHeight);
    } else if (frame === 1) {
      this.fireEffect.lineTo(halfWidth - 4, halfHeight - 1.5);
      this.fireEffect.lineTo(halfWidth - 6, halfHeight);
    }
    this.fireEffect.lineTo(0, halfHeight);
    if (frame === 0) {
      this.fireEffect.lineTo(-1, halfHeight - 2); // Deeper peel
      this.fireEffect.lineTo(-2, halfHeight - 3.5); // Center peak
      this.fireEffect.lineTo(-3, halfHeight - 2);
      this.fireEffect.lineTo(-4, halfHeight);
    } else if (frame === 1) {
      this.fireEffect.lineTo(-2, halfHeight - 1);
      this.fireEffect.lineTo(-3, halfHeight - 2.5);
      this.fireEffect.lineTo(-5, halfHeight);
    }
    this.fireEffect.lineTo(-halfWidth + 2, halfHeight);
    if (frame === 2) {
      this.fireEffect.lineTo(-halfWidth, halfHeight - 1);
    }
    this.fireEffect.lineTo(-halfWidth, halfHeight);
    
    // Left edge with pronounced decay
    this.fireEffect.lineTo(-halfWidth, halfHeight - 3);
    if (frame === 1) {
      this.fireEffect.lineTo(-halfWidth - 2.5, halfHeight - 5); // More outward
      this.fireEffect.lineTo(-halfWidth - 3, halfHeight - 7); // Dramatic decay
      this.fireEffect.lineTo(-halfWidth - 1, halfHeight - 9);
      this.fireEffect.lineTo(-halfWidth, halfHeight - 11);
    } else if (frame === 0) {
      this.fireEffect.lineTo(-halfWidth - 1.5, halfHeight - 6);
      this.fireEffect.lineTo(-halfWidth, halfHeight - 8);
    }
    this.fireEffect.lineTo(-halfWidth, 0);
    if (frame === 2) {
      this.fireEffect.lineTo(-halfWidth - 3.5, -2); // Large decay
      this.fireEffect.lineTo(-halfWidth - 2, -4);
      this.fireEffect.lineTo(-halfWidth, -6);
    } else if (frame === 0) {
      this.fireEffect.lineTo(-halfWidth - 2, -1);
      this.fireEffect.lineTo(-halfWidth - 1, -3);
    }
    this.fireEffect.lineTo(-halfWidth, -halfHeight);
    
    this.fireEffect.closePath();
    this.fireEffect.stroke({color: 0xff0000, width: 2.5, alpha: 0.75}); // Thicker, more visible
    
    // Inner glow layer for more intensity
    this.fireEffect.stroke({color: 0xff6600, width: 1, alpha: 0.4});
    
    // Add more floating embers that peel off
    if (frame === 0) {
      // Multiple embers
      this.fireEffect.rect(-halfWidth + 6, -halfHeight - 5, 2, 1);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.9 });
      this.fireEffect.rect(-halfWidth + 8, -halfHeight - 7, 1, 2);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.7 });
      // Right side embers
      this.fireEffect.rect(halfWidth + 3, -5, 1, 1);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.8 });
      this.fireEffect.rect(halfWidth + 2, 2, 2, 1);
      this.fireEffect.fill({ color: 0xff6600, alpha: 0.6 });
      // Bottom ember
      this.fireEffect.rect(-2, halfHeight - 5, 1, 2);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.7 });
    } else if (frame === 1) {
      // Embers moved up and spread
      this.fireEffect.rect(-halfWidth + 7, -halfHeight - 8, 2, 2);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.6 });
      this.fireEffect.rect(-halfWidth + 4, -halfHeight - 6, 1, 1);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.8 });
      // Bottom embers rising
      this.fireEffect.rect(3, halfHeight - 6, 2, 1);
      this.fireEffect.fill({ color: 0xff6600, alpha: 0.8 });
      this.fireEffect.rect(-3, halfHeight - 7, 1, 2);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.7 });
      // Side embers
      this.fireEffect.rect(-halfWidth - 4, 0, 1, 1);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.6 });
    } else {
      // Embers dissipating
      this.fireEffect.rect(-halfWidth + 8, -halfHeight - 10, 1, 1);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.3 });
      this.fireEffect.rect(-halfWidth + 9, -halfHeight - 11, 2, 1);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.4 });
      // New embers spawning
      this.fireEffect.rect(-halfWidth - 4, 10, 2, 2);
      this.fireEffect.fill({ color: 0xff0000, alpha: 0.7 });
      this.fireEffect.rect(halfWidth + 4, -10, 1, 1);
      this.fireEffect.fill({ color: 0xff6600, alpha: 0.6 });
      // Top embers
      this.fireEffect.rect(0, -halfHeight - 6, 1, 2);
      this.fireEffect.fill({ color: 0xff3300, alpha: 0.5 });
    }
  }
  
  private drawDetailedCharacter(graphics: PIXI.Graphics, width: number, height: number, facingRight: boolean = true): void {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Dark silhouette body - filled black
    graphics.rect(-halfWidth, -halfHeight, width, height);
    graphics.fill(0x000000);
    
    // Jagged, chaotic outline with spikes
    graphics.beginPath();
    graphics.moveTo(-halfWidth, -halfHeight + 2);
    graphics.lineTo(-halfWidth - 2, -halfHeight); // top left spike
    graphics.lineTo(-halfWidth + 3, -halfHeight);
    graphics.lineTo(-halfWidth + 4, -halfHeight - 3); // top spike 1
    graphics.lineTo(-halfWidth + 6, -halfHeight);
    graphics.lineTo(0, -halfHeight + 1);
    graphics.lineTo(2, -halfHeight - 2); // top center spike
    graphics.lineTo(halfWidth - 5, -halfHeight);
    graphics.lineTo(halfWidth - 3, -halfHeight - 3); // top right spike
    graphics.lineTo(halfWidth - 1, -halfHeight);
    graphics.lineTo(halfWidth + 2, -halfHeight + 2); // right top corner spike
    graphics.lineTo(halfWidth, -halfHeight + 5);
    
    // Right side with jagged protrusions
    graphics.lineTo(halfWidth + 3, -halfHeight + height * 0.2); // shoulder spike
    graphics.lineTo(halfWidth, -halfHeight + height * 0.25);
    graphics.lineTo(halfWidth + 2, -halfHeight + height * 0.4); // mid spike
    graphics.lineTo(halfWidth, -halfHeight + height * 0.5);
    graphics.lineTo(halfWidth + 1, -halfHeight + height * 0.7);
    graphics.lineTo(halfWidth, halfHeight - 3);
    
    // Bottom with torn edges
    graphics.lineTo(halfWidth - 2, halfHeight + 2); // bottom right tear
    graphics.lineTo(halfWidth - 4, halfHeight);
    graphics.lineTo(halfWidth - 6, halfHeight + 1);
    graphics.lineTo(0, halfHeight - 1);
    graphics.lineTo(-2, halfHeight + 3); // bottom center tear
    graphics.lineTo(-halfWidth + 4, halfHeight);
    graphics.lineTo(-halfWidth + 2, halfHeight + 2); // bottom left tear
    graphics.lineTo(-halfWidth, halfHeight - 2);
    
    // Left side with jagged protrusions
    graphics.lineTo(-halfWidth - 2, halfHeight - height * 0.3); // lower spike
    graphics.lineTo(-halfWidth, halfHeight - height * 0.4);
    graphics.lineTo(-halfWidth - 3, -halfHeight + height * 0.4); // mid spike
    graphics.lineTo(-halfWidth, -halfHeight + height * 0.3);
    graphics.lineTo(-halfWidth - 2, -halfHeight + height * 0.15); // shoulder spike
    graphics.lineTo(-halfWidth, -halfHeight + 2);
    
    graphics.closePath();
    graphics.stroke({color: 0xff0000, width: 3}); // Glowing crimson outline
    graphics.stroke({color: 0xff3333, width: 1}); // Brighter inner glow
    
    // Sharp V-shaped demon eyes with intense glow
    const eyeY = -halfHeight + height * 0.23;  // Centered vertically
    const eyeWidth = 7;  // Bigger
    const eyeHeight = 3.5;  // Proportional height
    
    // Eye positions based on facing direction
    let leftEyeSpacing: number;
    let rightEyeSpacing: number;
    
    if (!facingRight) {
      // Facing LEFT - right eye shifted 2px left (looks left)
      leftEyeSpacing = width * 0.3;
      rightEyeSpacing = width * 0.3 - 2;  // Right eye 2px closer to center
    } else {
      // Facing RIGHT - to be configured later
      leftEyeSpacing = width * 0.3;
      rightEyeSpacing = width * 0.3;  // Placeholder - symmetric for now
    }
    
    // Left eye - sharp symmetrical V-shape
    // Outer glow
    graphics.beginPath();
    graphics.moveTo(-leftEyeSpacing - eyeWidth, eyeY - 2);  // Top outer
    graphics.lineTo(-leftEyeSpacing, eyeY + 1);  // Center point
    graphics.lineTo(-leftEyeSpacing + eyeWidth, eyeY + 4);  // Bottom inner
    graphics.lineTo(-leftEyeSpacing, eyeY + eyeHeight);  // Bottom point
    graphics.closePath();
    graphics.fill({ color: 0xff0000, alpha: 0.2 });
    
    // Mid crimson layer
    graphics.beginPath();
    graphics.moveTo(-leftEyeSpacing - eyeWidth + 1, eyeY - 1.5);  // Top outer
    graphics.lineTo(-leftEyeSpacing, eyeY + 0.5);  // Center
    graphics.lineTo(-leftEyeSpacing + eyeWidth - 1, eyeY + 3.5);  // Bottom inner
    graphics.lineTo(-leftEyeSpacing, eyeY + eyeHeight - 0.5);  // Bottom
    graphics.closePath();
    graphics.fill({ color: 0xff0000, alpha: 0.5 });
    
    // Bright crimson core
    graphics.beginPath();
    graphics.moveTo(-leftEyeSpacing - eyeWidth + 2, eyeY - 1);
    graphics.lineTo(-leftEyeSpacing, eyeY);
    graphics.lineTo(-leftEyeSpacing + eyeWidth - 2, eyeY + 3);
    graphics.lineTo(-leftEyeSpacing, eyeY + eyeHeight - 1);
    graphics.closePath();
    graphics.fill(0xff0000);
    
    // Orange-red inner core (no white)
    graphics.beginPath();
    graphics.moveTo(-leftEyeSpacing - eyeWidth + 3, eyeY - 0.5);
    graphics.lineTo(-leftEyeSpacing, eyeY + 0.5);
    graphics.lineTo(-leftEyeSpacing + eyeWidth - 3, eyeY + 2.5);
    graphics.lineTo(-leftEyeSpacing, eyeY + eyeHeight - 1.5);
    graphics.closePath();
    graphics.fill({ color: 0xff3300, alpha: 0.8 });
    
    // Right eye - sharp symmetrical V-shape (perfect mirror)
    // Outer glow
    graphics.beginPath();
    graphics.moveTo(rightEyeSpacing + eyeWidth, eyeY - 2);  // Top outer
    graphics.lineTo(rightEyeSpacing, eyeY + 1);  // Center point
    graphics.lineTo(rightEyeSpacing - eyeWidth, eyeY + 4);  // Bottom inner
    graphics.lineTo(rightEyeSpacing, eyeY + eyeHeight);  // Bottom point
    graphics.closePath();
    graphics.fill({ color: 0xff0000, alpha: 0.2 });
    
    // Mid crimson layer
    graphics.beginPath();
    graphics.moveTo(rightEyeSpacing + eyeWidth - 1, eyeY - 1.5);  // Top outer
    graphics.lineTo(rightEyeSpacing, eyeY + 0.5);  // Center
    graphics.lineTo(rightEyeSpacing - eyeWidth + 1, eyeY + 3.5);  // Bottom inner
    graphics.lineTo(rightEyeSpacing, eyeY + eyeHeight - 0.5);  // Bottom
    graphics.closePath();
    graphics.fill({ color: 0xff0000, alpha: 0.5 });
    
    // Bright crimson core
    graphics.beginPath();
    graphics.moveTo(rightEyeSpacing + eyeWidth - 2, eyeY - 1);
    graphics.lineTo(rightEyeSpacing, eyeY);
    graphics.lineTo(rightEyeSpacing - eyeWidth + 2, eyeY + 3);
    graphics.lineTo(rightEyeSpacing, eyeY + eyeHeight - 1);
    graphics.closePath();
    graphics.fill(0xff0000);
    
    // Orange-red inner core (no white)
    graphics.beginPath();
    graphics.moveTo(rightEyeSpacing + eyeWidth - 3, eyeY - 0.5);
    graphics.lineTo(rightEyeSpacing, eyeY + 0.5);
    graphics.lineTo(rightEyeSpacing - eyeWidth + 3, eyeY + 2.5);
    graphics.lineTo(rightEyeSpacing, eyeY + eyeHeight - 1.5);
    graphics.closePath();
    graphics.fill({ color: 0xff3300, alpha: 0.8 });
    
    // Add some internal dark cracks/veins for texture
    graphics.moveTo(-halfWidth + 5, -halfHeight + height * 0.4);
    graphics.lineTo(-halfWidth + 7, -halfHeight + height * 0.45);
    graphics.lineTo(-halfWidth + 6, -halfHeight + height * 0.5);
    graphics.stroke({color: 0x1a0000, width: 1});
    
    graphics.moveTo(halfWidth - 5, -halfHeight + height * 0.6);
    graphics.lineTo(halfWidth - 7, -halfHeight + height * 0.55);
    graphics.stroke({color: 0x1a0000, width: 1});
  }

  public update(deltaTime: number): void {
    // Update cooldowns
    if (this.catchCooldown > 0) {
      this.catchCooldown -= deltaTime;
    }
    
    // If riding boomerang, follow its position
    if (this.isRidingBoomerang && this.ridingBoomerang) {
      const boomerangPos = this.ridingBoomerang.getPosition();
      if (boomerangPos) {
        // Position player on top of boomerang
        this.rigidBody.setTranslation({ 
          x: boomerangPos.x, 
          y: boomerangPos.y - PHYSICS.PLAYER_MOUNT_OFFSET
        }, true);
        
        // Set velocity to zero to prevent physics conflicts
        this.rigidBody.setLinvel({ x: 0, y: 0 }, true);
        
        // Update sprite, glow, and fire effect manually since we're skipping normal physics
        const position = this.rigidBody.translation();
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.glowAura.x = position.x;
        this.glowAura.y = position.y;
        this.fireEffect.x = position.x;
        this.fireEffect.y = position.y;
        
        // Update fire animation
        this.updateFireAnimation(deltaTime);
        
        // Update ghost trail when riding
        this.updateGhostTrail(deltaTime);
        
        // Update state machine
        this.updateStateMachine(deltaTime);
        return;
      }
    }
    
    this.updateGroundedState();
    this.updateFriction();
    this.updatePhysics(deltaTime);
    this.updateSprite();
    this.updateFireAnimation(deltaTime);
    this.updateGhostTrail(deltaTime);
    this.updateFireTrail(deltaTime);
    this.updateStateMachine(deltaTime);
  }

  private updatePhysics(deltaTime: number): void {
    // === CUSTOM PHYSICS SYSTEM (Celeste-style) ===
    
    // Apply gravity (always, unless grounded)
    if (!this.isGrounded) {
      this.velocity.y += PHYSICS.CUSTOM_GRAVITY * deltaTime;
      
      // Cap fall speed to terminal velocity
      if (this.velocity.y > PHYSICS.MAX_FALL_SPEED) {
        this.velocity.y = PHYSICS.MAX_FALL_SPEED;
      }
    } else {
      // Reset Y velocity when grounded (prevents accumulation)
      if (this.velocity.y > 0) {
        this.velocity.y = 0;
      }
    }
    
    // Handle horizontal movement based on state
    const state = this.currentState;
    
    if (state === PlayerState.Sliding) {
      // Check if we went airborne while sliding (slid off edge)
      if (!this.isGrounded) {
        this.currentState = PlayerState.Airborne;
        // Maintain slide momentum when going airborne
        // Don't change velocity, just transition state
      } else {
        // Don't override velocity if we just initiated the slide
        if (!this.slideInitiated) {
          // Very gentle deceleration to maintain momentum
          // Original: 0.97^60 ≈ 0.165 remaining after 1 second (83.5% loss)
          const decayRate = Math.pow(0.165, deltaTime); // Exponential decay to 16.5% after 1 second
          this.velocity.x *= decayRate;
        }
        this.slideInitiated = false; // Clear flag after first frame
        
        // Transition to crouch when much slower
        if (Math.abs(this.velocity.x) < 80) { // Higher threshold since we decay slower
          this.currentState = PlayerState.Crouching;
          // Only maintain crouch speed if player is actively moving
          if (this.targetVelocityX !== 0) {
            this.velocity.x = this.velocity.x > 0 ? PLAYER_CONFIG.CROUCH_MOVE_SPEED : -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
          } else {
            // If no input, let velocity decay naturally
            this.velocity.x *= 0.8; // Quick deceleration
          }
        }
      }
    } else {
      // Normal movement - direct velocity control
      if (this.isGrounded) {
        // Ground movement - instant velocity
        this.velocity.x = this.targetVelocityX;
      } else {
        // Air control - improved for better responsiveness
        const airControl = 0.65; // 65% control in air (increased from 30%)
        const targetInfluence = this.targetVelocityX * airControl;
        
        // Apply air friction for high-speed movement (from launches)
        if (Math.abs(this.velocity.x) > PLAYER_CONFIG.MOVE_SPEED * 2) {
          // Strong air drag for launched states
          // Original: 0.92^60 ≈ 0.0066 remaining after 1 second (99.34% loss)
          const airDrag = Math.pow(0.0066, deltaTime); // Exponential decay to 0.66% after 1 second
          this.velocity.x *= airDrag;
        } else {
          // Improved air control with faster response
          const airAcceleration = 15; // Increased from 10 for snappier control
          this.velocity.x += (targetInfluence - this.velocity.x * airControl) * deltaTime * airAcceleration;
        }
      }
    }
    
    // Apply velocity to Rapier (once per frame)
    this.rigidBody.setLinvel(this.velocity, true);
  }

  private updateSprite(): void {
    const position = this.rigidBody.translation();
    this.sprite.x = position.x;
    this.sprite.y = position.y;
    // Update glow aura position
    this.glowAura.x = position.x;
    this.glowAura.y = position.y;
    // Update fire effect position
    this.fireEffect.x = position.x;
    this.fireEffect.y = position.y;
  }
  
  private updateGhostTrail(deltaTime: number): void {
    const position = this.getPosition();
    const isMovingFast = Math.abs(this.velocity.x) > 100 || Math.abs(this.velocity.y) > 100;
    
    // Determine trail intensity based on state
    let intensity = 0.2; // Default subtle trail
    let shouldSpawnGhosts = false;
    
    if (this.isRidingBoomerang) {
      // Pronounced trail when riding boomerang
      intensity = 1.0;
      shouldSpawnGhosts = true;
    } else if (this.currentState === PlayerState.Airborne) {
      // Full intensity when airborne (not riding)
      intensity = 1.0;
      shouldSpawnGhosts = true;
    } else if (this.currentState === PlayerState.Sliding) {
      // Same as running - subtle trail when sliding
      intensity = 0.2;
      shouldSpawnGhosts = true;
    } else if (isMovingFast) {
      // Subtle trail when running
      intensity = 0.2;
      shouldSpawnGhosts = true;
    }
    
    // Update ghost trail with current player dimensions and intensity
    this.ghostTrail.update(
      deltaTime,
      shouldSpawnGhosts,
      PLAYER_CONFIG.WIDTH,
      this.currentColliderHeight,
      position.x,
      position.y,
      intensity
    );
  }
  
  private updateFireTrail(deltaTime: number): void {
    const position = this.getPosition();
    const isSliding = this.currentState === PlayerState.Sliding;
    
    // Update fire trail - sparks only appear when sliding
    this.fireTrail.update(
      deltaTime,
      isSliding,
      position.x,
      position.y,
      this.velocity.x
    );
  }

  private updateGroundedState(): void {
    const position = this.rigidBody.translation();
    const state = this.currentState;
    const isCrouched = state === PlayerState.Crouching || state === PlayerState.Sliding;
    const currentHeight = isCrouched ? PLAYER_CONFIG.CROUCH_HEIGHT : PLAYER_CONFIG.HEIGHT;
    const currentWidth = PLAYER_CONFIG.WIDTH;
    
    // Cast multiple rays for better edge detection
    const rayOffsets = [
      0,                           // Center
      -currentWidth * 0.4,         // Left
      currentWidth * 0.4           // Right
    ];
    
    let groundedCount = 0;
    const maxToi = PLAYER_CONFIG.GROUND_CHECK_DISTANCE + 1;
    const solid = true;
    
    for (const xOffset of rayOffsets) {
      this.groundRaycast.origin = { 
        x: position.x + xOffset, 
        y: position.y + currentHeight / 2 - 1 // Start just inside the player
      };
      this.groundRaycast.dir = { x: 0, y: 1 };
      
      const hit = this.world.castRay(
        this.groundRaycast, 
        maxToi,
        solid,
        undefined,
        undefined,
        this.collider // Exclude self
      );
      
      if (hit !== null && hit.toi <= PLAYER_CONFIG.GROUND_CHECK_DISTANCE) {
        groundedCount++;
      }
    }
    
    // Consider grounded if at least one ray hits ground
    this.isGrounded = groundedCount > 0;
    
    // Edge recovery: if stuck (no velocity but not grounded), try to push slightly
    if (!this.isGrounded && Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1) {
      // Check if we might be stuck on an edge
      const vel = this.rigidBody.linvel();
      if (Math.abs(vel.x) < 1 && Math.abs(vel.y) < 1) {
        // Apply small nudge to unstick
        this.velocity.y = 50; // Stronger downward push to ensure unsticking
        
        // Also apply a tiny horizontal nudge based on last facing direction
        if (this.targetVelocityX !== 0) {
          this.velocity.x = this.targetVelocityX > 0 ? 5 : -5;
        }
      }
    }
  }
  
  private updateFriction(): void {
    // Simple friction: normal when grounded, zero when airborne
    const targetFriction = this.isGrounded ? PLAYER_CONFIG.FRICTION : 0.0;
    this.collider.setFriction(targetFriction);
  }
  
  private updateStateMachine(deltaTime: number): void {
    const velocity = this.rigidBody.linvel();
    // Simple state updates based on conditions
    this.updateStateTransitions(velocity.y, deltaTime);
    this.handleStateSpecificBehavior(deltaTime);
  }
  
  private updateStateTransitions(_velocityY: number, _deltaTime: number): void {
    // Auto state transitions based on physics
    if (!this.isGrounded) {
      // Force exit aiming if we become airborne
      if (this.currentState === PlayerState.Aiming) {
        this.stopAiming();
      }
      // Always transition to airborne when not grounded (except during special states)
      if (this.currentState !== PlayerState.Blocking) {
        this.currentState = PlayerState.Airborne;
      }
    } else if (this.isGrounded && this.currentState === PlayerState.Airborne) {
      this.currentState = Math.abs(this.velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD 
        ? PlayerState.Moving 
        : PlayerState.Idle;
    } else if (this.currentState === PlayerState.Idle && Math.abs(this.velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD) {
      this.currentState = PlayerState.Moving;
    } else if (this.currentState === PlayerState.Moving && Math.abs(this.velocity.x) <= PLAYER_CONFIG.VELOCITY_THRESHOLD) {
      this.currentState = PlayerState.Idle;
    }
  }
  
  private getGroundedState(): PlayerState {
    if (!this.isGrounded) {
      return PlayerState.Airborne;
    }
    
    // When grounded, check velocity to determine if moving or idle
    return Math.abs(this.velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD
      ? PlayerState.Moving
      : PlayerState.Idle;
  }

  private handleStateSpecificBehavior(deltaTime: number): void {
    const currentState = this.currentState;
    const previousState = this.previousState;
    
    // Handle state entry logic
    if (currentState !== previousState) {
      // Update collision groups based on state
      const targetHeight = (currentState === PlayerState.Crouching || currentState === PlayerState.Sliding) 
        ? PLAYER_CONFIG.CROUCH_HEIGHT 
        : PLAYER_CONFIG.HEIGHT;
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, targetHeight);
      
      // Reset parry window when entering blocking state
      if (currentState === PlayerState.Blocking && previousState !== PlayerState.Blocking) {
        this.parryWindowTime = PARRY_CONFIG.WINDOW_DURATION;
      }
      
      // Clean up aiming state when exiting
      if (previousState === PlayerState.Aiming && currentState !== PlayerState.Aiming) {
        // Ensure trajectory preview is hidden
        if (this.isAiming) {
          this.isAiming = false;
          this.trajectoryGraphics.clear();
          this.trajectoryGraphics.visible = false;
        }
      }
      
      this.previousState = currentState;
    }
    
    // Update parry window timer
    if (currentState === PlayerState.Blocking) {
      if (this.parryWindowTime > 0) {
        this.parryWindowTime -= deltaTime;
      } else {
        // Auto-exit blocking state after parry window expires
        this.currentState = this.getGroundedState();
      }
    }
    
    // Sliding deceleration is now handled in updatePhysics()
    
  }

  private move(direction: number): void {
    const state = this.currentState;
    
    // Exit blocking if trying to move
    if (state === PlayerState.Blocking) {
      this.currentState = this.getGroundedState();
    }
    
    // Update facing direction and redraw sprite if changed
    const newFacing = direction > 0;
    if (this.isFacingRight !== newFacing) {
      this.isFacingRight = newFacing;
      this.sprite.clear();
      this.drawDetailedCharacter(this.sprite, PLAYER_CONFIG.WIDTH, this.currentColliderHeight, this.isFacingRight);
    }
    
    if (state === PlayerState.Idle || state === PlayerState.Moving || state === PlayerState.Airborne) {
      this.targetVelocityX = direction * PLAYER_CONFIG.MOVE_SPEED;
    } else if (state === PlayerState.Crouching) {
      this.targetVelocityX = direction * PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    }
  }

  public moveLeft(_deltaTime: number): void {
    this.move(-1);
  }

  public moveRight(_deltaTime: number): void {
    this.move(1);
  }

  public stopMoving(_deltaTime: number): void {
    const state = this.currentState;
    if (state === PlayerState.Idle || state === PlayerState.Moving || 
        state === PlayerState.Crouching || state === PlayerState.Airborne) {
      this.targetVelocityX = 0;
    }
  }
  
  public crouch(): void {
    // Cannot crouch or slide during air time
    if (!this.isGrounded) return;
    
    const state = this.currentState;
    // Check if we should slide (moving at or near max speed)
    const speedRatio = Math.abs(this.velocity.x) / PLAYER_CONFIG.MOVE_SPEED;
    const shouldSlide = speedRatio >= 0.85; // Slide if at 85% or more of max speed
    
    if (state === PlayerState.Moving && shouldSlide) {
      // Transition to sliding with speed boost
      this.currentState = PlayerState.Sliding;
      this.velocity.x = this.velocity.x > 0 ? PLAYER_CONFIG.SLIDE_SPEED : -PLAYER_CONFIG.SLIDE_SPEED;
      this.slideInitiated = true; // Mark that we just started sliding
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.CROUCH_HEIGHT);
    } else if (state === PlayerState.Idle || state === PlayerState.Moving) {
      // Regular crouch
      this.currentState = PlayerState.Crouching;
      // Immediately adjust velocity if moving too fast
      if (Math.abs(this.velocity.x) > PLAYER_CONFIG.CROUCH_MOVE_SPEED) {
        this.velocity.x = this.velocity.x > 0 
          ? PLAYER_CONFIG.CROUCH_MOVE_SPEED 
          : -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
      }
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.CROUCH_HEIGHT);
    }
    // If already crouching or sliding, do nothing
  }
  
  public stand(): void {
    const state = this.currentState;
    if (state === PlayerState.Crouching) {
      this.currentState = this.getGroundedState();
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    } else if (state === PlayerState.Sliding) {
      // Exit sliding state when crouch key is released
      // Check velocity to determine if we should go to idle or moving
      this.currentState = Math.abs(this.velocity.x) > PLAYER_CONFIG.VELOCITY_THRESHOLD
        ? PlayerState.Moving
        : PlayerState.Idle;
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    }
  }
  
  public startBlocking(): void {
    if (!this.hasBoomerang) {
      this.currentState = PlayerState.Blocking;
      this.parryWindowTime = PARRY_CONFIG.WINDOW_DURATION;
      
      // Stop horizontal movement when blocking
      this.targetVelocityX = 0;
    }
  }
  
  private getCollisionGroups(isCrouching: boolean): number {
    const membership = isCrouching ? COLLISION_GROUPS.PLAYER_CROUCHING : COLLISION_GROUPS.PLAYER_STANDING;
    const filter = isCrouching
      ? COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.ENEMY  // No BOOMERANG when crouching
      : COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.BOOMERANG | COLLISION_GROUPS.ENEMY;
    return (membership << 16) | filter;
  }

  private updateColliderSize(width: number, height: number): void {
    // Check if we need to update collision groups even if size hasn't changed
    const currentState = this.currentState;
    const needsCrouchingGroups = (currentState === PlayerState.Crouching || currentState === PlayerState.Sliding);
    const isCrouching = height <= PLAYER_CONFIG.CROUCH_HEIGHT;
    
    // If height hasn't changed but collision groups need updating
    if (height === this.currentColliderHeight) {
      // Just update collision groups without recreating collider
      this.collider.setCollisionGroups(this.getCollisionGroups(needsCrouchingGroups));
      return;
    }
    
    // Store current position and velocity
    const position = this.rigidBody.translation();
    const velocity = this.rigidBody.linvel();
    
    // Remove old collider
    this.world.removeCollider(this.collider, false);
    
    // Create new collider with updated size (centered on rigid body)
    const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
      width / 2,
      height / 2
    )
      .setRestitution(PLAYER_CONFIG.RESTITUTION)
      .setFriction(PLAYER_CONFIG.FRICTION)
      .setCollisionGroups(this.getCollisionGroups(isCrouching));
    
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    
    // Set collision events
    this.collider.setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
    
    // Adjust rigid body position to keep feet at same position
    const heightChange = this.currentColliderHeight - height;
    if (heightChange !== 0) {
      this.rigidBody.setTranslation(
        { x: position.x, y: position.y + heightChange / 2 },
        true
      );
    }
    
    // Update tracked height
    this.currentColliderHeight = height;
    
    // Restore velocity
    this.rigidBody.setLinvel(velocity, true);
    
    // Update sprite to match
    this.sprite.clear();
    this.drawDetailedCharacter(this.sprite, width, height, this.isFacingRight);
    // Redraw glow and fire effect for new size
    this.drawGlowAura();
    this.drawFireFrame();
  }

  public getPosition(): Vector2 {
    const pos = this.rigidBody.translation();
    return { x: pos.x, y: pos.y };
  }
  
  public getState(): PlayerState {
    return this.currentState;
  }
  
  public setHasBoomerang(value: boolean): void {
    this.hasBoomerang = value;
    if (value) {
      // Set cooldown when catching boomerang to prevent immediate re-throw
      this.catchCooldown = PHYSICS.CATCH_COOLDOWN;
    }
  }
  
  public getHasBoomerang(): boolean {
    return this.hasBoomerang;
  }
  
  public getCollider(): RAPIER.Collider {
    return this.collider;
  }
  
  public setFacingDirection(faceRight: boolean): void {
    this.isFacingRight = faceRight;
    
    // Update trajectory preview if aiming
    if (this.isAiming) {
      this.updateTrajectoryPreview();
    }
  }
  
  public startAiming(): void {
    // Don't allow aiming during catch cooldown
    if (this.catchCooldown > 0) return;
    
    // Don't allow aiming while airborne
    if (!this.isGrounded) return;
    
    if (this.hasBoomerang && this.currentState !== PlayerState.Aiming) {
      const currentState = this.currentState;
      
      // If crouching or sliding, stand up first
      if (currentState === PlayerState.Crouching || currentState === PlayerState.Sliding) {
        this.stand();
      }
      
      this.isAiming = true;
      this.aimAngle = 180; // Reset to straight ahead when starting to aim
      
      // Stop all movement when aiming
      this.targetVelocityX = 0;
      const currentVel = this.rigidBody.linvel();
      this.rigidBody.setLinvel({ x: 0, y: currentVel.y }, true);
      
      this.currentState = PlayerState.Aiming;
      this.trajectoryGraphics.visible = true;
      this.updateTrajectoryPreview();
    }
  }
  
  public stopAiming(): void {
    if (this.isAiming) {
      this.isAiming = false;
      this.trajectoryGraphics.clear();
      this.trajectoryGraphics.visible = false;
      
      // Prepare throw parameters
      const position = this.getPosition();
      const throwParams: BoomerangThrowParams = {
        origin: {
          x: position.x,
          y: position.y - PLAYER_CONFIG.HEIGHT * 0.20 // 70% height
        },
        angle: this.aimAngle,
        facingRight: this.isFacingRight
      };
      
      // Throw boomerang through Game instance
      if (this.gameInstance && this.hasBoomerang) {
        this.gameInstance.spawnBoomerang(this, throwParams);
        // Mark that we no longer have the boomerang
        this.hasBoomerang = false;
      }
      
      this.currentState = this.getGroundedState();
    }
  }
  
  public updateAimAngle(angle: number): void {
    // Clamp angle between min and max
    this.aimAngle = Math.max(
      BOOMERANG_CONFIG.MIN_ANGLE,
      Math.min(BOOMERANG_CONFIG.MAX_ANGLE, angle)
    );
    
    if (this.isAiming) {
      this.updateTrajectoryPreview();
    }
  }
  
  public updateAimAngleFromMouseDelta(deltaY: number): void {
    // deltaY is positive when mouse moves up from initial position
    // Map vertical distance to angle range with 1.4x sensitivity
    const maxVerticalDistance = 140; // 140 pixels for full angle range (higher sensitivity)
    const normalizedDelta = Math.max(-1, Math.min(1, deltaY / maxVerticalDistance));
    
    // Map normalized delta to angle range
    // 0 (no movement) = 180°
    // +1 (mouse moved up) = MIN_ANGLE
    // -1 (mouse moved down) = 180° (keep straight)
    let angle;
    if (normalizedDelta <= 0) {
      // Mouse at or below initial position - keep straight
      angle = 180;
    } else {
      // Mouse above initial position - curve upward
      angle = 180 - (normalizedDelta * TRAJECTORY_CONFIG.ANGLE_RANGE);
    }
    
    this.updateAimAngle(angle);
  }
  
  private updateTrajectoryPreview(): void {
    const position = this.getPosition();
    // Offset Y position to 70% of character height (30% from top)
    const throwPosition = {
      x: position.x,
      y: position.y - PLAYER_CONFIG.HEIGHT * 0.20
    };
    drawBoomerangTrajectory(this.trajectoryGraphics, throwPosition, this.aimAngle, this.isFacingRight);
  }
  
  public setProjectileManager(gameInstance: any): void {
    this.gameInstance = gameInstance;
  }
  
  public isInParryWindow(): boolean {
    return this.currentState === PlayerState.Blocking && this.parryWindowTime > 0;
  }
  
  public mountBoomerang(boomerang: IBoomerang): void {
    if (this.isRidingBoomerang) return;
    
    this.isRidingBoomerang = true;
    this.ridingBoomerang = boomerang;
    
    // Force airborne state by making us not grounded
    this.isGrounded = false;
    
    // Stop blocking state
    if (this.currentState === PlayerState.Blocking) {
      this.currentState = this.getGroundedState();
    }
    
    // Stop all horizontal movement
    this.targetVelocityX = 0;
  }
  
  public dismountBoomerang(launchVelocity?: Vector2): void {
    if (!this.isRidingBoomerang) return;
    
    this.isRidingBoomerang = false;
    this.ridingBoomerang = null;
    
    // Ensure trajectory preview is hidden
    if (this.isAiming) {
      this.isAiming = false;
      this.trajectoryGraphics.clear();
      this.trajectoryGraphics.visible = false;
      this.currentState = this.getGroundedState();
    }
    
    // Apply launch velocity to our custom physics system
    if (launchVelocity) {
      this.velocity.x = launchVelocity.x;
      this.velocity.y = launchVelocity.y;
      
      // Reset target velocity so we don't fight the launch
      this.targetVelocityX = 0;
      
      // Force airborne state
      this.isGrounded = false;
      this.currentState = PlayerState.Airborne;
    }
    
  }
  
  public getIsRiding(): boolean {
    return this.isRidingBoomerang;
  }
  
  public getCurrentVelocity(): Vector2 {
    return { x: this.velocity.x, y: this.velocity.y };
  }
  
  public getIsGrounded(): boolean {
    return this.isGrounded;
  }
  
  public getIsFacingRight(): boolean {
    return this.isFacingRight;
  }

}