import { Game } from './Game';
import "./HanddrawnGraphics";

async function initializeGame(): Promise<void> {
  try {
    // Import RAPIER - no init() needed for standard version
    const RAPIER = await import('@dimforge/rapier2d');
    
    const game = new Game();
    await game.init(RAPIER as any);
    
    document.body.appendChild(game.getCanvas());
  } catch (error) {
    console.error('Failed to initialize game:', error);
    throw error;
  }
}

initializeGame();