import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { Player } from './Player';
import { Level } from './Level';
import { Boomerang } from './entities/Boomerang';
import * as Input from './systems/input';
import { TimeSlowEffect } from './systems/TimeSlowEffect';
import { RapierWorld, PlayerState, BoomerangState, BoomerangThrowParams, Vector2 } from './types';
import { GAME_CONFIG, PHYSICS, TIME_SLOW_CONFIG, DISMOUNT_CONFIG, COLLISION_GROUPS } from './constants/game.constants';
import { LEVEL_1_PLATFORMS } from './data/level.data';
import "pixi.js/math-extras"

export class Game {
  private app!: PIXI.Application;
  private world!: RapierWorld;
  private player!: Player;
  private boomerang: Boomerang | null = null;  // Single boomerang instance
  private cameraContainer!: PIXI.Container;
  private uiContainer!: PIXI.Container;
  private timeSlowEffect!: TimeSlowEffect;
  private RAPIER!: typeof RAPIER;
  private physicsAccumulator: number = 0;
  
  // Camera system
  private cameraOffset: Vector2 = { x: 0, y: 0 };
  private targetCameraOffset: Vector2 = { x: 0, y: 0 };
  private previousPlayerY: number = 0;
  private isBigJump: boolean = false;
  private jumpStartY: number = 0;
  private bigJumpTime: number = 0;
  private cameraShake: Vector2 = { x: 0, y: 0 };

  public async init(RapierModule: typeof RAPIER): Promise<void> {
    this.RAPIER = RapierModule;
    
    await this.initializePixi();
    this.initializePhysics();
    this.initializeSystems();
    this.initializeEntities();
    this.startGameLoop();
  }

  private async initializePixi(): Promise<void> {
    this.app = new PIXI.Application();
    await this.app.init({
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
      antialias: GAME_CONFIG.ANTIALIAS,
    });

    this.cameraContainer = new PIXI.Container();
    this.cameraContainer.sortableChildren = true; // Enable z-index sorting
    
    this.uiContainer = new PIXI.Container();
    this.uiContainer.zIndex = 1000;
    
    this.app.stage.addChild(this.cameraContainer);
    this.app.stage.addChild(this.uiContainer);
  }

  private initializePhysics(): void {
    this.world = new this.RAPIER.World(PHYSICS.GRAVITY);
  }

  private initializeSystems(): void {
    this.timeSlowEffect = new TimeSlowEffect(this.uiContainer);
    
    // Set canvas for mouse input after PIXI is initialized
    setTimeout(() => {
      Input.setCanvas(this.app.canvas);
    }, 0);
  }

  private initializeEntities(): void {
    new Level(this.world, this.cameraContainer, this.RAPIER);
    this.player = new Player(this.world, this.cameraContainer, 100, 400, this.RAPIER);
    
    // Initialize camera tracking
    this.previousPlayerY = this.player.getPosition().y;
    
    // Initialize boomerang (starts caught)
    this.boomerang = new Boomerang(this.world, this.cameraContainer, this.RAPIER);
    this.boomerang.setOwner(this.player);
    
    // Give player reference to this game instance for boomerang spawning
    this.player.setProjectileManager(this);
  }

  private startGameLoop(): void {
    this.app.ticker.add(() => {
      const deltaTime = this.app.ticker.deltaMS / 1000;
      this.update(deltaTime);
    });
  }

  private update(deltaTime: number): void {
    const actions = Input.getInputActions();
    const isAiming = this.player.getState() === PlayerState.Aiming;
    const timeScale = isAiming ? TIME_SLOW_CONFIG.TIME_SCALE : 1.0;
    const scaledDeltaTime = deltaTime * timeScale;
    
    // Update visual effects
    this.timeSlowEffect.update(deltaTime);
    
    // Handle input
    this.handleInput(actions, isAiming, scaledDeltaTime);
    
    // Update physics with fixed timestep accumulator
    this.updatePhysics(deltaTime, timeScale);
    
    // Update entities
    this.updateEntities(deltaTime);
    
    // Update camera
    this.updateCamera(deltaTime);
  }
  
  private handleInput(actions: any, isAiming: boolean, scaledDeltaTime: number): void {
    if (!isAiming) {
      this.handleMovement(actions, scaledDeltaTime);
    } else {
      this.handleAimingInput(actions);
    }
    
    this.handleActionButton(actions);
  }
  
  private handleMovement(actions: any, scaledDeltaTime: number): void {
    // Normal movement when not aiming
    if (actions.moveLeft) {
      this.player.moveLeft(scaledDeltaTime);
    } else if (actions.moveRight) {
      this.player.moveRight(scaledDeltaTime);
    } else {
      this.player.stopMoving(scaledDeltaTime);
    }
    
    // Handle crouch/slide
    if (actions.crouch) {
      this.player.crouch();
    } else {
      this.player.stand();
    }
  }
  
  private handleAimingInput(_actions: any): void {
    // Use mouse position to determine facing direction
    const mousePos = Input.getMousePosition();
    const canvasWidth = this.app.screen.width;
    
    // Face right if mouse is on right half of screen, left otherwise
    const shouldFaceRight = mousePos.x > canvasWidth / 2;
    this.player.setFacingDirection(shouldFaceRight);
  }
  
  private handleActionButton(actions: any): void {
    if (actions.action) {
      // Check if riding first
      if (this.player.getIsRiding()) {
        this.handleCatchWhileRiding();
      } else if (this.player.getHasBoomerang()) {
        // Start aiming when action is pressed with boomerang
        if (this.player.getState() !== PlayerState.Aiming) {
          this.player.startAiming();
          Input.setInitialAimMouse();
        }
        
        // While aiming, continuously update angle based on mouse
        if (this.player.getState() === PlayerState.Aiming) {
          this.timeSlowEffect.startTimeSlow();
          const mouseDeltaY = Input.getMouseYDeltaFromAimStart();
          this.player.updateAimAngleFromMouseDelta(mouseDeltaY);
        }
      } else {
        // Block when no boomerang
        this.player.startBlocking();
      }
    } else {
      // Handle action release
      if (this.player.getState() === PlayerState.Aiming) {
        this.player.stopAiming();
      }
      
      // Stop time slow effect
      if (this.timeSlowEffect.getIsActive()) {
        this.timeSlowEffect.stopTimeSlow();
      }
    }
  }
  
  private updatePhysics(deltaTime: number, timeScale: number): void {
    // Fixed timestep with accumulator for consistent physics
    // This ensures physics runs at the same speed regardless of framerate
    const scaledDelta = deltaTime * timeScale;
    this.physicsAccumulator += scaledDelta;
    
    // Cap accumulator to prevent spiral of death at very low framerates
    const maxAccumulator = PHYSICS.FIXED_TIME_STEP * 4; // Max 4 physics steps per frame
    if (this.physicsAccumulator > maxAccumulator) {
      this.physicsAccumulator = maxAccumulator;
    }
    
    // Step physics at fixed timestep
    while (this.physicsAccumulator >= PHYSICS.FIXED_TIME_STEP) {
      this.world.step();
      this.physicsAccumulator -= PHYSICS.FIXED_TIME_STEP;
    }
  }
  
  private updateEntities(deltaTime: number): void {
    // Update boomerang with normal deltaTime (not affected by time slow)
    if (this.boomerang && this.boomerang.getState() !== BoomerangState.Caught) {
      this.boomerang.update(deltaTime);
      this.checkBoomerangCollisions();
    }
    
    // Update player with normal deltaTime (physics already handles time scale)
    this.player.update(deltaTime);
  }
  

  public getCanvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }
  
  private updateCamera(deltaTime: number): void {
    // Camera follows player's actual center (midpoint)
    const playerPos = this.player.getPosition();
    const playerVelocity = this.player.getCurrentVelocity();
    const isGrounded = this.player.getIsGrounded();
    const facingRight = this.player.getIsFacingRight();
    
    // Detect sudden vertical movement (big jump)
    const yDelta = playerPos.y - this.previousPlayerY; // Signed delta for direction
    const isAirborne = !isGrounded && !this.player.getIsRiding();
    
    // Start tracking big jump - detect sudden upward movement
    if (isAirborne && yDelta < -10 && !this.isBigJump) { // Negative Y is upward
      this.isBigJump = true;
      this.jumpStartY = playerPos.y;
      this.bigJumpTime = 0;
      
      // Calculate dynamic offset based on movement direction
      const xDirection = playerVelocity.x !== 0 ? Math.sign(playerVelocity.x) : (facingRight ? 1 : -1);
      
      // Camera looks ahead to where player will LAND (the arc trajectory)
      // When jumping up+left, player will fall down+left, so camera looks there
      this.targetCameraOffset.x = GAME_CONFIG.WIDTH * 0.1 * xDirection; // Look in horizontal movement direction
      this.targetCameraOffset.y = -GAME_CONFIG.HEIGHT * 0.1; // Negative to look DOWN at landing area
      
      // Add a tiny shake for impact feel
      this.cameraShake.x = (Math.random() - 0.5) * 4;
      this.cameraShake.y = (Math.random() - 0.5) * 4;
    }
    
    // Track big jump duration
    if (this.isBigJump) {
      this.bigJumpTime += deltaTime;
      
      // Gradually reduce offset as jump progresses for dynamic feel
      const jumpProgress = Math.min(this.bigJumpTime / 1.5, 1); // Normalize over 1.5 seconds
      const easedProgress = this.easeInOutCubic(jumpProgress);
      
      // Interpolate offset based on jump progress
      const xDirection = Math.sign(this.targetCameraOffset.x);
      this.targetCameraOffset.x = GAME_CONFIG.WIDTH * 0.1 * xDirection * (1 - easedProgress * 0.3);
      this.targetCameraOffset.y = -GAME_CONFIG.HEIGHT * 0.1 * (1 - easedProgress * 0.5);
    }
    
    // Reset when landing with smooth transition
    if (isGrounded && this.isBigJump) {
      this.isBigJump = false;
      this.bigJumpTime = 0;
      // Bounce the camera slightly on landing for whimsy
      this.targetCameraOffset.x *= 0.5;
      this.targetCameraOffset.y = GAME_CONFIG.HEIGHT * 0.02; // Slight upward bounce
      
      // Small landing shake
      this.cameraShake.x = (Math.random() - 0.5) * 2;
      this.cameraShake.y = -3; // Upward shake on landing
    }
    
    // Return to neutral when fully settled
    if (isGrounded && !this.isBigJump && Math.abs(this.targetCameraOffset.y) < 5) {
      this.targetCameraOffset.x *= 0.95; // Gradual return
      this.targetCameraOffset.y *= 0.95;
    }
    
    // Smooth camera offset transitions with spring-like easing
    const offsetSmoothing = this.isBigJump ? 6.0 : 10.0; // Responsive but smooth
    const offsetLerp = 1 - Math.pow(0.5, deltaTime * offsetSmoothing);
    this.cameraOffset.x += (this.targetCameraOffset.x - this.cameraOffset.x) * offsetLerp;
    this.cameraOffset.y += (this.targetCameraOffset.y - this.cameraOffset.y) * offsetLerp;
    
    // Apply and decay camera shake
    this.cameraShake.x *= Math.pow(0.1, deltaTime * 8); // Fast decay
    this.cameraShake.y *= Math.pow(0.1, deltaTime * 8);
    
    // Target position for camera - centered on player with dynamic offset and shake
    const baseCameraOffset = GAME_CONFIG.HEIGHT * 0.1;
    const targetX = -playerPos.x + GAME_CONFIG.WIDTH / 2 + this.cameraOffset.x + this.cameraShake.x;
    const targetY = -playerPos.y + GAME_CONFIG.HEIGHT / 2 + baseCameraOffset + this.cameraOffset.y + this.cameraShake.y;
    
    // Store previous Y for next frame
    this.previousPlayerY = playerPos.y;
    
    // Direct camera positioning for X (no smoothing) to eliminate horizontal jitter
    this.cameraContainer.x = targetX;
    
    // Calculate distance from player to current camera center for Y
    const currentCameraY = -this.cameraContainer.y + GAME_CONFIG.HEIGHT / 2 - baseCameraOffset;
    const distanceFromCenter = Math.abs(playerPos.y - currentCameraY);
    
    // For very fast upward movement, use minimal or no smoothing to prevent jitter
    const isMovingUpFast = playerVelocity.y < -300; // Negative Y is upward
    
    if (isMovingUpFast) {
      // Direct positioning or very fast tracking for upward launches
      if (playerVelocity.y < -600) {
        // Instant tracking for very fast upward movement
        this.cameraContainer.y = targetY;
      } else {
        // Very fast tracking for moderate upward movement
        const yLerp = 1 - Math.pow(0.5, deltaTime * 20.0);
        this.cameraContainer.y = this.cameraContainer.y + (targetY - this.cameraContainer.y) * yLerp;
      }
    } else {
      // Normal smoothing for other movements
      let ySmoothing = 4.0; // Base smoothing for normal movement
      
      // Speed up if player is getting far from center
      if (distanceFromCenter > GAME_CONFIG.HEIGHT * 0.2) {
        // Use faster catch-up when far away
        ySmoothing = 8.0 + (distanceFromCenter / GAME_CONFIG.HEIGHT) * 4;
      }
      
      // Consider downward velocity for faster tracking
      if (playerVelocity.y > 400) {
        ySmoothing = Math.max(ySmoothing, 10.0);
      }
      
      // Apply Y smoothing
      const yLerp = 1 - Math.pow(0.5, deltaTime * ySmoothing);
      this.cameraContainer.y = this.cameraContainer.y + (targetY - this.cameraContainer.y) * yLerp;
    }
    
    // Simple dynamic zoom based on vertical speed only
    const baseScale = 1.0;
    const minScale = 0.9; // 10% zoom out at max
    
    // Only zoom out when moving very fast vertically
    let targetScale = baseScale;
    if (Math.abs(playerVelocity.y) > 500) {
      const zoomFactor = Math.min((Math.abs(playerVelocity.y) - 500) / 300, 1);
      targetScale = baseScale - (baseScale - minScale) * zoomFactor;
    }
    
    // Apply zoom with smoothing
    const currentScale = this.cameraContainer.scale.x;
    const scaleSmoothing = 3.0;
    const scaleLerp = 1 - Math.pow(0.5, deltaTime * scaleSmoothing);
    const newScale = currentScale + (targetScale - currentScale) * scaleLerp;
    
    this.cameraContainer.scale.set(newScale, newScale);
  }
  
  // Called by Player when throwing boomerang
  public spawnBoomerang(_owner: Player, throwParams: BoomerangThrowParams): void {
    if (this.boomerang) {
      this.boomerang.throw(throwParams);
    }
  }
  
  private checkBoomerangCollisions(): void {
    if (!this.boomerang) return;
    
    const boomerangCollider = this.boomerang.getCollider();
    if (!boomerangCollider) return;
    
    const playerCollider = this.player.getCollider();
    
    // Check collision with player
    const intersecting = this.world.intersectionPair(boomerangCollider, playerCollider);
    if (intersecting) {
      this.boomerang.handlePlayerCollision();
    }
    
    // Simple collision check for boomerang vs platforms
    const boomerangPos = this.boomerang.getPosition();
    if (!boomerangPos) return;
    
    // Check each platform in level data
    const platforms = this.getPlatformData();
    for (const platform of platforms) {
      // Simple AABB collision check
      const boomerangRadius = 8;
      
      if (boomerangPos.x + boomerangRadius >= platform.x &&
          boomerangPos.x - boomerangRadius <= platform.x + platform.width &&
          boomerangPos.y + boomerangRadius >= platform.y &&
          boomerangPos.y - boomerangRadius <= platform.y + platform.height) {
        this.boomerang!.checkWallCollision();
        return; // Stop checking after first collision
      }
    }
  }
  
  private getPlatformData() {
    // Import platform data from level
    return LEVEL_1_PLATFORMS;
  }
  
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  private handleCatchWhileRiding(): void {
    // Check if player is riding the boomerang
    if (!this.player.getIsRiding() || !this.boomerang) return;
    
    // Get the boomerang's flight direction and current velocity
    const flightDir = this.boomerang.getFlightDirection();
    const boomerangVel = this.boomerang.getCurrentVelocity();
    const boomerangState = this.boomerang.getCurrentState();
    
    // Apply boost that maintains more momentum in both X and Y
    const minBoostRatio = DISMOUNT_CONFIG.MIN_BOOST_RATIO;
    
    // Reduce Y boost during hang state (at trajectory peak)
    const ySpeedMultiplier = (boomerangState === BoomerangState.Hanging) ? 
      DISMOUNT_CONFIG.Y_SPEED_HANG_MULTIPLIER : 1.0;
    
    // Boost horizontal launches (when flying in a straight line)
    const isStraightLine = this.boomerang.getIsStraightLine();
    const xSpeedMultiplier = isStraightLine ? DISMOUNT_CONFIG.X_SPEED_STRAIGHT_MULTIPLIER : 1.0;
    
    // Calculate base velocities
    let launchX = flightDir.x * PHYSICS.DISMOUNT_SPEED * xSpeedMultiplier;
    let launchY = flightDir.y * PHYSICS.DISMOUNT_SPEED * ySpeedMultiplier;
    
    // Add upward boost for perfect horizontal throws
    if (isStraightLine && Math.abs(flightDir.y) < 0.01) {
      launchY = DISMOUNT_CONFIG.HORIZONTAL_UPWARD_BOOST;
    }
    
    // Ensure minimum boost in each direction (if there's any movement in that direction)
    if (Math.abs(flightDir.x) > 0.01) {
      const minX = PHYSICS.DISMOUNT_SPEED * minBoostRatio;
      if (Math.abs(launchX) < minX) {
        launchX = minX * Math.sign(flightDir.x);
      }
    }
    
    if (Math.abs(flightDir.y) > 0.01) {
      const minY = PHYSICS.DISMOUNT_SPEED * minBoostRatio;
      if (Math.abs(launchY) < minY) {
        launchY = minY * Math.sign(flightDir.y);
      }
    }
    
    // Get player's current velocity while riding (matches boomerang speed)
    const playerCurrentVel = this.player.getCurrentVelocity();
    
    // Blend with current velocity for smoother transition
    const inertiaBlend = DISMOUNT_CONFIG.INERTIA_BLEND;
    const launchVelocity = { 
      x: playerCurrentVel.x * inertiaBlend + launchX * (1 - inertiaBlend) + boomerangVel.x * DISMOUNT_CONFIG.BOOMERANG_VELOCITY_FACTOR,
      y: playerCurrentVel.y * inertiaBlend + launchY * (1 - inertiaBlend) + boomerangVel.y * DISMOUNT_CONFIG.BOOMERANG_VELOCITY_FACTOR
    };
    
    // Dismount with calculated velocity and catch the boomerang
    this.player.dismountBoomerang(launchVelocity);
    this.boomerang.catch();
    this.player.setHasBoomerang(true);
  }
}