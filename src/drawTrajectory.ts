import * as PIXI from 'pixi.js';
import { Vector2 } from './types';
import { BOOMERANG_CONFIG, TRAJECTORY_CONFIG } from './constants/game.constants';

/**
 * Draws the boomerang's U-shaped trajectory preview
 * Shows both the throw path and return path
 */
export function drawBoomerangTrajectory(
  graphics: PIXI.Graphics,
  origin: Vector2,
  angle: number,
  facingRight: boolean
): void {
  graphics.clear();
  
  const direction = facingRight ? 1 : -1;
  const numDotsPerSide = 30;
  const isStraightLine = angle >= TRAJECTORY_CONFIG.STRAIGHT_LINE_THRESHOLD;
  
  // Calculate trajectory height based on angle
  const heightMultiplier = (180 - angle) / TRAJECTORY_CONFIG.ANGLE_RANGE;
  const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * TRAJECTORY_CONFIG.HEIGHT_MULTIPLIER * heightMultiplier;
  
  // Draw throw path (first half of U)
  for (let i = 1; i <= numDotsPerSide; i++) {
    const t = i / numDotsPerSide;
    const x = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
    
    let y = origin.y;
    if (!isStraightLine) {
      // Quadratic curve that rises
      y = origin.y - (peakHeight * t * t);
    }
    
    // Draw solid white square centered at (x,y)
    graphics.rect(x - 2, y - 2, 4, 4);
    graphics.fill(0xffffff);
  }
  
  // Draw return path (second half of U)
  for (let i = 1; i <= numDotsPerSide; i++) {
    const t = i / numDotsPerSide;
    const returnT = 1 - t; // Reverse progress for return
    
    // Start from the end point and come back
    const endX = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * direction);
    const x = endX - (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
    
    let y = origin.y;
    if (!isStraightLine) {
      // Same quadratic curve for return (creates U shape)
      y = origin.y - (peakHeight * returnT * returnT);
    }
    
    // Draw solid white square centered at (x,y)
    graphics.rect(x - 2, y - 2, 4, 4);
    graphics.fill(0xffffff);
  }
}