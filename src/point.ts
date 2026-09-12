import Grid from './grid';

export default class Point {
	static height = 4;
	static width  = 4;

	public x: number;
	public y: number;
	public z: number;

	public tx: number;
	public ty: number;
	public tz: number;

	public v: number;

	public delay: number;
	public phase_angle: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.v = Math.sqrt(x * x + y * y);
		this.tx = x;
		this.ty = y;
		this.tz = z;
		this.delay = 0;
		this.phase_angle = 0;
	}

	updatePhase(dt: number) {
		this.phase_angle += dt * Grid.kFreq;

		const SIN = Math.sin(this.phase_angle) * Grid.kAmp;

		this.tx = this.x * (1 + SIN);
		this.ty = this.y * (1 + SIN);
		this.tz = this.z - SIN;

		return {
			x: this.tx,
			y: this.ty,
			z: this.tz,
		};
	}
};
