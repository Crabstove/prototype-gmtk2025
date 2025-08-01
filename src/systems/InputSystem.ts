import { InputState, InputActions } from '../types';

export class InputSystem {
  private keys: InputState = {};
  private mouseY: number = 0;
  private initialAimMouseY: number = 0;
  private canvasRect: DOMRect | null = null;
  private canvas: HTMLCanvasElement | null = null;
  
  // Store function references for proper cleanup
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;
  private mousemoveHandler: (e: MouseEvent) => void;
  private resizeHandler: () => void;
  
  constructor() {
    // Bind handlers to maintain references
    this.keydownHandler = (e: KeyboardEvent) => {
      this.keys[e.code] = true;
    };
    
    this.keyupHandler = (e: KeyboardEvent) => {
      this.keys[e.code] = false;
    };
    
    this.mousemoveHandler = (e: MouseEvent) => {
      if (this.canvasRect) {
        this.mouseY = e.clientY - this.canvasRect.top;
      }
    };
    
    this.resizeHandler = () => {
      if (this.canvas) {
        this.canvasRect = this.canvas.getBoundingClientRect();
      }
    };
    
    this.setupListeners();
  }
  
  private setupListeners(): void {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    window.addEventListener('mousemove', this.mousemoveHandler);
  }
  
  public getActions(): InputActions {
    return {
      moveLeft: !!(this.keys['KeyA'] || this.keys['ArrowLeft']),
      moveRight: !!(this.keys['KeyD'] || this.keys['ArrowRight']),
      crouch: !!(this.keys['KeyS'] || this.keys['ControlLeft'] || this.keys['ControlRight'] || this.keys['KeyC'] || this.keys['ArrowDown']),
      action: !!(this.keys['KeyF']),
    };
  }
  
  public setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.canvasRect = canvas.getBoundingClientRect();
    
    // Update rect on window resize
    window.addEventListener('resize', this.resizeHandler);
  }
  
  public getMouseY(): number {
    return this.mouseY;
  }
  
  public setInitialAimMouseY(): void {
    this.initialAimMouseY = this.mouseY;
  }
  
  public getMouseYDeltaFromAimStart(): number {
    return this.initialAimMouseY - this.mouseY; // Positive when mouse moves up
  }
  
  public destroy(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }
}