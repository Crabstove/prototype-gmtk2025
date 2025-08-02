import { Vector2 } from '../types';
import { BOOMERANG_CONFIG, TRAJECTORY_CONFIG } from '../constants/game.constants';

/**
 * Shared trajectory calculation logic for boomerang path
 * Used by both Boomerang entity and trajectory preview
 */

export interface TrajectoryParams {
  angle: number; // degrees
  heightMultiplier: number;
  maxArcHeight: number;
}

export function calculateTrajectoryParams(angle: number): TrajectoryParams {
  const angleRad = (angle * Math.PI) / 180;
  const heightMultiplier = Math.sin(angleRad); // sin gives us 0 at 180° and 1 at 90°
  const maxArcHeight = BOOMERANG_CONFIG.THROW_DISTANCE * 0.6 * heightMultiplier;
  
  return {
    angle,
    heightMultiplier,
    maxArcHeight
  };
}

export function calculateTrajectoryPoint(
  t: number, // progress 0-1
  origin: Vector2,
  params: TrajectoryParams,
  direction: number, // 1 or -1
  isStraightLine: boolean
): Vector2 {
  if (isStraightLine) {
    // Straight line for angles >= 168°
    return {
      x: origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction),
      y: origin.y
    };
  }
  
  // Parametric blending between parabola and quarter circle
  const blend = params.heightMultiplier; // sin(angle): 0 at 180°, 1 at 90°
  
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
  return {
    x: origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * blendedX * direction),
    y: origin.y - (params.maxArcHeight * blendedY)
  };
}

export function calculateTrajectoryDerivative(
  t: number, // progress 0-1
  params: TrajectoryParams,
  direction: number,
  isStraightLine: boolean
): Vector2 {
  if (isStraightLine) {
    return { x: direction, y: 0 };
  }
  
  const blend = params.heightMultiplier;
  
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
  return {
    x: blendedDx * direction,
    y: -blendedDy * (params.maxArcHeight / BOOMERANG_CONFIG.THROW_DISTANCE)
  };
}