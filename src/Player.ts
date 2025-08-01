import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, PlayerState, PlayerStateContext, BoomerangThrowParams, IBoomerang } from './types';
import { PLAYER_CONFIG, PHYSICS_CONFIG, BOOMERANG_CONFIG, COLLISION_GROUPS, PARRY_CONFIG, PHYSICS_VALUES, TRAJECTORY_CONFIG } from './constants';
import { PlayerStateMachine } from './entities/player/PlayerStateMachine';
import { moveTowards } from './utils/math.utils';
import { TrajectoryPreview } from './systems';
import { ProjectileManager } from './managers';

export class Player {
  private world: RapierWorld;
  private rigidBody!: RapierRigidBody;
  private collider!: RAPIER.Collider;
  private sprite!: PIXI.Graphics;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  
  private currentVelocityX = 0;
  private targetVelocityX = 0;
  private stateMachine: PlayerStateMachine;
  private hasBoomerang = true;
  private isGrounded = true;
  private isFacingRight = true;
  private groundRaycast: RAPIER.Ray;
  private leftWallRaycast: RAPIER.Ray;
  private rightWallRaycast: RAPIER.Ray;
  private previousState: PlayerState = PlayerState.Idle;
  private trajectoryPreview: TrajectoryPreview;
  private aimAngle: number = 180; // Default aim angle - straight ahead (degrees)
  private isAiming: boolean = false;
  private isTouchingWall: boolean = false;
  private currentColliderHeight: number = PLAYER_CONFIG.HEIGHT;
  private projectileManager: ProjectileManager | null = null;
  private parryWindowTime: number = 0;
  private isRidingBoomerang: boolean = false;
  private ridingBoomerang: IBoomerang | null = null;
  private frameCount: number = 0;
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
    this.stateMachine = new PlayerStateMachine();
    this.groundRaycast = new RapierModule.Ray(
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    );
    this.leftWallRaycast = new RapierModule.Ray(
      { x: 0, y: 0 },
      { x: -1, y: 0 }
    );
    this.rightWallRaycast = new RapierModule.Ray(
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    );
    this.trajectoryPreview = new TrajectoryPreview(container);
  }

  private createRigidBody(x: number, y: number): void {
    const rigidBodyDesc = this.RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y)
      .lockRotations();
    
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
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
    this.sprite.rect(
      -PLAYER_CONFIG.WIDTH / 2,
      -PLAYER_CONFIG.HEIGHT / 2,
      PLAYER_CONFIG.WIDTH,
      PLAYER_CONFIG.HEIGHT
    );
    this.sprite.fill(PLAYER_CONFIG.COLOR);
    
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
          y: boomerangPos.y - PHYSICS_VALUES.PLAYER_MOUNT_OFFSET
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
    this.updateWallDetection();
    this.updateFriction();
    this.updatePhysics(deltaTime);
    this.updateSprite();
    this.updateStateMachine(deltaTime);
  }

  private updatePhysics(deltaTime: number): void {
    const currentVel = this.rigidBody.linvel();
    let velocityY = currentVel.y;
    
    // Apply gravity multiplier when falling
    if (!this.isGrounded && velocityY > 0) {
      // Apply additional gravity when falling
      const additionalGravity = PHYSICS_CONFIG.GRAVITY.y * (PHYSICS_CONFIG.FALL_GRAVITY_MULTIPLIER - 1) * deltaTime;
      velocityY += additionalGravity;
    }
    
    // Cap fall speed to terminal velocity
    if (velocityY > PHYSICS_CONFIG.MAX_FALL_SPEED) {
      velocityY = PHYSICS_CONFIG.MAX_FALL_SPEED;
    }
    
    // Apply time-based acceleration towards target velocity
    const state = this.stateMachine.getCurrentState();
    if (state !== PlayerState.Sliding) {
      const accelerationTime = this.targetVelocityX === 0 
        ? PLAYER_CONFIG.DECELERATION_TIME 
        : PLAYER_CONFIG.ACCELERATION_TIME;
      
      const maxDelta = Math.abs(this.targetVelocityX - this.currentVelocityX) * (deltaTime / accelerationTime);
      this.currentVelocityX = moveTowards(this.currentVelocityX, this.targetVelocityX, maxDelta);
    }
    
    // Override horizontal velocity if deeply embedded in wall
    if (this.isTouchingWall && this.isGrounded) {
      const position = this.rigidBody.translation();
      
      // Only check for deep embedding when grounded
      const leftCheck = this.world.castRay(
        new this.RAPIER.Ray({ x: position.x, y: position.y }, { x: -1, y: 0 }),
        PLAYER_CONFIG.WIDTH / 2,
        true,
        undefined,
        undefined,
        this.collider
      );
      
      const rightCheck = this.world.castRay(
        new this.RAPIER.Ray({ x: position.x, y: position.y }, { x: 1, y: 0 }),
        PLAYER_CONFIG.WIDTH / 2,
        true,
        undefined,
        undefined,
        this.collider
      );
      
      // Only push out if significantly embedded
      if (leftCheck && leftCheck.toi < PLAYER_CONFIG.WIDTH / 2 - PHYSICS_VALUES.WALL_EMBED_THRESHOLD) {
        // Deeply embedded in left wall - force push right
        this.currentVelocityX = Math.max(this.currentVelocityX, PLAYER_CONFIG.WALL_SEPARATION_FORCE);
      } else if (rightCheck && rightCheck.toi < PLAYER_CONFIG.WIDTH / 2 - PHYSICS_VALUES.WALL_EMBED_THRESHOLD) {
        // Deeply embedded in right wall - force push left
        this.currentVelocityX = Math.min(this.currentVelocityX, -PLAYER_CONFIG.WALL_SEPARATION_FORCE);
      }
    }
    
    this.rigidBody.setLinvel({
      x: this.currentVelocityX,
      y: velocityY
    }, true);
  }

  private updateSprite(): void {
    const position = this.rigidBody.translation();
    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  private updateGroundedState(): void {
    const position = this.rigidBody.translation();
    const state = this.stateMachine.getCurrentState();
    const isCrouched = state === PlayerState.Crouching || state === PlayerState.Sliding;
    const currentHeight = isCrouched ? PLAYER_CONFIG.CROUCH_HEIGHT : PLAYER_CONFIG.HEIGHT;
    
    // Cast ray downward from bottom center of player
    this.groundRaycast.origin = { 
      x: position.x, 
      y: position.y + currentHeight / 2 - 1 // Start just inside the player
    };
    this.groundRaycast.dir = { x: 0, y: 1 };
    
    // Cast the ray slightly beyond the player's bottom
    const maxToi = PLAYER_CONFIG.GROUND_CHECK_DISTANCE + 1;
    const solid = true; // Stop at first hit
    const hit = this.world.castRay(
      this.groundRaycast, 
      maxToi,
      solid,
      undefined,
      undefined,
      this.collider // Exclude self
    );
    
    // Consider grounded if ray hits something very close to the player's bottom
    this.isGrounded = hit !== null && hit.toi <= PLAYER_CONFIG.GROUND_CHECK_DISTANCE;
  }
  
  private updateWallDetection(): void {
    const position = this.rigidBody.translation();
    const currentVel = this.rigidBody.linvel();
    const state = this.stateMachine.getCurrentState();
    const currentHeight = (state === PlayerState.Crouching || state === PlayerState.Sliding) 
      ? PLAYER_CONFIG.CROUCH_HEIGHT 
      : PLAYER_CONFIG.HEIGHT;
    
    // Multiple rays for better detection (top, middle, bottom of player)
    const rayOffsets = [
      -currentHeight / 2 + 2,  // Near top
      0,                       // Center
      currentHeight / 2 - 2    // Near bottom
    ];
    
    let touchingLeft = false;
    let touchingRight = false;
    const wallCheckDistance = PLAYER_CONFIG.WIDTH / 2 + PHYSICS_VALUES.WALL_CHECK_DISTANCE;
    const wallThreshold = PLAYER_CONFIG.WIDTH / 2 + 0.5;
    
    // Check multiple points along player height
    for (const yOffset of rayOffsets) {
      // Left wall check
      this.leftWallRaycast.origin = { 
        x: position.x,
        y: position.y + yOffset 
      };
      
      const leftHit = this.world.castRay(
        this.leftWallRaycast,
        wallCheckDistance,
        true,
        undefined,
        undefined,
        this.collider
      );
      
      if (leftHit && leftHit.toi <= wallThreshold) {
        touchingLeft = true;
      }
      
      // Right wall check
      this.rightWallRaycast.origin = { 
        x: position.x,
        y: position.y + yOffset 
      };
      
      const rightHit = this.world.castRay(
        this.rightWallRaycast,
        wallCheckDistance,
        true,
        undefined,
        undefined,
        this.collider
      );
      
      if (rightHit && rightHit.toi <= wallThreshold) {
        touchingRight = true;
      }
    }
    
    this.isTouchingWall = touchingLeft || touchingRight;
    
    // Enhanced wall repulsion system
    if (this.isTouchingWall) {
      const separationForce = PLAYER_CONFIG.WALL_SEPARATION_FORCE;
      const slideReduction = PLAYER_CONFIG.WALL_SLIDE_DAMPING;
      
      // Only apply wall forces when grounded or moving very slowly vertically
      // This prevents sticking when falling past platforms
      const isEffectivelyGrounded = this.isGrounded || Math.abs(currentVel.y) < PHYSICS_VALUES.AIRBORNE_VELOCITY_THRESHOLD;
      
      if (touchingLeft) {
        if (currentVel.x < 0) {
          if (isEffectivelyGrounded) {
            // On ground - stop horizontal movement and push away
            this.rigidBody.setLinvel({ x: separationForce, y: currentVel.y }, true);
            this.currentVelocityX = 0;
            this.targetVelocityX = 0;
          } else {
            // In air - just nullify horizontal velocity, let gravity work
            this.rigidBody.setLinvel({ x: 0, y: currentVel.y }, true);
            this.currentVelocityX = 0;
            // Don't reset target velocity - allow player to keep trying to move
          }
        }
      } else if (touchingRight) {
        if (currentVel.x > 0) {
          if (isEffectivelyGrounded) {
            // On ground - stop horizontal movement and push away
            this.rigidBody.setLinvel({ x: -separationForce, y: currentVel.y }, true);
            this.currentVelocityX = 0;
            this.targetVelocityX = 0;
          } else {
            // In air - just nullify horizontal velocity, let gravity work
            this.rigidBody.setLinvel({ x: 0, y: currentVel.y }, true);
            this.currentVelocityX = 0;
            // Don't reset target velocity - allow player to keep trying to move
          }
        }
      }
      
      // Only apply wall slide damping when actually sliding down a wall (not just touching)
      if (!this.isGrounded && currentVel.y > 100 && Math.abs(currentVel.x) < PHYSICS_VALUES.WALL_SLIDE_VELOCITY_THRESHOLD) {
        this.rigidBody.setLinvel({ 
          x: currentVel.x, 
          y: currentVel.y * slideReduction 
        }, true);
      }
    }
  }
  
  private updateFriction(): void {
    // Set friction to 0 when airborne or touching walls to prevent sticking
    // Set normal friction when grounded for proper movement control
    const targetFriction = (this.isGrounded && !this.isTouchingWall) ? PLAYER_CONFIG.FRICTION : 0.0;
    
    // Update the collider's friction
    this.collider.setFriction(targetFriction);
  }
  
  private updateStateMachine(deltaTime: number): void {
    const velocity = this.rigidBody.linvel();
    const context: PlayerStateContext = {
      hasBoomerang: this.hasBoomerang,
      isGrounded: this.isGrounded,
      velocity: { x: this.currentVelocityX, y: velocity.y },
      isFacingRight: this.isFacingRight,
      timeSinceStateChange: this.stateMachine.getTimeInCurrentState()
    };
    
    
    this.stateMachine.update(deltaTime, context);
    this.handleStateSpecificBehavior(deltaTime);
  }
  
  private handleStateSpecificBehavior(deltaTime: number): void {
    const currentState = this.stateMachine.getCurrentState();
    const previousState = this.previousState;
    
    // Handle state entry logic
    if (currentState !== previousState) {
      // Entering airborne state from crouching/sliding - restore normal size
      if (currentState === PlayerState.Airborne && 
          (previousState === PlayerState.Sliding || previousState === PlayerState.Crouching)) {
        this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
      }
      
      // Update collision groups based on state by calling updateColliderSize
      // This ensures collision groups are always in sync with the current state
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
          this.trajectoryPreview.hide();
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
        this.stateMachine.requestStopBlocking();
      }
    }
    
    // Update sprite color based on state for visual feedback
    let color: number = PLAYER_CONFIG.COLOR;
    switch (currentState) {
      case PlayerState.Idle:
        color = 0xff6b6b; // Red
        break;
      case PlayerState.Moving:
        color = 0x00ff00; // Bright Green
        break;
      case PlayerState.Crouching:
        color = 0x6b6bff; // Blue
        break;
      case PlayerState.Sliding:
        color = 0x6bffff; // Cyan
        // Apply slide deceleration
        if (this.currentVelocityX > 0) {
          this.currentVelocityX = Math.max(
            0,
            this.currentVelocityX - PLAYER_CONFIG.SLIDE_DECELERATION * deltaTime
          );
        } else if (this.currentVelocityX < 0) {
          this.currentVelocityX = Math.min(
            0,
            this.currentVelocityX + PLAYER_CONFIG.SLIDE_DECELERATION * deltaTime
          );
        }
        break;
      case PlayerState.Blocking:
        // Flash between yellow and white during parry window
        color = this.parryWindowTime > 0 ? 0xffffff : 0xffff6b; // White during parry, yellow after
        break;
      case PlayerState.Airborne:
        color = 0xff6bff; // Magenta
        break;
      case PlayerState.Aiming:
        color = 0xffaa00; // Orange
        break;
    }
    
    // Update sprite color if changed
    if (this.sprite.tint !== color) {
      this.sprite.tint = color;
    }
  }

  public moveLeft(_deltaTime: number): void {
    const state = this.stateMachine.getCurrentState();
    
    // Exit blocking if trying to move
    if (state === PlayerState.Blocking) {
      this.stateMachine.requestStopBlocking();
    }
    
    if (state === PlayerState.Idle || state === PlayerState.Moving) {
      this.isFacingRight = false;
      this.targetVelocityX = -PLAYER_CONFIG.MOVE_SPEED;
    } else if (state === PlayerState.Crouching) {
      // Allow movement while crouched at half speed
      this.isFacingRight = false;
      this.targetVelocityX = -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    } else if (state === PlayerState.Airborne) {
      // Air time - limited control using crouch speed
      this.isFacingRight = false;
      this.targetVelocityX = -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    }
  }

  public moveRight(_deltaTime: number): void {
    const state = this.stateMachine.getCurrentState();
    
    // Exit blocking if trying to move
    if (state === PlayerState.Blocking) {
      this.stateMachine.requestStopBlocking();
    }
    
    if (state === PlayerState.Idle || state === PlayerState.Moving) {
      this.isFacingRight = true;
      this.targetVelocityX = PLAYER_CONFIG.MOVE_SPEED;
    } else if (state === PlayerState.Crouching) {
      // Allow movement while crouched at half speed
      this.isFacingRight = true;
      this.targetVelocityX = PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    } else if (state === PlayerState.Airborne) {
      // Air time - limited control using crouch speed
      this.isFacingRight = true;
      this.targetVelocityX = PLAYER_CONFIG.CROUCH_MOVE_SPEED;
    }
  }

  public stopMoving(_deltaTime: number): void {
    const state = this.stateMachine.getCurrentState();
    if (state === PlayerState.Idle || state === PlayerState.Moving || 
        state === PlayerState.Crouching || state === PlayerState.Airborne) {
      this.targetVelocityX = 0;
    }
  }
  
  public crouch(): void {
    // Cannot crouch or slide during air time
    if (!this.isGrounded) return;
    
    const state = this.stateMachine.getCurrentState();
    // Check if we should slide (moving at near-max speed)
    if (state === PlayerState.Moving && Math.abs(this.currentVelocityX) >= PLAYER_CONFIG.MOVE_SPEED * 0.9) {
      // Transition to sliding with speed boost
      this.stateMachine.requestSlide({ x: this.currentVelocityX });
      this.currentVelocityX = this.isFacingRight ? PLAYER_CONFIG.SLIDE_SPEED : -PLAYER_CONFIG.SLIDE_SPEED;
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.CROUCH_HEIGHT);
    } else if (state === PlayerState.Idle || state === PlayerState.Moving) {
      // Regular crouch - adjust target velocity to crouch speed
      this.stateMachine.requestCrouch();
      if (Math.abs(this.targetVelocityX) > PLAYER_CONFIG.CROUCH_MOVE_SPEED) {
        this.targetVelocityX = this.targetVelocityX > 0 
          ? PLAYER_CONFIG.CROUCH_MOVE_SPEED 
          : -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
      }
      // Also clamp current velocity to prevent sliding while crouching
      if (Math.abs(this.currentVelocityX) > PLAYER_CONFIG.CROUCH_MOVE_SPEED) {
        this.currentVelocityX = this.currentVelocityX > 0 
          ? PLAYER_CONFIG.CROUCH_MOVE_SPEED 
          : -PLAYER_CONFIG.CROUCH_MOVE_SPEED;
      }
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.CROUCH_HEIGHT);
    }
    // If already crouching or sliding, do nothing
  }
  
  public stand(): void {
    const state = this.stateMachine.getCurrentState();
    if (state === PlayerState.Crouching) {
      this.stateMachine.requestStand();
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    } else if (state === PlayerState.Sliding) {
      // Exit sliding state when crouch key is released
      this.stateMachine.requestStopSliding();
      this.updateColliderSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
    }
  }
  
  public startBlocking(): void {
    this.stateMachine.requestBlock(this.hasBoomerang);
  }
  
  public stopBlocking(): void {
    this.stateMachine.requestStopBlocking();
  }
  
  private updateColliderSize(width: number, height: number): void {
    // Check if we need to update collision groups even if size hasn't changed
    const currentState = this.stateMachine.getCurrentState();
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
    return this.stateMachine.getCurrentState();
  }
  
  public setHasBoomerang(value: boolean): void {
    this.hasBoomerang = value;
    if (value) {
      // Set cooldown when catching boomerang to prevent immediate re-throw
      this.catchCooldown = PHYSICS_VALUES.CATCH_COOLDOWN;
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
    
    if (this.hasBoomerang && this.stateMachine.getCurrentState() !== PlayerState.Aiming) {
      const currentState = this.stateMachine.getCurrentState();
      
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
      
      this.stateMachine.requestAiming();
      this.trajectoryPreview.show();
      this.updateTrajectoryPreview();
    }
  }
  
  public stopAiming(): void {
    if (this.isAiming) {
      this.isAiming = false;
      this.trajectoryPreview.hide();
      
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
      
      // Throw boomerang through ProjectileManager
      if (this.projectileManager && this.hasBoomerang) {
        this.projectileManager.spawnBoomerang(this, throwParams);
        // Mark that we no longer have the boomerang
        this.hasBoomerang = false;
      }
      
      this.stateMachine.requestStopAiming();
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
    this.trajectoryPreview.updateTrajectory(
      throwPosition,
      this.aimAngle,
      this.isFacingRight
    );
  }
  
  public setProjectileManager(manager: ProjectileManager): void {
    this.projectileManager = manager;
  }
  
  public isInParryWindow(): boolean {
    return this.stateMachine.getCurrentState() === PlayerState.Blocking && this.parryWindowTime > 0;
  }
  
  public mountBoomerang(boomerang: IBoomerang): void {
    if (this.isRidingBoomerang) return;
    
    this.isRidingBoomerang = true;
    this.ridingBoomerang = boomerang;
    
    // Force airborne state by making us not grounded
    this.isGrounded = false;
    
    // Stop blocking state
    this.stateMachine.requestStopBlocking();
    
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
      this.trajectoryPreview.hide();
      this.stateMachine.requestStopAiming();
    }
    
    // Apply launch velocity if provided
    if (launchVelocity) {
      this.currentVelocityX = launchVelocity.x;
      this.targetVelocityX = launchVelocity.x;
      const currentVel = this.rigidBody.linvel();
      this.rigidBody.setLinvel({ x: launchVelocity.x, y: launchVelocity.y || currentVel.y }, true);
    }
    
  }
  
  public getIsRiding(): boolean {
    return this.isRidingBoomerang;
  }
}