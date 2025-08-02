import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, RapierRigidBody, Vector2, BoomerangState, BoomerangThrowParams, PlayerState, IBoomerang } from '../types';
import { BOOMERANG_CONFIG, COLLISION_GROUPS, TRAJECTORY_CONFIG, PHYSICS } from '../constants/game.constants';
import { Player } from '../Player';

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
    const size = 11;
    const thickness = 3;
    
    // L-shaped boomerang
    this.sprite.moveTo(-size/2, -size/2);
    this.sprite.lineTo(-size/2 + thickness, -size/2);
    this.sprite.lineTo(-size/2 + thickness, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2 - thickness);
    this.sprite.lineTo(size/2, size/2);
    this.sprite.lineTo(-size/2, size/2);
    this.sprite.closePath();
    this.sprite.fill(0xff00ff); // Magenta
  }
  
  public throw(params: BoomerangThrowParams): void {
    if (this.state !== BoomerangState.Caught) return;
    
    // Store throw parameters
    this.throwOrigin = { ...params.origin };
    this.throwAngle = params.angle;
    this.throwDirection = params.facingRight ? 1 : -1;
    this.isStraightLine = params.angle >= TRAJECTORY_CONFIG.STRAIGHT_LINE_THRESHOLD;
    
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
    
    // Sensor collider
    const colliderDesc = this.RAPIER.ColliderDesc.ball(5.5)
      .setSensor(true)
      .setActiveEvents(this.RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(
        (COLLISION_GROUPS.BOOMERANG << 16) |
        (COLLISION_GROUPS.PLAYER_STANDING | COLLISION_GROUPS.ENVIRONMENT)
      );
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
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
      this.distanceTraveled = BOOMERANG_CONFIG.THROW_DISTANCE;
    }
  }
  
  private updateReturning(deltaTime: number): void {
    // Move back along return trajectory
    this.distanceTraveled -= BOOMERANG_CONFIG.THROW_SPEED * deltaTime;
    
    if (this.distanceTraveled <= 0) {
      // Reached origin - reverse direction and throw again!
      this.throwDirection = -this.throwDirection;  // Flip direction
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
    let x: number, y: number;
    
    if (this.state === BoomerangState.Returning) {
      // Return path - we're counting DOWN from THROW_DISTANCE to 0
      // So when distanceTraveled = THROW_DISTANCE, we're at the far end
      // When distanceTraveled = 0, we're back at origin
      x = this.throwOrigin.x + (this.distanceTraveled * this.throwDirection);
      
      if (!this.isStraightLine) {
        // Use distanceTraveled directly for the return curve
        const t = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
        const heightMultiplier = (180 - this.throwAngle) / TRAJECTORY_CONFIG.ANGLE_RANGE;
        const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * TRAJECTORY_CONFIG.HEIGHT_MULTIPLIER * heightMultiplier;
        y = this.throwOrigin.y - (peakHeight * t * t);
      } else {
        y = this.throwOrigin.y;
      }
    } else {
      // Throw path - counting UP from 0 to THROW_DISTANCE
      x = this.throwOrigin.x + (this.distanceTraveled * this.throwDirection);
      
      if (!this.isStraightLine) {
        const t = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
        const heightMultiplier = (180 - this.throwAngle) / TRAJECTORY_CONFIG.ANGLE_RANGE;
        const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * TRAJECTORY_CONFIG.HEIGHT_MULTIPLIER * heightMultiplier;
        y = this.throwOrigin.y - (peakHeight * t * t);
      } else {
        y = this.throwOrigin.y;
      }
    }
    
    this.rigidBody.setTranslation({ x, y }, true);
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
      try { this.world.removeCollider(this.collider, false); } catch (e) {}
      this.collider = null!;
    }
    if (this.rigidBody) {
      try { this.world.removeRigidBody(this.rigidBody); } catch (e) {}
      this.rigidBody = null!;
    }
  }
  
  public checkWallCollision(): void {
    if (this.state === BoomerangState.Throwing) {
      this.state = BoomerangState.Hanging;
      this.hangTime = BOOMERANG_CONFIG.HANG_TIME;
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
  public getOwner(): Player | null { return this.owner; }
  public destroy(): void {
    this.cleanupPhysics();
    if (this.sprite) this.sprite.destroy();
  }
  
  // Stubs for removed complexity
  public getCurrentVelocity(): Vector2 { return { x: 0, y: 0 }; }
  public getTargetVelocity(): Vector2 { return { x: 0, y: 0 }; }
  public getDistanceTraveled(): number { return this.distanceTraveled; }
  public getIsStraightLine(): boolean { return this.isStraightLine; }
  public setOnPlayerCollision(callback: () => void): void {}
}