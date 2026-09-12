import Point from './point'

export type Vector2D = {
	x: number;
	y: number;
};

export type Vector3D = {
	x: number;
	y: number;
	z: number;
};

export default class Transform {
	public x: number;
	public y: number;
	public z: number;

	public rotation_x: number;
	public rotation_y: number;
	public rotation_z: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.rotation_x = 0;
		this.rotation_y = 0;
		this.rotation_z = 0;
	}

	// =============================================================================
	// @@@ [ M ] rotateXY
	// =============================================================================
	rotateXY(p: Vector3D, angle: number) {
		this.rotation_z = angle;

		const s = -Math.sin(angle);
		const c = -Math.cos(angle);

		const x = p.x * c - p.y * s;
		const y = p.x * s + p.y * c;

		return {x, y, z: p.z};
	}
	
	// =============================================================================
	// @@@ [ M ] rotateXZ
	// =============================================================================
	rotateXZ(p: Point, angle: number): Vector3D {
		this.rotation_y = angle;

		const s = -Math.sin(angle);
		const c = -Math.cos(angle);

		const x = p.x * c - p.z * s;
		const z = p.x * s + p.z * c;

		return {x, y: p.y, z};
	}

	// =============================================================================
	// @@@ [ M ] rotateYZ
	// =============================================================================
	rotateYZ(p: Point, angle: number) {
		this.rotation_x = angle;

		const s = -Math.sin(angle);
		const c = -Math.cos(angle);

		const y = p.y * c - p.z * s;
		const z = p.y * s + p.z * c;

		return {x: p.x, y, z};
	}
};
