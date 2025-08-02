import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { Player } from './Player';
import { Level } from './Level';
import { Boomerang } from './entities/Boomerang';
import * as Input from './systems/input';
import { TimeSlowEffect } from './systems/TimeSlowEffect';
import { RapierWorld, PlayerState, BoomerangState, BoomerangThrowParams } from './types';
import { GAME_CONFIG, PHYSICS, TIME_SLOW_CONFIG } from './constants/game.constants';
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
    
    // Check if player is aiming for time slow
    const isAiming = this.player.getState() === PlayerState.Aiming;
    const timeScale = isAiming ? TIME_SLOW_CONFIG.TIME_SCALE : 1.0;
    const scaledDeltaTime = deltaTime * timeScale;
    
    // Update time slow visual effects
    this.timeSlowEffect.update(deltaTime);
    
    // Handle movement
    if (!isAiming) {
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
    } else {
      // During aiming, only allow direction changes (no movement)
      if (actions.moveLeft) {
        this.player.setFacingDirection(false);
      } else if (actions.moveRight) {
        this.player.setFacingDirection(true);
      }
    }
    
    // Handle action button (throw/block/catch)
    if (actions.action) {
      // Check if riding first
      if (this.player.getIsRiding()) {
        // Catch while riding immediately on press
        this.handleCatchWhileRiding();
      } else if (this.player.getHasBoomerang()) {
        // Start aiming when action is pressed with boomerang (only if not already aiming)
        if (this.player.getState() !== PlayerState.Aiming) {
          this.player.startAiming();
          // Capture initial mouse position for relative movement
          Input.setInitialAimMouseY();
        }
        
        // While aiming, continuously update angle based on mouse
        if (this.player.getState() === PlayerState.Aiming) {
          this.timeSlowEffect.startTimeSlow();
          
          // Update aim angle based on mouse movement relative to initial position
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
        // Player will handle throwing through ProjectileManager
        this.player.stopAiming();
      } else if (this.player.getState() === PlayerState.Blocking) {
        // Don't stop blocking immediately - let it continue for the parry window
        // It will auto-stop when the player moves or after some time
      }
      
      // Stop time slow effect
      if (this.timeSlowEffect.getIsActive()) {
        this.timeSlowEffect.stopTimeSlow();
      }
    }
    
    // Step physics with time scaling
    // During time slow, we step physics less frequently
    const physicsSteps = timeScale;
    if (physicsSteps > 0.01) {  // Only step if time scale is meaningful
      this.world.timestep = PHYSICS.FIXED_TIME_STEP * timeScale;
      this.world.step();
      this.world.timestep = PHYSICS.FIXED_TIME_STEP;  // Reset for next frame
    }
    
    // Update boomerang with normal deltaTime (not affected by time slow)
    if (this.boomerang && this.boomerang.getState() !== BoomerangState.Caught) {
      this.boomerang.update(deltaTime);
      this.checkBoomerangCollisions();
    }
    
    // Update player with normal deltaTime (physics already handles time scale)
    this.player.update(deltaTime);
    
    // Update camera to follow player (simple lerp)
    this.updateCamera();
  }
  

  public getCanvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }
  
  public getLevel(): Level {
    return this.level;
  }
  
  private updateCamera(): void {
    // Simple camera lerp to follow player
    const playerPos = this.player.getPosition();
    const targetX = -playerPos.x + GAME_CONFIG.WIDTH / 2;
    const targetY = -playerPos.y + GAME_CONFIG.HEIGHT / 2;
    
    // Smooth lerp (0.1 = 10% toward target each frame)
    this.cameraContainer.x += (targetX - this.cameraContainer.x) * 0.1;
    this.cameraContainer.y += (targetY - this.cameraContainer.y) * 0.1;
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
    
    // Get boomerang's current velocity for momentum transfer
    const boomerangVel = this.boomerang.getCurrentVelocity();
    
    // Transfer the boomerang's momentum to the player
    // For straight line trajectories, add upward boost
    const launchVelocity: RAPIER.Vector2 = {
      x: boomerangVel.x,
      y: boomerangVel.y
    };
    
    // If Y velocity is near zero (straight line), add upward boost
    if (Math.abs(boomerangVel.y) < PHYSICS.STRAIGHT_LINE_Y_THRESHOLD) {
      launchVelocity.y = PHYSICS.STRAIGHT_LINE_DISMOUNT_BOOST;
    }
    
    // Dismount with momentum and catch the boomerang
    this.player.dismountBoomerang(launchVelocity);
    this.boomerang.catch();
    this.player.setHasBoomerang(true);
  }
}