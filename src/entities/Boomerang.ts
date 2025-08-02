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
  private maxArcHeight: number = 0; // Maximum height of the arc
  private heightMultiplier: number = 0; // Height multiplier based on angle
  private powerExponent: number = 2; // Power curve exponent
  
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
    
    // Calculate arc height based on angle
    const angleRad = (params.angle * Math.PI) / 180;
    const heightMultiplier = Math.sin(angleRad); // sin gives us 0 at 180° and 1 at 90°
    this.maxArcHeight = BOOMERANG_CONFIG.THROW_DISTANCE * 0.6 * heightMultiplier;
    this.heightMultiplier = heightMultiplier; // Store for curve calculation
    this.powerExponent = 2 - 0.8 * heightMultiplier; // Power for curve shape
    
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
      
      // Recalculate arc parameters for new direction
      const angleRad = (this.throwAngle * Math.PI) / 180;
      const heightMultiplier = Math.sin(angleRad);
      this.maxArcHeight = BOOMERANG_CONFIG.THROW_DISTANCE * 0.6 * heightMultiplier;
      this.heightMultiplier = heightMultiplier;
      this.powerExponent = 2 - 0.8 * heightMultiplier;
      
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
    
    // Calculate normalized progress (0 to 1)
    const progress = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
    
    if (this.isStraightLine) {
      // Straight line for angles >= 168°
      x = this.throwOrigin.x + (this.distanceTraveled * this.throwDirection);
      y = this.throwOrigin.y;
    } else {
      // Curved trajectory for angles < 168°
      const t = progress;
      
      // Parametric blending between parabola and quarter circle
      const blend = this.heightMultiplier; // sin(angle): 0 at 180°, 1 at 90°
      
      // Parabolic parametric: x = t, y = t²
      const parabolaX = t;
      const parabolaY = t * t;
      
      // Quarter circle parametric: x = sin(t*π/2), y = 1-cos(t*π/2)
      const circleX = Math.sin(t * Math.PI / 2);
      const circleY = 1 - Math.cos(t * Math.PI / 2);
      
      // Blend between the two
      const blendedX = parabolaX * (1 - blend) + circleX * blend;
      const blendedY = parabolaY * (1 - blend) + circleY * blend;
      
      // Scale and position
      x = this.throwOrigin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * blendedX * this.throwDirection);
      y = this.throwOrigin.y - (this.maxArcHeight * blendedY);
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
  
  public getCurrentState(): BoomerangState {
    return this.state;
  }
  
  public getFlightDirection(): Vector2 {
    // Get normalized flight direction for dismount calculations
    // Always return actual trajectory direction, even during hang
    
    const progress = this.distanceTraveled / BOOMERANG_CONFIG.THROW_DISTANCE;
    const isReturning = this.state === BoomerangState.Returning;
    
    let dx: number, dy: number;
    
    if (this.isStraightLine) {
      // Straight line - constant horizontal velocity
      dx = this.throwDirection * (isReturning ? -1 : 1);
      dy = 0;
    } else {
      // Calculate derivatives of the blended parametric curve
      const t = progress;
      const blend = this.heightMultiplier; // sin(angle): 0 at 180°, 1 at 90°
      
      // Parabola derivatives: dx/dt = 1, dy/dt = 2t
      const parabolaDx = 1;
      const parabolaDy = 2 * t;
      
      // Quarter circle derivatives: dx/dt = (π/2)cos(tπ/2), dy/dt = (π/2)sin(tπ/2)
      const circleDx = (Math.PI / 2) * Math.cos(t * Math.PI / 2);
      const circleDy = (Math.PI / 2) * Math.sin(t * Math.PI / 2);
      
      // Blend the derivatives
      const blendedDx = parabolaDx * (1 - blend) + circleDx * blend;
      const blendedDy = parabolaDy * (1 - blend) + circleDy * blend;
      
      // Apply scaling and direction
      // For x: scale by THROW_DISTANCE and apply direction
      dx = blendedDx * this.throwDirection;
      // For y: scale by maxArcHeight (negative because we subtract in updatePosition)
      dy = -blendedDy * (this.maxArcHeight / BOOMERANG_CONFIG.THROW_DISTANCE);
      
      // Reverse direction if returning
      if (isReturning) {
        dx = -dx;
        dy = -dy;
      }
    }
    
    // For hang state, if velocity is near zero, use small upward bias
    if (this.state === BoomerangState.Hanging && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      dx = 0;
      dy = -1;
    }
    
    // Normalize to get unit direction vector
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (magnitude < 0.001) {
      // Fallback for zero velocity
      return { x: 0, y: -1 };
    }
    
    return {
      x: dx / magnitude,
      y: dy / magnitude
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
  
  public getTargetVelocity(): Vector2 { return { x: 0, y: 0 }; }  // Stub
  public getDistanceTraveled(): number { return this.distanceTraveled; }
  public getIsStraightLine(): boolean { return this.isStraightLine; }
  public setOnPlayerCollision(callback: () => void): void {}
}