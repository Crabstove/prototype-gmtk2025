import { InputActions } from '../types';

// Global state for input tracking
const keys: Record<string, boolean> = {};
let mouseY = 0;
let initialAimMouseY = 0;
let canvasRect: DOMRect | null = null;

// Setup event listeners once
function setupListeners(): void {
  window.addEventListener('keydown', (e) => { keys[e.code] = true; });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
  window.addEventListener('mousemove', (e) => {
    if (canvasRect) {
      mouseY = e.clientY - canvasRect.top;
    }
  });
  window.addEventListener('resize', () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRect = canvas.getBoundingClientRect();
    }
  });
}

// Initialize on module load
setupListeners();

export function setCanvas(canvas: HTMLCanvasElement): void {
  canvasRect = canvas.getBoundingClientRect();
}

export function getInputActions(): InputActions {
  return {
    moveLeft: !!(keys['KeyA'] || keys['ArrowLeft']),
    moveRight: !!(keys['KeyD'] || keys['ArrowRight']),
    crouch: !!(keys['KeyS'] || keys['ControlLeft'] || keys['ControlRight'] || keys['KeyC'] || keys['ArrowDown']),
    action: !!(keys['KeyF']),
  };
}

export function getMouseY(): number {
  return mouseY;
}

export function setInitialAimMouseY(): void {
  initialAimMouseY = mouseY;
}

export function getMouseYDeltaFromAimStart(): number {
  return initialAimMouseY - mouseY; // Positive when mouse moves up
}