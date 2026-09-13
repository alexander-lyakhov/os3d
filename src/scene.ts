import Point                       from "./point";
import type { Vector2D, Vector3D } from "./transform";

export default class Scene {
	public canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
	public ctx:    CanvasRenderingContext2D | null;

	private unit_size:  number = 0;
	private unit_scale: number = 3;

	constructor() {
		if (!this.canvas)
			throw new Error('Canvas is not available');

		this.ctx = this.canvas.getContext('2d');
	}

	init(): Scene {
		if (this.canvas) {
			this.canvas.width  = document.body.clientWidth;
			this.canvas.height = document.body.clientHeight;

			this.unit_size = Math.min(this.canvas.width, this.canvas.height);
		}
		return this;
	}

	clear(): void {
		this.canvas && this.ctx && this.ctx.clearRect(
			0, 0, this.canvas.width, this.canvas.height
		);
	}

	pointToScreen({ x, y }: Vector2D): Vector2D {
		return {
			x: (this.canvas!.width  + Math.round(x * this.unit_size * this.unit_scale)) >> 1,
			y: (this.canvas!.height + (1 - Math.round(y * this.unit_size * this.unit_scale))) >> 1,
		}
	}

	project({x, y, z}: Vector3D): Vector2D {
		return {
			x: x / z,
			y: y / z,
		}
	}

	drawPoint(p: Vector2D, size: number = 4): void {
		if (this.ctx) {
			this.ctx.fillStyle = '#ffffff';

			this.ctx.fillRect(
				p.x - (Point.width  >> 1),
				p.y - (Point.height >> 1),
				size,
				size
			);
		}
	}
};
