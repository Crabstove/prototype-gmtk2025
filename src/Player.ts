import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, PlayerState, BoomerangThrowParams, IBoomerang } from './types';
import { PLAYER_CONFIG, PHYSICS, BOOMERANG_CONFIG, COLLISION_GROUPS, PARRY_CONFIG, TRAJECTORY_CONFIG } from './constants/game.constants';
import { drawBoomerangTrajectory } from './drawTrajectory';

export class Player {
  private world: RapierWorld;
  private rigidBody!: RapierRigidBody;
  private collider!: RAPIER.Collider;
  private sprite!: PIXI.Graphics;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  
  // Custom physics system (Celeste-style)
  private velocity: Vector2 = { x: 0, y: 0 };
  private slideInitiated = false; // Track if we just started sliding
  
  private currentVelocityX = 0;
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
    this.createSprite();
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
      .setCollisionGroups(
        // The format is: membership << 16 | filter
        (COLLISION_GROUPS.PLAYER_STANDING << 16) | 
        (COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.BOOMERANG | COLLISION_GROUPS.ENEMY)
      );
    
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    
    // Set collision groups to prevent unwanted interactions
    this.collider.setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
  }

  private createSprite(): void {
    this.sprite = new PIXI.Graphics();
    this.sprite.wiggle = 2;
    this.sprite.maxSegmentLength = 10;
    this.sprite.rect(
      -PLAYER_CONFIG.WIDTH / 2,
      -PLAYER_CONFIG.HEIGHT / 2,
      PLAYER_CONFIG.WIDTH,
      PLAYER_CONFIG.HEIGHT
    );
    this.sprite.stroke({color: PLAYER_CONFIG.COLOR, width: 3});
    
    this.container.addChild(this.sprite);
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
        
        // Update sprite manually since we're skipping normal physics
        const position = this.rigidBody.translation();
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        
        // Update state machine
        this.updateStateMachine(deltaTime);
        return;
      }
    }
    
    this.updateGroundedState();
    this.updateFriction();
    this.updatePhysics(deltaTime);
    this.updateSprite();
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
          // Keep some momentum when transitioning to crouch
          this.velocity.x = this.velocity.x > 0 ? PLAYER_CONFIG.CROUCH_MOVE_SPEED : -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
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
    
    // Update legacy velocity tracking (for compatibility)
    this.currentVelocityX = this.velocity.x;
  }

  private updateSprite(): void {
    const position = this.rigidBody.translation();
    this.sprite.x = position.x;
    this.sprite.y = position.y;
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
        this.velocity.y = 10; // Small downward push
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
  
  private updateStateTransitions(velocityY: number, deltaTime: number): void {
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
      this.currentState = Math.abs(this.currentVelocityX) > PLAYER_CONFIG.VELOCITY_THRESHOLD 
        ? PlayerState.Moving 
        : PlayerState.Idle;
    } else if (this.currentState === PlayerState.Idle && Math.abs(this.currentVelocityX) > PLAYER_CONFIG.VELOCITY_THRESHOLD) {
      this.currentState = PlayerState.Moving;
    } else if (this.currentState === PlayerState.Moving && Math.abs(this.currentVelocityX) <= PLAYER_CONFIG.VELOCITY_THRESHOLD) {
      this.currentState = PlayerState.Idle;
    }
  }
  
  private getGroundedState(): PlayerState {
    return this.isGrounded ? PlayerState.Idle : PlayerState.Airborne;
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
    
    // Keep sprite a consistent color (or you could use a sprite image here)
    this.sprite.tint = PLAYER_CONFIG.COLOR;
  }

  private move(direction: number, _deltaTime: number): void {
    const state = this.currentState;
    
    // Exit blocking if trying to move
    if (state === PlayerState.Blocking) {
      this.currentState = this.getGroundedState();
    }
    
    this.isFacingRight = direction > 0;
    
    if (state === PlayerState.Idle || state === PlayerState.Moving || state === PlayerState.Airborne) {
      this.targetVelocityX = direction * PLAYER_CONFIG.MOVE_SPEED;
    } else if (state === PlayerState.Crouching) {
      this.targetVelocityX = direction * PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    }
  }

  public moveLeft(deltaTime: number): void {
    this.move(-1, deltaTime);
  }

  public moveRight(deltaTime: number): void {
    this.move(1, deltaTime);
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
      this.currentState = PlayerState.Crouching;
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    }
  }
  
  public startBlocking(): void {
    if (!this.hasBoomerang) {
      this.currentState = PlayerState.Blocking;
      this.parryWindowTime = PARRY_CONFIG.WINDOW_DURATION;
    }
  }
  
  public stopBlocking(): void {
    if (this.currentState === PlayerState.Blocking) {
      this.currentState = this.getGroundedState();
    }
  }
  
  private updateColliderSize(width: number, height: number): void {
    // Check if we need to update collision groups even if size hasn't changed
    const currentState = this.currentState;
    const needsCrouchingGroups = (currentState === PlayerState.Crouching || currentState === PlayerState.Sliding);
    const isCrouching = height <= PLAYER_CONFIG.CROUCH_HEIGHT;
    
    // If height hasn't changed but collision groups need updating
    if (height === this.currentColliderHeight) {
      // Just update collision groups without recreating collider
      const membership = needsCrouchingGroups ? COLLISION_GROUPS.PLAYER_CROUCHING : COLLISION_GROUPS.PLAYER_STANDING;
      const filter = needsCrouchingGroups 
        ? COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.ENEMY  // No BOOMERANG
        : COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.BOOMERANG | COLLISION_GROUPS.ENEMY;
      this.collider.setCollisionGroups((membership << 16) | filter);
      return;
    }
    
    // Store current position and velocity
    const position = this.rigidBody.translation();
    const velocity = this.rigidBody.linvel();
    
    // Note: isCrouching is already declared above
    
    // Remove old collider
    this.world.removeCollider(this.collider, false);
    
    // Create new collider with updated size (centered on rigid body)
    const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
      width / 2,
      height / 2
    )
      .setRestitution(PLAYER_CONFIG.RESTITUTION)
      .setFriction(PLAYER_CONFIG.FRICTION)
      .setCollisionGroups(
        // The format is: membership << 16 | filter
        ((isCrouching ? COLLISION_GROUPS.PLAYER_CROUCHING : COLLISION_GROUPS.PLAYER_STANDING) << 16) |
        (isCrouching 
          ? COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.ENEMY  // No BOOMERANG
          : COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.BOOMERANG | COLLISION_GROUPS.ENEMY)
      );
    
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
    this.sprite.rect(
      -width / 2,
      -height / 2,
      width,
      height
    );
    this.sprite.fill(PLAYER_CONFIG.COLOR);
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
  
  public getIsGrounded(): boolean {
    return this.isGrounded;
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
      this.currentVelocityX = 0;
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
    this.currentVelocityX = 0;
    
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

}