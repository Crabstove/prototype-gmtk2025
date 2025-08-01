import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimeSlowEffect } from './TimeSlowEffect';
import { TIME_SLOW_CONFIG, GAME_CONFIG } from '../constants';
import * as PIXI from 'pixi.js';

// Mock PIXI
vi.mock('pixi.js', () => {
  const createMockGraphics = () => ({
    clear: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    circle: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
    visible: false,
    alpha: 0,
    x: 0,
    y: 0,
  });

  const createMockContainer = () => ({
    addChild: vi.fn(),
    removeChild: vi.fn(),
    children: [],
    zIndex: 0,
  });

  return {
    Graphics: vi.fn(() => createMockGraphics()),
    Container: vi.fn(() => createMockContainer()),
  };
});

describe('TimeSlowEffect', () => {
  let timeSlowEffect: TimeSlowEffect;
  let mockContainer: any;
  let mockOverlay: any;
  let mockVignette: any;
  let mockParticleContainer: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer = {
      addChild: vi.fn(),
      removeChild: vi.fn(),
    };
    
    timeSlowEffect = new TimeSlowEffect(mockContainer);
    // Access the actual internal properties
    mockOverlay = timeSlowEffect['overlay'];
    mockVignette = timeSlowEffect['vignette'];
    mockParticleContainer = timeSlowEffect['effectContainer'];
  });

  describe('initialization', () => {
    it('should create overlay with correct properties', () => {
      // The overlay drawing happens in drawEffects which is called on startTimeSlow
      expect(mockOverlay).toBeDefined();
      expect(mockOverlay.visible).toBe(false);
      expect(mockOverlay.alpha).toBe(0);
    });

    it('should create vignette effect', () => {
      // The vignette drawing happens in drawEffects which is called on startTimeSlow
      expect(mockVignette).toBeDefined();
      expect(mockVignette.visible).toBe(false);
      expect(mockVignette.alpha).toBe(0);
    });

    it('should add effect container to main container', () => {
      // The effectContainer is added to the main container
      expect(mockContainer.addChild).toHaveBeenCalledWith(mockParticleContainer);
    });

    it('should create particles when time slow starts', () => {
      // Particles are created on startTimeSlow, not in constructor
      expect(timeSlowEffect['particles'].length).toBe(0);
      
      timeSlowEffect.startTimeSlow();
      expect(timeSlowEffect['particles'].length).toBe(TIME_SLOW_CONFIG.PARTICLE_DENSITY);
    });
  });

  describe('time slow activation', () => {
    it('should start time slow effect', () => {
      timeSlowEffect.startTimeSlow();
      
      expect(timeSlowEffect.getIsActive()).toBe(true);
      // The drawEffects method is called which draws on the graphics
      expect(mockOverlay.rect).toHaveBeenCalled();
      expect(mockVignette.rect).toHaveBeenCalled();
    });

    it('should stop time slow effect', () => {
      timeSlowEffect.startTimeSlow();
      timeSlowEffect.stopTimeSlow();
      
      expect(timeSlowEffect.getIsActive()).toBe(false);
    });

    it('should handle multiple start calls', () => {
      timeSlowEffect.startTimeSlow();
      const firstAlpha = timeSlowEffect['targetAlpha'];
      
      timeSlowEffect.startTimeSlow();
      const secondAlpha = timeSlowEffect['targetAlpha'];
      
      expect(firstAlpha).toBe(secondAlpha);
      expect(timeSlowEffect.getIsActive()).toBe(true);
    });
  });

  describe('visual transitions', () => {
    it('should fade in overlay when starting', () => {
      timeSlowEffect.startTimeSlow();
      
      // Simulate multiple update frames
      for (let i = 0; i < 30; i++) {
        timeSlowEffect.update(1/60);
      }
      
      expect(mockOverlay.alpha).toBeGreaterThan(0);
      expect(mockOverlay.alpha).toBeLessThanOrEqual(TIME_SLOW_CONFIG.OVERLAY_ALPHA);
    });

    it('should fade out overlay when stopping', () => {
      timeSlowEffect.startTimeSlow();
      
      // Let it fade in
      for (let i = 0; i < 30; i++) {
        timeSlowEffect.update(1/60);
      }
      
      timeSlowEffect.stopTimeSlow();
      
      // Let it fade out
      for (let i = 0; i < 30; i++) {
        timeSlowEffect.update(1/60);
      }
      
      expect(mockOverlay.alpha).toBeLessThan(TIME_SLOW_CONFIG.OVERLAY_ALPHA);
    });

    it('should fade vignette with different alpha', () => {
      timeSlowEffect.startTimeSlow();
      
      for (let i = 0; i < 30; i++) {
        timeSlowEffect.update(1/60);
      }
      
      expect(mockVignette.alpha).toBeGreaterThan(0);
      expect(mockVignette.alpha).toBeLessThanOrEqual(TIME_SLOW_CONFIG.VIGNETTE_ALPHA);
    });

    it('should hide elements when fully faded out', () => {
      timeSlowEffect.startTimeSlow();
      timeSlowEffect.stopTimeSlow();
      
      // Simulate many frames to ensure full fade out
      for (let i = 0; i < 100; i++) {
        timeSlowEffect.update(1/60);
      }
      
      // Elements should be fully transparent
      expect(mockOverlay.alpha).toBe(0);
      expect(mockVignette.alpha).toBe(0);
    });
  });

  describe('particle animation', () => {
    beforeEach(() => {
      timeSlowEffect.startTimeSlow();
    });

    it('should update particle positions', () => {
      const particles = timeSlowEffect['particles'];
      
      if (particles.length > 0) {
        const initialY = particles[0].sprite.y;
        
        // Update multiple times
        for (let i = 0; i < 10; i++) {
          timeSlowEffect.update(1/60);
        }
        
        expect(particles[0].sprite.y).not.toBe(initialY);
      }
    });

    it('should wrap particles when they go off screen', () => {
      const particles = timeSlowEffect['particles'];
      
      if (particles.length > 0) {
        // Force a particle to the top (need to update the actual particle, not just sprite)
        particles[0].y = -11; // Below the -10 threshold
        
        timeSlowEffect.update(1/60);
        
        // Should wrap to bottom
        expect(particles[0].y).toBeGreaterThan(600);
      }
    });

    it('should apply sine wave horizontal movement', () => {
      const particles = timeSlowEffect['particles'];
      
      if (particles.length > 0) {
        const initialX = particles[0].sprite.x;
        
        // Update multiple times to see movement
        for (let i = 0; i < 60; i++) {
          timeSlowEffect.update(1/60);
        }
        
        // X position should change due to sine wave movement
        expect(particles[0].sprite.x).not.toBe(initialX);
      }
    });

    it('should only animate particles when active', () => {
      const particles = timeSlowEffect['particles'];
      
      if (particles.length > 0) {
        const initialY = particles[0].sprite.y;
        
        timeSlowEffect.stopTimeSlow();
        
        // Update while inactive
        for (let i = 0; i < 10; i++) {
          timeSlowEffect.update(1/60);
        }
        
        // Particles should have been cleared when stopped
        expect(timeSlowEffect['particles'].length).toBe(0);
      }
    });
  });

  describe('performance', () => {
    it('should use transition speed for smooth fading', () => {
      timeSlowEffect.startTimeSlow();
      
      const deltaTime = 1/60;
      
      // Update once to see alpha change
      timeSlowEffect.update(deltaTime);
      
      // Alpha should be > 0 after starting time slow
      expect(mockOverlay.alpha).toBeGreaterThan(0);
    });

    it('should clamp alpha values', () => {
      timeSlowEffect.startTimeSlow();
      
      // Update many times to ensure we hit the target
      for (let i = 0; i < 200; i++) {
        timeSlowEffect.update(1/60);
      }
      
      // Alpha should be between 0 and the max overlay alpha
      expect(mockOverlay.alpha).toBeLessThanOrEqual(TIME_SLOW_CONFIG.OVERLAY_ALPHA);
      expect(mockOverlay.alpha).toBeGreaterThanOrEqual(0);
    });
  });

  describe('particle generation', () => {
    it('should create particles with unique positions', () => {
      timeSlowEffect.startTimeSlow();
      const particles = timeSlowEffect['particles'];
      
      // Check that particles have different positions
      const positions = new Set(particles.map(p => `${p.x},${p.y}`));
      
      // Most particles should have unique positions (allow some overlap)
      expect(positions.size).toBeGreaterThan(TIME_SLOW_CONFIG.PARTICLE_DENSITY * 0.8);
    });

    it('should create particles within screen bounds', () => {
      timeSlowEffect.startTimeSlow();
      const particles = timeSlowEffect['particles'];
      
      particles.forEach(particle => {
        expect(particle.x).toBeGreaterThanOrEqual(0);
        expect(particle.x).toBeLessThanOrEqual(GAME_CONFIG.WIDTH);
        
        expect(particle.y).toBeGreaterThanOrEqual(0);
        expect(particle.y).toBeLessThanOrEqual(GAME_CONFIG.HEIGHT);
      });
    });
  });
});