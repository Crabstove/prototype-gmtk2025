import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld, Vector2, BoomerangThrowParams, BoomerangState } from '../types';
import { Boomerang } from '../entities/Boomerang';
import { Player } from '../Player';

export interface ProjectileSpawnParams {
  type: 'boomerang';
  owner: Player;
  throwParams: BoomerangThrowParams;
}

export class ProjectileManager {
  private world: RapierWorld;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  private projectiles: Boomerang[] = [];
  
  constructor(
    world: RapierWorld,
    container: PIXI.Container,
    RapierModule: typeof RAPIER
  ) {
    this.world = world;
    this.container = container;
    this.RAPIER = RapierModule;
  }
  
  public spawnBoomerang(owner: Player, throwParams: BoomerangThrowParams): Boomerang {
    const boomerang = new Boomerang(this.world, this.container, this.RAPIER);
    boomerang.setOwner(owner);
    boomerang.throw(throwParams);
    
    // Set up collision callback
    boomerang.setOnPlayerCollision(() => {
      // Check if this is the owner catching their boomerang
      if (boomerang.getOwner() === owner) {
        boomerang.catch();
        owner.setHasBoomerang(true);
      }
    });
    
    this.projectiles.push(boomerang);
    
    return boomerang;
  }
  
  public update(deltaTime: number): void {
    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(deltaTime);
      
      // Remove caught boomerangs
      if (projectile.getState() === BoomerangState.Caught) {
        this.projectiles.splice(i, 1);
      }
    }
  }
  
  public checkCollisions(playerCollider: RAPIER.Collider): void {
    for (const projectile of this.projectiles) {
      const boomerangCollider = projectile.getCollider();
      if (!boomerangCollider) continue;
      
      // Check collision with player (physics layer handles crouch filtering)
      const intersecting = this.world.intersectionPair(boomerangCollider, playerCollider);
      if (intersecting) {
        projectile.handlePlayerCollision();
      }
      
      // Check collision with walls/platforms
      this.world.intersectionsWith(boomerangCollider, (otherCollider) => {
        // Skip player collider
        if (otherCollider === playerCollider) return true;
        
        // Hit a wall/platform
        projectile.checkWallCollision();
        return false; // Stop checking
      });
    }
  }
  
  public getActiveProjectiles(): Boomerang[] {
    return [...this.projectiles];
  }
  
  public destroy(): void {
    for (const projectile of this.projectiles) {
      projectile.destroy();
    }
    this.projectiles = [];
  }
}