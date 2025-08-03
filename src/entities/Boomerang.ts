import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, BoomerangState, BoomerangThrowParams, PlayerState, IBoomerang } from '../types';
import { BOOMERANG_CONFIG, COLLISION_GROUPS, TRAJECTORY_CONFIG, PHYSICS } from '../constants/game.constants';
import { Player } from '../Player';
import { calculateTrajectoryParams, calculateTrajectoryPoint, calculateTrajectoryDerivative, TrajectoryParams } from '../utils/trajectoryMath';

/**
 * SIMPLIFIED BOOMERANG CLASS
 * 
 * Core mechanics:
 * 1. Throw in an arc (parabolic or straight)
 * 2. Pause at max distance
 * 3. Return to player
 * 4. Can be mounted/ridden by parrying
 */
export class Boomerang implements IBoomerang {
  private world: RapierWorld;
  private rigidBody!: RapierRigidBody;
  private collider!: RAPIER.Collider;
  private sprite: PIXI.Graphics;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  private owner: Player | null = null;
  
  // State
  private state: BoomerangState = BoomerangState.Caught;
  private distanceTraveled: number = 0;
  private hangTime: number = 0;
  private hasRider: boolean = false;
  
  // Trajectory parameters
  private throwOrigin: Vector2 = { x: 0, y: 0 };
  private throwAngle: number = 180;
  private throwDirection: number = 1;
  private isStraightLine: boolean = false;
  private gracePeriod: number = 0;
  private trajectoryParams: TrajectoryParams | null = null;
  
  constructor(
    world: RapierWorld,
    container: PIXI.Container,
    RapierModule: typeof RAPIER
  ) {
    this.world = world;
    this.container = container;
    this.RAPIER = RapierModule;
    
    // Create sprite once
    this.sprite = new PIXI.Graphics();
    this.drawBoomerang();
    this.sprite.visible = false;
    this.container.addChild(this.sprite);
  }
  
  
  private drawBoomerang(): void {
    const size = 16;
    const thickness = 4;
    
    // L-shaped boomerang
    this.sprite.moveTo(-size/2, -size/2);
    this.sprite.lineTo(-size/2 + thickness, -size/2);
    this.sprite.lineTo(-size/2 + thickness, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2);
    this.sprite.lineTo(-size/2, size/2);
    this.sprite.closePath();
    this.sprite.fill(0xff0000); // Red
  }
  
  public throw(params: BoomerangThrowParams): void {
    if (this.state !== BoomerangState.Caught) return;
    
    // Store throw parameters
    this.throwOrigin = { ...params.origin };
    this.throwAngle = params.angle;
    this.throwDirection = params.facingRight ? 1 : -1;
    this.isStraightLine = params.angle >= TRAJECTORY_CONFIG.STRAIGHT_LINE_THRESHOLD;
    
    // Calculate arc parameters
    this.trajectoryParams = calculateTrajectoryParams(params.angle);
    
    // Reset state
    this.distanceTraveled = 0;
    this.hangTime = 0;
    this.gracePeriod = BOOMERANG_CONFIG.GRACE_PERIOD;
    this.state = BoomerangState.Throwing;
    
    // Create physics
    this.createPhysics(params.origin.x, params.origin.y);
    
    // Show sprite
    this.sprite.visible = true;
    this.updateSpritePosition();
  }
  
  private createPhysics(x: number, y: number): void {
    this.cleanupPhysics();
    
    // Kinematic body (we control position)
    const rigidBodyDesc = this.RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(x, y);
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
    // Sensor collider - detect both player and environment
    const colliderDesc = this.RAPIER.ColliderDesc.ball(8)
      .setSensor(true)
      .setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS);
    
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    
    // Set collision groups after creation - boomerang can collide with environment and player
    this.collider.setCollisionGroups(
      (COLLISION_GROUPS.BOOMERANG << 16) | // Membership: this is a boomerang
      (COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.PLAYER_STANDING | COLLISION_GROUPS.PLAYER_CROUCHING) // Filter: can collide with these
    );
  }
  
  public update(deltaTime: number): void {
    if (this.state === BoomerangState.Caught || !this.rigidBody) return;
    
    // Update grace period
    if (this.gracePeriod > 0) {
      this.gracePeriod -= deltaTime;
    }
    
    // Update based on state
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
    
    this.updateSpritePosition();
  }
  
  private updateThrowing(deltaTime: number): void {
    // Move along throw trajectory
    this.distanceTraveled += BOOMERANG_CONFIG.THROW_SPEED * deltaTime;
    
    if (this.distanceTraveled >= BOOMERANG_CONFIG.THROW_DISTANCE) {
      // Reached max distance
      this.state = BoomerangState.Hanging;
      this.hangTime = BOOMERANG_CONFIG.HANG_TIME;  // Always hang, even with rider
      this.distanceTraveled = BOOMERANG_CONFIG.THROW_DISTANCE;
    }
    
    this.updatePosition();
  }
  
  private updateHanging(deltaTime: number): void {
    this.hangTime -= deltaTime;
    
    if (this.hangTime <= 0) {
      // Start returning
      this.state = BoomerangState.Returning;
      // Don't change distanceTraveled - keep it where we hung
    }
  }
  
  private updateReturning(deltaTime: number): void {
    // Move back along return trajectory
    this.distanceTraveled -= BOOMERANG_CONFIG.THROW_SPEED * deltaTime;
    
    if (this.distanceTraveled <= 0) {
      // Reached origin - reverse direction and throw again!
      this.throwDirection = -this.throwDirection;  // Flip direction
      
      // Recalculate arc parameters for new direction
      this.trajectoryParams = calculateTrajectoryParams(this.throwAngle);
      
      this.distanceTraveled = 0;
      this.state = BoomerangState.Throwing;  // Start new throw in opposite direction
      
      // Update origin to current position for the new U-shape
      const pos = this.rigidBody.translation();
      this.throwOrigin = { x: pos.x, y: pos.y };
      return;
    }
    
    this.updatePosition();
    
    // Don't check for catching if player is riding
    if (this.hasRider) {
      return;
    }
    
    // Check if close to owner for catching
    if (this.owner && this.gracePeriod <= 0) {
      const ownerPos = this.owner.getPosition();
      const myPos = this.rigidBody.translation();
      const dist = Math.sqrt(
        Math.pow(ownerPos.x - myPos.x, 2) + 
        Math.pow(ownerPos.y - myPos.y, 2)
      );
      
      if (dist < PHYSICS.CATCH_DISTANCE) {
        this.handlePlayerCollision();
      }
    }
  }
  
  private updatePosition(): void {
    if (!this.trajectoryParams) return;
    
    const progress = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
    const position = calculateTrajectoryPoint(
      progress,
      this.throwOrigin,
      this.trajectoryParams,
      this.throwDirection,
      this.isStraightLine
    );
    
    this.rigidBody.setTranslation(position, true);
  }
  
  private updateSpritePosition(): void {
    if (!this.sprite.visible || !this.rigidBody) return;
    
    const pos = this.rigidBody.translation();
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
    this.sprite.rotation += 0.3; // Spin
  }
  
  public handlePlayerCollision(): void {
    if (!this.owner || this.gracePeriod > 0) return;
    
    // Don't process collision if player is already riding
    if (this.hasRider) return;
    
    const ownerState = this.owner.getState();
    
    // Mount if parrying
    if (ownerState === PlayerState.Blocking && this.owner.isInParryWindow()) {
      this.owner.mountBoomerang(this);
      this.hasRider = true;
      return;
    }
    
    // Don't catch if crouching/sliding
    if (ownerState === PlayerState.Crouching || ownerState === PlayerState.Sliding) {
      return;
    }
    
    // Catch normally
    this.owner.setHasBoomerang(true);
    this.catch();
  }
  
  public catch(): void {
    this.state = BoomerangState.Caught;
    this.hasRider = false;
    this.sprite.visible = false;
    this.cleanupPhysics();
  }
  
  private cleanupPhysics(): void {
    if (this.collider) {
      this.world.removeCollider(this.collider, false);
      this.collider = null!;
    }
    if (this.rigidBody) {
      this.world.removeRigidBody(this.rigidBody);
      this.rigidBody = null!;
    }
  }
  
  public checkWallCollision(): void {
    // Only hang if we're in throwing state and not in grace period
    if (this.state === BoomerangState.Throwing && this.gracePeriod <= 0) {
      // Stop at current position and start hanging
      this.state = BoomerangState.Hanging;
      this.hangTime = BOOMERANG_CONFIG.HANG_TIME;
      
      // Lock the current distance traveled so it stays at collision point
      // No need to update distanceTraveled as we want to hang at current position
    }
  }
  
  // Required interface methods
  public getState(): BoomerangState { return this.state; }
  public getPosition(): Vector2 | null {
    if (!this.rigidBody || this.state === BoomerangState.Caught) return null;
    const pos = this.rigidBody.translation();
    return { x: pos.x, y: pos.y };
  }
  public getCollider(): RAPIER.Collider | null {
    return this.state !== BoomerangState.Caught ? this.collider : null;
  }
  public setOwner(player: Player): void { this.owner = player; }
  
  public getCurrentState(): BoomerangState {
    return this.state;
  }
  
  public getFlightDirection(): Vector2 {
    if (!this.trajectoryParams) return { x: 0, y: -1 };
    
    const progress = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
    const isReturning = this.state === BoomerangState.Returning;
    
    let derivative = calculateTrajectoryDerivative(
      progress,
      this.trajectoryParams,
      this.throwDirection,
      this.isStraightLine
    );
    
    // Reverse direction if returning
    if (isReturning) {
      derivative.x = -derivative.x;
      derivative.y = -derivative.y;
    }
    
    // For hang state, if velocity is near zero, use small upward bias
    if (this.state === BoomerangState.Hanging && Math.abs(derivative.x) < 0.1 && Math.abs(derivative.y) < 0.1) {
      return { x: 0, y: -1 };
    }
    
    // Normalize to get unit direction vector
    const magnitude = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
    if (magnitude < 0.001) {
      return { x: 0, y: -1 };
    }
    
    return {
      x: derivative.x / magnitude,
      y: derivative.y / magnitude
    };
  }
  
  public getCurrentVelocity(): Vector2 {
    // Returns actual velocity (for compatibility)
    const dir = this.getFlightDirection();
    return {
      x: dir.x * BOOMERANG_CONFIG.THROW_SPEED,
      y: dir.y * BOOMERANG_CONFIG.THROW_SPEED
    };
  }
  
  public getIsStraightLine(): boolean { return this.isStraightLine; }
}