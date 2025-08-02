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
  
  // For straight lines, we don't need physics
  if (isStraightLine) {
    // Draw throw path (first half of U)
    for (let i = 1; i <= numDotsPerSide; i++) {
      const t = i / numDotsPerSide;
      const x = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
      const y = origin.y;
      
      graphics.rect(x - 2, y - 2, 4, 4);
      graphics.fill(0xffffff);
    }
    
    // Draw return path (second half of U)
    for (let i = 1; i <= numDotsPerSide; i++) {
      const t = i / numDotsPerSide;
      const endX = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * direction);
      const x = endX - (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
      const y = origin.y;
      
      graphics.rect(x - 2, y - 2, 4, 4);
      graphics.fill(0xffffff);
    }
    return;
  }
  
  // Calculate arc parameters based on angle
  const angleRad = (angle * Math.PI) / 180;
  const heightMultiplier = Math.sin(angleRad); // sin gives us 0 at 180° and 1 at 90°
  const maxHeight = BOOMERANG_CONFIG.THROW_DISTANCE * 0.6 * heightMultiplier; // 60% of distance at 90°
  
  // Draw throw path (first half of U)
  for (let i = 1; i <= numDotsPerSide; i++) {
    const t = i / numDotsPerSide;
    
    // Parametric blending between parabola and quarter circle
    // Blend factor: 0 at 180° (pure parabola), 1 at 90° (pure quarter circle)
    const blend = heightMultiplier; // This is already sin(angle), perfect!
    
    // Parabolic parametric: x = t, y = t²
    const parabolaX = t;
    const parabolaY = t * t;
    
    // Quarter circle parametric: x = sin(t*π/2), y = 1-cos(t*π/2)
    // This creates a quarter circle that starts horizontal and ends vertical
    const circleX = Math.sin(t * Math.PI / 2);
    const circleY = 1 - Math.cos(t * Math.PI / 2);
    
    // Blend between the two
    const blendedX = parabolaX * (1 - blend) + circleX * blend;
    const blendedY = parabolaY * (1 - blend) + circleY * blend;
    
    // Scale and position
    const x = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * blendedX * direction);
    const y = origin.y - (maxHeight * blendedY);
    
    // Draw solid white square centered at (x,y)
    graphics.rect(x - 2, y - 2, 4, 4);
    graphics.fill(0xffffff);
  }
  
  // Return path removed - only showing throw trajectory
}