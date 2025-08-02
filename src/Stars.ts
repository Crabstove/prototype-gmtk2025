import * as PIXI from 'pixi.js';

export class Stars {
	public readonly graphics: PIXI.Graphics;

	constructor(graphics: PIXI.Graphics) {
		this.graphics = graphics;
	}

	public draw() {
		let min = -10000;
		let max = 10000;
		for(let i = 0; i < 50000; i++) {
			const x = Math.random() * (max - min) + min;
			const y = Math.random() * (max - min) + min;
			const size = Math.random() * 1 + 0.5;
			this.graphics.circle(x, y, size).fill(0xffffff);
		}
	}
}