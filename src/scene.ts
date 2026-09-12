import Point                       from "./point";
import type { Vector2D, Vector3D } from "./transform";

export function useScene() {
	const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');

	if (!canvas)
		throw new Error('Canvas is not available');

	const ctx = canvas.getContext('2d');

	let unit_size = 0;
	// let unit_scale = 0.75;
	let unit_scale = 3;

	return {
		ctx,

		// =============================================================================
		// @@@ [ M ] init
		// =============================================================================
		init() {
			canvas.width  = document.body.clientWidth;
			canvas.height = document.body.clientHeight;

			unit_size = Math.min(canvas.width, canvas.height);

			return this;
		},

		// =============================================================================
		// @@@ [ M ] clear
		// =============================================================================
		clear() {
			ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		// =============================================================================
		// @@@ [ M ] pointToScreen
		// =============================================================================
		pointToScreen({ x, y }: Vector2D) {
			return {
				x: (canvas.width  + Math.round(x * unit_size * unit_scale)) >> 1,
				y: (canvas.height + (1 - Math.round(y * unit_size * unit_scale))) >> 1,
			}
		},
		
		// =============================================================================
		// @@@ [ M ] project
		// =============================================================================
		project({x, y, z}: Vector3D) {
			return {
				x: x / z,
				y: y / z,
			}
		},

		// =============================================================================
		// @@@ [ M ] drawPoint
		// =============================================================================
		drawPoint(p: Point, size = 4) {
			if (ctx) {
				ctx.fillStyle = '#ffffff';

				ctx.fillRect(
					p.x - (Point.width  >> 1),
					p.y - (Point.height >> 1),
					size,
					size
				);
			}
		},
	}
};

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

	init() {
		if (this.canvas) {
			this.canvas.width  = document.body.clientWidth;
			this.canvas.height = document.body.clientHeight;

			this.unit_size = Math.min(this.canvas.width, this.canvas.height);
		}
		return this;
	}

	clear() {
		this.canvas && this.ctx && this.ctx.clearRect(
			0, 0, this.canvas.width, this.canvas.height
		);
	}

	pointToScreen({ x, y }: Vector2D) {
		return {
			x: (this.canvas!.width  + Math.round(x * this.unit_size * this.unit_scale)) >> 1,
			y: (this.canvas!.height + (1 - Math.round(y * this.unit_size * this.unit_scale))) >> 1,
		}
	}

	project({x, y, z}: Vector3D) {
		return {
			x: x / z,
			y: y / z,
		}
	}

	drawPoint(p: Point, size: number = 4) {
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
}
