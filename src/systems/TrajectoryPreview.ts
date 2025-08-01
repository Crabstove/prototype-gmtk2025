import * as PIXI from 'pixi.js';
import { Vector2 } from '../types';
import { BOOMERANG_CONFIG } from '../constants';

export class TrajectoryPreview {
  private graphics: PIXI.Graphics;
  private container: PIXI.Container;
  private isVisible: boolean = false;
  
  constructor(container: PIXI.Container) {
    this.container = container;
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = BOOMERANG_CONFIG.PREVIEW_ALPHA;
    this.container.addChild(this.graphics);
  }
  
  public show(): void {
    this.isVisible = true;
    this.graphics.visible = true;
  }
  
  public hide(): void {
    this.isVisible = false;
    this.graphics.visible = false;
    this.graphics.clear();
  }
  
  public updateTrajectory(origin: Vector2, angle: number, isFacingRight: boolean): void {
    if (!this.isVisible) return;
    
    this.graphics.clear();
    
    // Convert angle to radians and adjust for facing direction
    const angleRad = (angle * Math.PI) / 180;
    const direction = isFacingRight ? 1 : -1;
    
    // Calculate trajectory points
    const points = this.calculateTrajectoryPoints(origin, angleRad, direction);
    
    // Draw the trajectory line
    this.drawTrajectoryLine(points);
  }
  
  private calculateTrajectoryPoints(origin: Vector2, angleRad: number, direction: number): Vector2[] {
    const points: Vector2[] = [];
    const numPoints = BOOMERANG_CONFIG.TRAJECTORY_PREVIEW_POINTS;
    
    // Check if it's a straight line trajectory (168-180 degrees)
    const isStraightLine = angleRad >= (168 * Math.PI) / 180;
    
    if (isStraightLine) {
      // Straight horizontal line
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
        const y = origin.y;
        points.push({ x, y });
      }
    } else {
      // Parabolic trajectory - first half of U-shape
      // Shows the boomerang path starting from player and curving upward
      
      const angleDegrees = angleRad * 180 / Math.PI;
      // Height based on angle (180° = 0 height, 120° = max height)
      const heightMultiplier = (180 - angleDegrees) / 60; // 0 to 1
      const peakHeight = BOOMERANG_CONFIG.THROW_DISTANCE * 0.5 * heightMultiplier; // Peak height
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints; // 0 to 1
        
        // Horizontal position (linear)
        const x = origin.x + (BOOMERANG_CONFIG.THROW_DISTANCE * t * direction);
        
        // Vertical position - quadratic curve that starts at origin and curves up
        // Height increases quadratically: starts at 0, ends at peakHeight
        const heightAtPoint = peakHeight * t * t; // Quadratic growth
        const y = origin.y - heightAtPoint; // Subtract because up is negative in screen coords
        
        points.push({ x, y });
      }
    }
    
    return points;
  }
  
  private drawTrajectoryLine(points: Vector2[]): void {
    if (points.length < 2) return;
    
    // Start drawing from the first point
    this.graphics.moveTo(points[0].x, points[0].y);
    
    // Draw dashed line effect
    for (let i = 1; i < points.length; i++) {
      // Create dashed effect by drawing every other segment
      if (i % 2 === 0) {
        this.graphics.moveTo(points[i].x, points[i].y);
      } else {
        this.graphics.lineTo(points[i].x, points[i].y);
      }
    }
    
    this.graphics.stroke({
      width: BOOMERANG_CONFIG.PREVIEW_WIDTH,
      color: BOOMERANG_CONFIG.PREVIEW_COLOR,
    });
  }
  
  public destroy(): void {
    this.graphics.destroy();
  }
}