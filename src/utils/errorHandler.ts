export class GameError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'GameError';
  }
}

export function handleError(error: unknown): void {
  if (error instanceof GameError) {
    console.error(`[${error.code}] ${error.message}`);
  } else if (error instanceof Error) {
    console.error('Unexpected error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}