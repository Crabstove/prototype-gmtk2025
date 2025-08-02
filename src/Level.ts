import * as PIXI from 'pixi.js';
import type * as RAPIER from '@dimforge/rapier2d';
import { RapierWorld } from './types';
import { PlatformData, LEVEL_1_PLATFORMS } from './data/level.data';
import { PLATFORM_COLORS, COLLISION_GROUPS } from './constants/game.constants';

export class Level {
  private world: RapierWorld;
  private container: PIXI.Container;
  private RAPIER: typeof RAPIER;
  private platformSprites: PIXI.Graphics[] = [];

  constructor(
    world: RapierWorld,
    container: PIXI.Container,
    RapierModule: typeof RAPIER
  ) {
    this.world = world;
    this.container = container;
    this.RAPIER = RapierModule;
    this.createPlatforms(LEVEL_1_PLATFORMS);
  }

  private createPlatforms(platforms: PlatformData[]): void {
    platforms.forEach(platform => {
      this.createPlatform(platform);
    });
  }

  private createPlatform(platform: PlatformData): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    
    const rigidBodyDesc = this.RAPIER.RigidBodyDesc.fixed()
      .setTranslation(centerX, centerY);
    
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
    const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
      platform.width / 2,
      platform.height / 2
    )
      .setCollisionGroups(
        // The format is: membership << 16 | filter
        (COLLISION_GROUPS.ENVIRONMENT << 16) |
        (COLLISION_GROUPS.PLAYER_STANDING | COLLISION_GROUPS.PLAYER_CROUCHING | 
         COLLISION_GROUPS.BOOMERANG | COLLISION_GROUPS.ENEMY)
      );
    this.world.createCollider(colliderDesc, rigidBody);

    const graphics = new PIXI.Graphics();
    graphics.rect(0, 0, platform.width, platform.height);
    graphics.fill(platform.color || PLATFORM_COLORS.PLATFORM);
    
    graphics.x = platform.x;
    graphics.y = platform.y;
    
    this.container.addChild(graphics);
    this.platformSprites.push(graphics);
  }

  public destroy(): void {
    this.platformSprites.forEach(sprite => {
      sprite.destroy();
    });
    this.platformSprites = [];
  }
}