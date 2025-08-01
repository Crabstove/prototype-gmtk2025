import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { Player } from './Player';
import { Level } from './Level';
import { InputSystem, CameraSystem, TimeSlowEffect } from './systems';
import { ProjectileManager } from './managers';
import { RapierWorld, PlayerState, BoomerangState } from './types';
import { GAME_CONFIG, PHYSICS_CONFIG, TIME_SLOW_CONFIG, PLAYER_CONFIG, PHYSICS_VALUES } from './constants';

export class Game {
  private app!: PIXI.Application;
  private world!: RapierWorld;
  private player!: Player;
  private level!: Level;
  private projectileManager!: ProjectileManager;
  private cameraContainer!: PIXI.Container;
  private uiContainer!: PIXI.Container;
  private inputSystem!: InputSystem;
  private cameraSystem!: CameraSystem;
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
    this.world = new this.RAPIER.World(PHYSICS_CONFIG.GRAVITY);
  }

  private initializeSystems(): void {
    this.inputSystem = new InputSystem();
    this.cameraSystem = new CameraSystem(this.cameraContainer);
    this.timeSlowEffect = new TimeSlowEffect(this.uiContainer);
    
    // Set canvas for mouse input after PIXI is initialized
    setTimeout(() => {
      this.inputSystem.setCanvas(this.app.canvas as HTMLCanvasElement);
    }, 0);
  }

  private initializeEntities(): void {
    this.level = new Level(this.world, this.cameraContainer, this.RAPIER);
    this.player = new Player(this.world, this.cameraContainer, 100, 400, this.RAPIER);
    this.projectileManager = new ProjectileManager(this.world, this.cameraContainer, this.RAPIER);
    
    // Give player reference to projectile manager
    this.player.setProjectileManager(this.projectileManager);
  }

  private startGameLoop(): void {
    this.app.ticker.add(() => {
      const deltaTime = this.app.ticker.deltaMS / 1000;
      this.update(deltaTime);
    });
  }

  private update(deltaTime: number): void {
    const actions = this.inputSystem.getActions();
    
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
          this.inputSystem.setInitialAimMouseY();
        }
        
        // While aiming, continuously update angle based on mouse
        if (this.player.getState() === PlayerState.Aiming) {
          this.timeSlowEffect.startTimeSlow();
          
          // Update aim angle based on mouse movement relative to initial position
          const mouseDeltaY = this.inputSystem.getMouseYDeltaFromAimStart();
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
    
    // Physics always steps at fixed rate, game logic uses scaled time
    this.world.step();
    
    // Update projectiles first (including boomerang) so their positions are current
    // Projectiles should NOT be affected by time slow once thrown
    this.projectileManager.update(deltaTime);
    
    // Then update player - this way if player is riding boomerang, it follows the current position
    this.player.update(scaledDeltaTime);
    
    // Check for projectile collisions
    this.projectileManager.checkCollisions(this.player.getCollider());
    
    this.cameraSystem.setTarget(this.player.getPosition());
    this.cameraSystem.update(scaledDeltaTime);
  }
  

  public getCanvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }
  
  public getLevel(): Level {
    return this.level;
  }
  
  private handleCatchWhileRiding(): void {
    // Get the boomerang being ridden
    const ridingBoomerang = this.player['ridingBoomerang'];
    if (!ridingBoomerang) return;
    
    // Get boomerang's current velocity for momentum transfer
    const boomerangVel = ridingBoomerang.getCurrentVelocity();
    
    // Transfer the boomerang's momentum to the player
    // For straight line trajectories, add upward boost
    const launchVelocity: Vector2 = {
      x: boomerangVel.x,
      y: boomerangVel.y
    };
    
    // If Y velocity is near zero (straight line), add upward boost
    if (Math.abs(boomerangVel.y) < PHYSICS_VALUES.STRAIGHT_LINE_Y_THRESHOLD) {
      launchVelocity.y = PHYSICS_VALUES.STRAIGHT_LINE_DISMOUNT_BOOST;
    }
    
    // Dismount with momentum and catch the boomerang
    this.player.dismountBoomerang(launchVelocity);
    ridingBoomerang.catch();
    this.player.setHasBoomerang(true);
  }
}