import { Game } from './Game';
import "./HanddrawnGraphics";
// @ts-ignore
import { Howl } from 'howler';

async function initializeGame(): Promise<void> {
  try {
    // Import RAPIER - no init() needed for standard version
    const RAPIER = await import('@dimforge/rapier2d');
    
    const game = new Game();
    await game.init(RAPIER);
    
    document.body.appendChild(game.getCanvas());

    const music = new Howl({
      src: ['music.mp3'],
      loop: true,
      volume: 0.5,
    });
    music.play();

  } catch (error) {
    console.error('Failed to initialize game:', error);
    throw error;
  }
}

initializeGame();