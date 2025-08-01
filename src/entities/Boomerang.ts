import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, BoomerangState, BoomerangThrowParams, PlayerState, IBoomerang } from '../types';
import { BOOMERANG_CONFIG, COLLISION_GROUPS, TRAJECTORY_CONFIG, PHYSICS_VALUES } from '../constants';
import { Player } from '../Player';

export class Boomerang implements IBoomerang {
  private world: RapierWorld;
  private rigidBody!: RapierRigidBody;
  private collider!: RAPIER.Collider;
  private sprite: PIXI.Graphics | null = null;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  private owner: Player | null = null;
  
  // State tracking
  private state: BoomerangState = BoomerangState.Caught;
  private distanceTraveled: number = 0;
  private hangTimeRemaining: number = 0;
  private currentVelocity: Vector2 = { x: 0, y: 0 };
  private targetVelocity: Vector2 = { x: 0, y: 0 };
  private accelerationTime: number = 0;
  private frameCount: number = 0;
  private gracePeriodTime: number = 0;
  
  // Trajectory type (straight line vs parabolic)
  private isStraightLine: boolean = false;
  
  // Throw parameters for exact trajectory following
  private throwOrigin: Vector2 | null = null;
  private throwAngle: number = 180;
  private throwDirection: number = 1; // 1 for right, -1 for left
  private isReturningToOrigin: boolean = false; // Track if we're on the return leg
  
  // Collision callback
  private onPlayerCollision?: () => void;
  
  // Track if player is riding
  private hasRider: boolean = false;
  
  constructor(
    world: RapierWorld,
    container: PIXI.Container,
    RapierModule: typeof RAPIER
  ) {
    this.world = world;
    this.container = container;
    this.RAPIER = RapierModule;
    
    // Create sprite once and reuse it
    this.createSprite();
  }
  
  private createRigidBody(x: number, y: number): void {
    // Clean up any existing physics bodies first
    this.cleanupPhysics();
    
    // Create kinematic rigid body (we control its movement)
    const rigidBodyDesc = this.RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(x, y);
    
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
    // Set initial position immediately
    this.rigidBody.setTranslation({ x, y }, true);
    
    // Create sensor collider (doesn't physically interact, just detects collisions)
    const colliderDesc = this.RAPIER.ColliderDesc.ball(5.5) // ~16/3, matches smaller sprite
      .setSensor(true)
      .setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(
        // The format is: membership << 16 | filter
        (COLLISION_GROUPS.BOOMERANG << 16) |
        (COLLISION_GROUPS.PLAYER_STANDING | COLLISION_GROUPS.ENVIRONMENT)
      );
    
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    
  }
  
  private createSprite(): void {
    if (this.sprite) return; // Don't recreate if it already exists
    
    this.sprite = new PIXI.Graphics();
    
    // Draw L-shaped boomerang (3x smaller than before)
    const size = 11; // ~32/3
    const thickness = 3;
    
    // Draw the L shape
    this.sprite.moveTo(-size/2, -size/2);
    this.sprite.lineTo(-size/2 + thickness, -size/2);
    this.sprite.lineTo(-size/2 + thickness, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2);
    this.sprite.lineTo(-size/2, size/2);
    this.sprite.closePath();
    
    this.sprite.fill(0xff00ff); // Magenta
    this.sprite.visible = false; // Hidden until thrown
    this.container.addChild(this.sprite);
  }
  public throw(params: BoomerangThrowParams): void {
    if (this.state !== BoomerangState.Caught) {
      return; // Can't throw if not caught
    }
    
    // Create rigid body at throw position
    this.createRigidBody(params.origin.x, params.origin.y);
    
    // Store throw parameters
    this.throwOrigin = { ...params.origin };
    this.throwAngle = params.angle;
    this.throwDirection = params.facingRight ? 1 : -1;
    
    // Determine if straight line
    this.isStraightLine = params.angle >= TRAJECTORY_CONFIG.STRAIGHT_LINE_THRESHOLD;
    
    // Set velocity for movement direction (mainly for rotation effect)
    this.targetVelocity = {
      x: BOOMERANG_CONFIG.THROW_SPEED * this.throwDirection,
      y: 0
    };
    
    // Start with zero velocity for acceleration
    this.currentVelocity = { x: 0, y: 0 };
    this.accelerationTime = 0;
    
    // Reset tracking
    this.distanceTraveled = 0;
    this.hangTimeRemaining = 0;
    this.frameCount = 0;
    this.gracePeriodTime = BOOMERANG_CONFIG.GRACE_PERIOD;
    this.isReturningToOrigin = false;
    
    // Update state
    this.state = BoomerangState.Throwing;
    
    // Update sprite position and make it visible
    if (this.sprite) {
      this.sprite.x = params.origin.x;
      this.sprite.y = params.origin.y;
      this.sprite.visible = true;
    }
  }
  
  public update(deltaTime: number): void {
    if (this.state === BoomerangState.Caught) {
      return;
    }
    
    this.frameCount++;
    
    if (!this.rigidBody) {
      return;
    }
    
    // Update grace period
    if (this.gracePeriodTime > 0) {
      this.gracePeriodTime -= deltaTime;
    }
    
    switch (this.state) {
      case BoomerangState.Throwing:
        this.updateThrowing(deltaTime);
        break;
        
      case BoomerangState.Hanging:
        this.updateHanging(deltaTime);
        break;
        
      case BoomerangState.Returning:
        this.updateReturning(deltaTime);
        break;
    }
    
    
    // Update sprite position - get fresh position after physics update
    if (this.rigidBody && this.sprite && this.sprite.visible) {
      const updatedPosition = this.rigidBody.translation();
      this.sprite.x = updatedPosition.x;
      this.sprite.y = updatedPosition.y;
      
      // Rotate sprite based on movement
      if (Math.abs(this.currentVelocity.x) > 0.1 || Math.abs(this.currentVelocity.y) > 0.1) {
        this.sprite.rotation += deltaTime * 10; // Spin effect
      }
    }
    
  }
  
  private updateThrowing(deltaTime: number): void {
    const position = this.rigidBody.translation();
    // Track distance traveled (based on horizontal movement)
    const deltaDistance = Math.abs(this.targetVelocity.x * deltaTime);
    this.distanceTraveled += deltaDistance;
    
    // Calculate progress along trajectory (0 to 1)
    const t = Math.min(1, this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE);
    
    // Get throw origin
    const throwOrigin = this.throwOrigin;
    if (!throwOrigin) {
      // Fallback to velocity-based movement
      this.currentVelocity = { ...this.targetVelocity };
      const newPosition = {
        x: position.x + this.currentVelocity.x * deltaTime,
        y: position.y + this.currentVelocity.y * deltaTime
      };
      this.rigidBody.setTranslation(newPosition, true);
      
      if (this.distanceTraveled >= BOOMERANG_CONFIG.THROW_DISTANCE) {
        this.enterHangState();
      }
      return;
    }
    
    // Calculate position along the exact preview trajectory
    let newPosition: Vector2;
    
    if (this.isStraightLine) {
      // Straight horizontal line
      newPosition = {
        x: throwOrigin.x + (this.distanceTraveled * this.throwDirection),
        y: throwOrigin.y
      };
    } else {
      // Parabolic trajectory - match TrajectoryPreview exactly
      const angleDegrees = this.throwAngle || 180;
      const heightMultiplier = (180 - angleDegrees) / TRAJECTORY_CONFIG.ANGLE_RANGE;
      const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * TRAJECTORY_CONFIG.HEIGHT_MULTIPLIER * heightMultiplier;
      
      // Horizontal position (linear)
      newPosition = {
        x: throwOrigin.x + (this.distanceTraveled * this.throwDirection),
        // Vertical position - quadratic curve that starts at origin and curves up
        y: throwOrigin.y - (peakHeight * t * t) // Subtract because up is negative
      };
    }
    
    this.rigidBody.setTranslation(newPosition, true);
    
    // Update velocity for visual rotation and physics
    const deltaX = newPosition.x - position.x;
    const deltaY = newPosition.y - position.y;
    
    if (Math.abs(deltaX) > PHYSICS_VALUES.VELOCITY_EPSILON || Math.abs(deltaY) > PHYSICS_VALUES.VELOCITY_EPSILON) {
      this.currentVelocity = {
        x: deltaX / deltaTime,
        y: deltaY / deltaTime
      };
    }
    
    // Check if reached max distance
    if (this.distanceTraveled >= BOOMERANG_CONFIG.THROW_DISTANCE) {
      this.enterHangState();
    }
  }
  
  private updateHanging(deltaTime: number): void {
    // If player is riding, skip hang time and immediately transition
    if (this.hasRider) {
      // Reset for next phase
      this.distanceTraveled = 0;
      this.accelerationTime = 0;
      
      if (!this.isReturningToOrigin) {
        // Just finished throwing phase, now return
        this.state = BoomerangState.Returning;
        this.isReturningToOrigin = true;
      } else {
        // Just finished returning phase, now throw again in opposite direction
        this.state = BoomerangState.Throwing;
        this.isReturningToOrigin = false;
        
        // Update the origin for the next U-shape
        const currentPos = this.rigidBody.translation();
        this.throwOrigin = { x: currentPos.x, y: currentPos.y };
        
        // Reverse direction for the next throw
        this.throwDirection = -this.throwDirection;
        this.targetVelocity.x = -this.targetVelocity.x;
      }
      return;
    }
    
    // Normal hang behavior when no rider
    this.hangTimeRemaining -= deltaTime;
    
    if (this.hangTimeRemaining <= 0) {
      // Reset for next phase
      this.distanceTraveled = 0;
      this.accelerationTime = 0;
      
      if (!this.isReturningToOrigin) {
        // Just finished throwing phase, now return
        this.state = BoomerangState.Returning;
        this.isReturningToOrigin = true;
      } else {
        // Just finished returning phase, now throw again in opposite direction
        this.state = BoomerangState.Throwing;
        this.isReturningToOrigin = false;
        
        // Update the origin for the next U-shape
        const currentPos = this.rigidBody.translation();
        this.throwOrigin = { x: currentPos.x, y: currentPos.y };
        
        // Reverse direction for the next throw
        this.throwDirection = -this.throwDirection;
        this.targetVelocity.x = -this.targetVelocity.x;
      }
    }
  }
  
  private updateReturning(deltaTime: number): void {
    const position = this.rigidBody.translation();
    // Continue moving back along the U-shaped path
    // Track distance traveled on return journey
    const deltaDistance = Math.abs(this.targetVelocity.x * deltaTime);
    this.distanceTraveled += deltaDistance;
    
    
    
    
    
    // Check if we should complete the return journey BEFORE calculating position
    if (this.distanceTraveled >= BOOMERANG_CONFIG.THROW_DISTANCE) {
      // Enter hang state at the return point
      this.enterHangState();
      return;
    }
    
    // Calculate progress along return trajectory (0 to 1)
    // distanceTraveled was reset to 0 when entering return state
    const t = Math.min(1, this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE);
    
    // Get throw origin and current direction
    const throwOrigin = this.throwOrigin;
    if (!throwOrigin) {
      // Fallback
      const newPosition = {
        x: position.x + this.currentVelocity.x * deltaTime,
        y: position.y + this.currentVelocity.y * deltaTime
      };
      this.rigidBody.setTranslation(newPosition, true);
      return;
    }
    
    // Calculate position along the return trajectory (second half of U)
    let newPosition: Vector2;
    
    if (this.isStraightLine) {
      // Straight horizontal line back
      // Moving back towards origin
      const returnX = throwOrigin.x + BOOMERANG_CONFIG.THROW_DISTANCE * this.throwDirection - (this.distanceTraveled * this.throwDirection);
      newPosition = {
        x: returnX,
        y: throwOrigin.y
      };
    } else {
      // Parabolic return trajectory - mirror of throw trajectory
      const angleDegrees = this.throwAngle || 180;
      const heightMultiplier = (180 - angleDegrees) / TRAJECTORY_CONFIG.ANGLE_RANGE;
      const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * TRAJECTORY_CONFIG.HEIGHT_MULTIPLIER * heightMultiplier;
      
      // For return path: we're going from the far end back towards origin
      const endX = throwOrigin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * this.throwDirection);
      const returnX = endX - (this.distanceTraveled * this.throwDirection);
      
      // Calculate Y based on the U-shape curve (same quadratic, but reversed)
      const returnT = 1 - t; // Reverse the progress for return journey
      const returnY = throwOrigin.y - (peakHeight * returnT * returnT); // Same curve shape
      
      newPosition = {
        x: returnX,
        y: returnY
      };
      
      
      
      
    }
    
    // Set the new position
    this.rigidBody.setTranslation(newPosition, true);
    
    
    
    // Update velocity for visual rotation and physics
    const deltaX = newPosition.x - position.x;
    const deltaY = newPosition.y - position.y;
    
    if (Math.abs(deltaX) > PHYSICS_VALUES.VELOCITY_EPSILON || Math.abs(deltaY) > PHYSICS_VALUES.VELOCITY_EPSILON) {
      this.currentVelocity = {
        x: deltaX / deltaTime,
        y: deltaY / deltaTime
      };
    }
    
    
    // Check if close to owner for catching
    if (this.owner) {
      const ownerPos = this.owner.getPosition();
      const dx = ownerPos.x - newPosition.x;
      const dy = ownerPos.y - newPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < PHYSICS_VALUES.CATCH_DISTANCE) {
        this.handlePlayerCollision();
        return;
      }
    }
  }
  
  private enterHangState(): void {
    this.state = BoomerangState.Hanging;
    this.hangTimeRemaining = BOOMERANG_CONFIG.HANG_TIME;
    this.currentVelocity = { x: 0, y: 0 };
  }
  
  public checkWallCollision(): void {
    // Called by Game when boomerang hits a wall
    if (this.state === BoomerangState.Throwing || this.state === BoomerangState.Returning) {
      this.enterHangState();
    }
  }
  
  public catch(): void {
    if (this.state !== BoomerangState.Caught) {
      this.state = BoomerangState.Caught;
      this.hasRider = false;
      if (this.sprite) {
        this.sprite.visible = false;
      }
      this.cleanupPhysics();
    }
  }
  
  private cleanupPhysics(): void {
    try {
      if (this.collider && this.world.getCollider(this.collider.handle)) {
        this.world.removeCollider(this.collider, false);
      }
    } catch (e) {
      // Collider already removed
    }
    this.collider = null!;
    
    try {
      if (this.rigidBody && this.world.getRigidBody(this.rigidBody.handle)) {
        this.world.removeRigidBody(this.rigidBody);
      }
    } catch (e) {
      // Rigid body already removed  
    }
    this.rigidBody = null!;
  }
  
  public getState(): BoomerangState {
    return this.state;
  }
  
  public getPosition(): Vector2 | null {
    if (this.state === BoomerangState.Caught || !this.rigidBody) {
      return null;
    }
    const pos = this.rigidBody.translation();
    return { x: pos.x, y: pos.y };
  }
  
  public getCollider(): RAPIER.Collider | null {
    return this.state !== BoomerangState.Caught ? this.collider : null;
  }
  
  public getCurrentVelocity(): Vector2 {
    return { ...this.currentVelocity };
  }
  
  public getTargetVelocity(): Vector2 {
    return { ...this.targetVelocity };
  }
  
  public getDistanceTraveled(): number {
    return this.distanceTraveled;
  }
  
  public getIsStraightLine(): boolean {
    return this.isStraightLine;
  }
  
  public setOnPlayerCollision(callback: () => void): void {
    this.onPlayerCollision = callback;
  }
  
  public handlePlayerCollision(): void {
    // Don't allow catching during grace period
    if (this.gracePeriodTime > 0) {
      return;
    }
    
    // Get the owner's current state
    if (this.owner) {
      const ownerState = this.owner.getState();
      
      // If player is riding, don't process collision
      if (this.owner.getIsRiding()) {
        return;
      }
      
      if (ownerState === PlayerState.Crouching || ownerState === PlayerState.Sliding) {
        return;
      }
      
      // Check for parry
      if (ownerState === PlayerState.Blocking && this.owner.isInParryWindow()) {
        // Mount the player on the boomerang
        this.owner.mountBoomerang(this);
        this.hasRider = true;
        
        return; // Don't catch the boomerang
      }
    }
    
    if (this.onPlayerCollision) {
      this.onPlayerCollision();
    }
  }
  
  public setOwner(player: Player): void {
    this.owner = player;
  }
  
  public getOwner(): Player | null {
    return this.owner;
  }
  
  public destroy(): void {
    this.cleanupPhysics();
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
  
}