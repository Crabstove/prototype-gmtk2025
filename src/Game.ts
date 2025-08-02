import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { Player } from './Player';
import { Level } from './Level';
import { Boomerang } from './entities/Boomerang';
import * as Input from './systems/input';
import { TimeSlowEffect } from './systems/TimeSlowEffect';
import { RapierWorld, PlayerState, BoomerangState, BoomerangThrowParams } from './types';
import { GAME_CONFIG, PHYSICS, TIME_SLOW_CONFIG, PLAYER_CONFIG, CAMERA_CONFIG, DISMOUNT_CONFIG } from './constants/game.constants';
import "pixi.js/math-extras"

export class Game {
  private app!: PIXI.Application;
  private world!: RapierWorld;
  private player!: Player;
  private level!: Level;
  private boomerang: Boomerang | null = null;  // Single boomerang instance
  private cameraContainer!: PIXI.Container;
  private uiContainer!: PIXI.Container;
  private timeSlowEffect!: TimeSlowEffect;
  private RAPIER!: typeof RAPIER;
  private physicsAccumulator: number = 0;

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
    this.level = new Level(this.world, this.cameraContainer, this.RAPIER);
    this.player = new Player(this.world, this.cameraContainer, 100, 400, this.RAPIER);
    
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
  
  private handleAimingInput(actions: any): void {
    // During aiming, only allow direction changes (no movement)
    if (actions.moveLeft) {
      this.player.setFacingDirection(false);
    } else if (actions.moveRight) {
      this.player.setFacingDirection(true);
    }
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
          Input.setInitialAimMouseY();
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
    
    // Target position for camera - centered on player
    const cameraOffset = GAME_CONFIG.HEIGHT * 0.1;
    const targetX = -playerPos.x + GAME_CONFIG.WIDTH / 2;
    const targetY = -playerPos.y + GAME_CONFIG.HEIGHT / 2 + cameraOffset;
    
    // Direct camera positioning for X (no smoothing) to eliminate horizontal jitter
    this.cameraContainer.x = targetX;
    
    // Calculate distance from player to current camera center for Y
    const currentCameraY = -this.cameraContainer.y + GAME_CONFIG.HEIGHT / 2 - cameraOffset;
    const distanceFromCenter = Math.abs(playerPos.y - currentCameraY);
    
    // Dynamic Y smoothing - faster when player is far from center
    let ySmoothing = 4.0; // Base smoothing for normal movement
    
    // Speed up if player is getting far from center
    if (distanceFromCenter > GAME_CONFIG.HEIGHT * 0.2) {
      // Use faster catch-up when far away
      ySmoothing = 8.0 + (distanceFromCenter / GAME_CONFIG.HEIGHT) * 4;
    }
    
    // Also consider vertical velocity for even faster tracking during launches
    if (Math.abs(playerVelocity.y) > 400) {
      ySmoothing = Math.max(ySmoothing, 10.0);
    }
    
    // Apply Y smoothing
    const yLerp = 1 - Math.pow(0.5, deltaTime * ySmoothing);
    this.cameraContainer.y = this.cameraContainer.y + (targetY - this.cameraContainer.y) * yLerp;
    
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
  public spawnBoomerang(owner: Player, throwParams: BoomerangThrowParams): void {
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
    
    // Check collision with walls/platforms
    this.world.intersectionsWith(boomerangCollider, (otherCollider) => {
      if (otherCollider === playerCollider) return true;
      this.boomerang!.checkWallCollision();
      return false;
    });
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