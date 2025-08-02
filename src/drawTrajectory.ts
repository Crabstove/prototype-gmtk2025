import * as PIXI from 'pixi.js';
import { Vector2 } from './types';
import { BOOMERANG_CONFIG, TRAJECTORY_CONFIG } from './constants/game.constants';
import { calculateTrajectoryParams, calculateTrajectoryPoint } from './utils/trajectoryMath';

/**
 * Draws the boomerang's trajectory preview
 * Shows the throw path
 */
export function drawBoomerangTrajectory(
  graphics: PIXI.Graphics,
  origin: Vector2,
  angle: number,
  facingRight: boolean
): void {
  graphics.clear();
  
  const direction = facingRight ? 1 : -1;
  const numDots = 30;
  const isStraightLine = angle >= TRAJECTORY_CONFIG.STRAIGHT_LINE_THRESHOLD;
  const trajectoryParams = calculateTrajectoryParams(angle);
  
  // Helper function to draw a dot
  const drawDot = (x: number, y: number): void => {
    graphics.rect(x - 2, y - 2, 4, 4);
    graphics.fill(0xffffff);
  };
  
  // Draw trajectory dots
  for (let i = 1; i <= numDots; i++) {
    const t = i / numDots;
    const point = calculateTrajectoryPoint(
      t,
      origin,
      trajectoryParams,
      direction,
      isStraightLine
    );
    drawDot(point.x, point.y);
  }
}