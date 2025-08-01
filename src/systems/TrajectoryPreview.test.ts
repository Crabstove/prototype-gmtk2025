import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrajectoryPreview } from './TrajectoryPreview';
import { BOOMERANG_CONFIG } from '../constants';
import * as PIXI from 'pixi.js';

// Mock PIXI
vi.mock('pixi.js', () => {
  const mockGraphics = {
    clear: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    circle: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    visible: false,
    alpha: 1,
  };

  return {
    Graphics: vi.fn(() => mockGraphics),
  };
});

describe('TrajectoryPreview', () => {
  let trajectoryPreview: TrajectoryPreview;
  let mockContainer: any;
  let mockGraphics: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer = {
      addChild: vi.fn(),
      removeChild: vi.fn(),
    };
    
    trajectoryPreview = new TrajectoryPreview(mockContainer);
    mockGraphics = trajectoryPreview['graphics'];
  });

  describe('initialization', () => {
    it('should create graphics and add to container', () => {
      expect(mockContainer.addChild).toHaveBeenCalledWith(mockGraphics);
      expect(mockGraphics.visible).toBe(false);
    });

    it('should set initial alpha', () => {
      expect(mockGraphics.alpha).toBe(BOOMERANG_CONFIG.PREVIEW_ALPHA);
    });
  });

  describe('visibility', () => {
    it('should show preview', () => {
      trajectoryPreview.show();
      expect(mockGraphics.visible).toBe(true);
    });

    it('should hide preview', () => {
      trajectoryPreview.show();
      trajectoryPreview.hide();
      expect(mockGraphics.visible).toBe(false);
    });
  });

  describe('trajectory calculation', () => {
    const origin = { x: 100, y: 200 };

    beforeEach(() => {
      trajectoryPreview.show();
    });

    it('should draw straight line for angles >= 168', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory(origin, 180, true);

      expect(mockGraphics.clear).toHaveBeenCalled();
      expect(mockGraphics.moveTo).toHaveBeenCalled();
      expect(mockGraphics.lineTo).toHaveBeenCalled();
      
      // Should draw horizontal line
      const lineToCall = mockGraphics.lineTo.mock.calls[0];
      expect(lineToCall[1]).toBe(origin.y); // Y should remain constant
    });

    it('should draw parabolic arc for angles < 168', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory(origin, 145, true);

      expect(mockGraphics.clear).toHaveBeenCalled();
      
      // Should have multiple lineTo calls for curve
      const lineToCallCount = mockGraphics.lineTo.mock.calls.length;
      expect(lineToCallCount).toBeGreaterThan(10); // Multiple segments
    });

    it('should respect facing direction', () => {
      trajectoryPreview.show();
      
      // Facing right
      trajectoryPreview.updateTrajectory(origin, 180, true);
      const rightLineCall = mockGraphics.lineTo.mock.calls[0];
      expect(rightLineCall[0]).toBeGreaterThan(origin.x);

      mockGraphics.clear.mockClear();
      mockGraphics.lineTo.mockClear();

      // Facing left
      trajectoryPreview.updateTrajectory(origin, 180, false);
      const leftLineCall = mockGraphics.lineTo.mock.calls[0];
      expect(leftLineCall[0]).toBeLessThan(origin.x);
    });

    it('should calculate correct peak height for parabolic trajectory', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory(origin, 110, true); // Min angle

      // Find the highest Y point (remember Y increases downward)
      let lowestY = origin.y;
      mockGraphics.lineTo.mock.calls.forEach((call: any[]) => {
        if (call[1] < lowestY) {
          lowestY = call[1];
        }
      });

      // Should have significant height
      const heightDifference = origin.y - lowestY;
      expect(heightDifference).toBeGreaterThan(100); // Substantial arc
    });

    it('should draw dashed line pattern', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory(origin, 145, true);

      // Count pattern of moveTo calls (dashes)
      const moveToCount = mockGraphics.moveTo.mock.calls.length;
      expect(moveToCount).toBeGreaterThan(5); // Multiple dashes
    });
  });

  describe('preview styling', () => {
    it('should use configured preview color', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 145, true);

      expect(mockGraphics.stroke).toHaveBeenCalledWith({
        width: BOOMERANG_CONFIG.PREVIEW_WIDTH,
        color: BOOMERANG_CONFIG.PREVIEW_COLOR,
      });
    });

    it('should clear previous preview before drawing new one', () => {
      const origin = { x: 100, y: 200 };
      
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory(origin, 145, true);
      const firstClearCall = mockGraphics.clear.mock.calls.length;
      
      trajectoryPreview.updateTrajectory(origin, 160, true);
      const secondClearCall = mockGraphics.clear.mock.calls.length;
      
      expect(secondClearCall).toBe(firstClearCall + 1);
    });
  });

  describe('edge cases', () => {
    it('should handle minimum angle (110°)', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 110, true);
      
      expect(mockGraphics.clear).toHaveBeenCalled();
      expect(mockGraphics.moveTo).toHaveBeenCalled();
      expect(mockGraphics.lineTo).toHaveBeenCalled();
    });

    it('should handle maximum angle (180°)', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 180, true);
      
      expect(mockGraphics.clear).toHaveBeenCalled();
      expect(mockGraphics.moveTo).toHaveBeenCalled();
      expect(mockGraphics.lineTo).toHaveBeenCalled();
    });

    it('should not draw when hidden', () => {
      trajectoryPreview.hide();
      mockGraphics.clear.mockClear();
      mockGraphics.moveTo.mockClear();
      
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 145, true);
      
      // Should not draw anything when hidden
      expect(mockGraphics.moveTo).not.toHaveBeenCalled();
      expect(mockGraphics.visible).toBe(false);
    });
  });

  describe('trajectory points calculation', () => {
    it('should generate correct number of preview points', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 145, true);
      
      // Check total line segments drawn
      const totalSegments = mockGraphics.lineTo.mock.calls.length;
      expect(totalSegments).toBeLessThanOrEqual(BOOMERANG_CONFIG.TRAJECTORY_PREVIEW_POINTS);
    });

    it('should create smooth curve for parabolic trajectory', () => {
      trajectoryPreview.show();
      trajectoryPreview.updateTrajectory({ x: 100, y: 200 }, 110, true); // Use min angle for max curve
      
      // Collect all Y values from both moveTo and lineTo calls (dashed line)
      const moveToYs = mockGraphics.moveTo.mock.calls.map((call: any[]) => call[1]);
      const lineToYs = mockGraphics.lineTo.mock.calls.map((call: any[]) => call[1]);
      
      // For a parabolic arc, at least some Y values should be less than origin Y (200)
      const hasUpwardMovement = [...moveToYs, ...lineToYs].some(y => y < 200);
      
      expect(hasUpwardMovement).toBe(true);
    });
  });
});