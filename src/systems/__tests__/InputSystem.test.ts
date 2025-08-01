import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputSystem } from '../InputSystem';

describe('InputSystem', () => {
  let inputSystem: InputSystem;
  let mockCanvas: HTMLCanvasElement;
  
  beforeEach(() => {
    inputSystem = new InputSystem();
    
    // Mock canvas element
    mockCanvas = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 100,
        left: 200,
        width: 800,
        height: 600,
        right: 1000,
        bottom: 700,
        x: 200,
        y: 100
      })
    } as unknown as HTMLCanvasElement;
  });
  
  afterEach(() => {
    inputSystem.destroy();
    vi.clearAllMocks();
  });
  
  describe('initialization', () => {
    it('should initialize with no keys pressed', () => {
      const actions = inputSystem.getActions();
      expect(actions.moveLeft).toBe(false);
      expect(actions.moveRight).toBe(false);
      expect(actions.crouch).toBe(false);
      expect(actions.action).toBe(false);
    });
    
    it('should have zero mouse Y position initially', () => {
      expect(inputSystem.getMouseY()).toBe(0);
    });
  });
  
  describe('keyboard input', () => {
    it('should detect left movement keys', () => {
      // Test A key
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
      expect(inputSystem.getActions().moveLeft).toBe(true);
      
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));
      expect(inputSystem.getActions().moveLeft).toBe(false);
      
      // Test ArrowLeft key
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
      expect(inputSystem.getActions().moveLeft).toBe(true);
    });
    
    it('should detect right movement keys', () => {
      // Test D key
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
      expect(inputSystem.getActions().moveRight).toBe(true);
      
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }));
      expect(inputSystem.getActions().moveRight).toBe(false);
      
      // Test ArrowRight key
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
      expect(inputSystem.getActions().moveRight).toBe(true);
    });
    
    it('should detect crouch keys', () => {
      const crouchKeys = ['KeyS', 'ControlLeft', 'ControlRight', 'KeyC', 'ArrowDown'];
      
      crouchKeys.forEach(key => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: key }));
        expect(inputSystem.getActions().crouch).toBe(true);
        
        window.dispatchEvent(new KeyboardEvent('keyup', { code: key }));
        expect(inputSystem.getActions().crouch).toBe(false);
      });
    });
    
    it('should detect action key', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' }));
      expect(inputSystem.getActions().action).toBe(true);
      
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' }));
      expect(inputSystem.getActions().action).toBe(false);
    });
    
    it('should handle multiple keys pressed simultaneously', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }));
      
      const actions = inputSystem.getActions();
      expect(actions.moveLeft).toBe(true);
      expect(actions.crouch).toBe(true);
      expect(actions.moveRight).toBe(false);
      expect(actions.action).toBe(false);
    });
  });
  
  describe('mouse input', () => {
    beforeEach(() => {
      inputSystem.setCanvas(mockCanvas);
    });
    
    it('should track mouse Y position', () => {
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 300
      }));
      
      expect(inputSystem.getMouseY()).toBe(200); // 300 - 100 (canvas top)
    });
    
    it('should handle mouse movement without canvas set', () => {
      const newInputSystem = new InputSystem();
      
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 300
      }));
      
      expect(newInputSystem.getMouseY()).toBe(0);
      newInputSystem.destroy();
    });
    
    it('should update canvas rect on window resize', () => {
      const newRect = {
        top: 150,
        left: 250,
        width: 900,
        height: 700,
        right: 1150,
        bottom: 850,
        x: 250,
        y: 150
      };
      
      (mockCanvas.getBoundingClientRect as any).mockReturnValue(newRect);
      
      window.dispatchEvent(new Event('resize'));
      
      // Move mouse to test new rect is used
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 350
      }));
      
      expect(inputSystem.getMouseY()).toBe(200); // 350 - 150 (new canvas top)
    });
  });
  
  describe('aim mouse tracking', () => {
    beforeEach(() => {
      inputSystem.setCanvas(mockCanvas);
    });
    
    it('should capture initial aim mouse Y position', () => {
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 400
      }));
      
      inputSystem.setInitialAimMouseY();
      
      expect(inputSystem.getMouseYDeltaFromAimStart()).toBe(0);
    });
    
    it('should calculate positive delta when mouse moves up', () => {
      // Set initial position
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 400
      }));
      inputSystem.setInitialAimMouseY();
      
      // Move mouse up
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 300
      }));
      
      expect(inputSystem.getMouseYDeltaFromAimStart()).toBe(100); // Positive when moving up
    });
    
    it('should calculate negative delta when mouse moves down', () => {
      // Set initial position
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 400
      }));
      inputSystem.setInitialAimMouseY();
      
      // Move mouse down
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientY: 500
      }));
      
      expect(inputSystem.getMouseYDeltaFromAimStart()).toBe(-100); // Negative when moving down
    });
  });
  
  describe('cleanup', () => {
    it('should remove event listeners on destroy', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      inputSystem.destroy();
      
      // Should attempt to remove all event listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});