import Transform from "./transform";
import Point     from "./point";
import Scene     from "./scene";

type GridConfig = {
	kDelay?: number;
	kFreq?: number;
	kAmp?: number;
};

type ToggleValue = Boolean | undefined;

export default class Grid extends Transform {
	static xcount = 41;
	static ycount = 41;

	static kDelay = 1500;
	static kFreq  = 8;
	static kAmp   = 0.05;

	private kx_distribution: number;
	private ky_distribution: number;

	public isVertexVisible: Boolean = true;
	public isMeshVisible: Boolean = false;
	public isFlat: Boolean = true;
	public isRotating: Boolean = false;

	public data: Point[];
	public mesh: Point[];

	public spin_x = Math.PI / 2;
	public spin_y = 0;
	public spin_z = 0;

	// =============================================================================
	// @@@ [ M ] constructor
	// =============================================================================
	constructor() {
		super(0, 0, 4);

		this.data = [];
		this.mesh = [];

		this.kx_distribution = Grid.xcount / (Grid.xcount - 1);
		this.ky_distribution = Grid.ycount / (Grid.ycount - 1);
	}

	// =============================================================================
	// @@@ [ M ] init
	// =============================================================================
	init(cfg: GridConfig = {}) {
		Grid.kDelay = cfg.kDelay || Grid.kDelay;
		Grid.kFreq  = cfg.kFreq  || Grid.kFreq;
		Grid.kAmp   = cfg.kAmp   || Grid.kAmp;

		this.data.length = 0;
		this.mesh.length = 0;;

		for (let y = 0; y < Grid.ycount; y++) {
			for (let x = 0; x < Grid.xcount; x++) {
				this.data.push(new Point(
					x / Grid.xcount * this.kx_distribution * 2 - 1,
					y / Grid.ycount * this.ky_distribution * 2 - 1,
					0
				))
			}
		}

		this.#createMesh();
	}

	// =============================================================================
	// @@@ [ M ] #getPoint
	// =============================================================================
	#getPoint(x: number, y: number) {
		const index = y * Grid.xcount + x;
		return this.data[index]
	}

	// =============================================================================
	// @@@ [ M ] #createMesh
	// =============================================================================
	#createMesh() {
		for (let col = 0; col < Grid.xcount - 1; col++)
		{
			// ----------------------------------------------------
			// from bottom to top
			// ----------------------------------------------------
			for (let row = Grid.ycount - 1; row >= 0; row--) {
				this.mesh.push(this.#getPoint(col, row));
			}

			// ----------------------------------------------------
			// ledder from top to bottom
			// ----------------------------------------------------
			for (let row = 0; row < Grid.ycount - 1; row++) {
				this.mesh.push(this.#getPoint(col + 1, row));
				this.mesh.push(this.#getPoint(col, row + 1));
			}

			// -----------------------------------------------------------
			// one step from bottom to the right
			// -----------------------------------------------------------
			this.mesh.push(this.#getPoint(col + 1, Grid.ycount - 1));
		}

		// -----------------------------------------------------------
		// from bottom to the top on very RIGHT column
		// -----------------------------------------------------------
		for (let row = Grid.ycount - 1; row >= 0; row--) {
			this.mesh.push(this.#getPoint(Grid.xcount - 1, row));
		}
	}

	// =============================================================================
	// @@@ [ M ] renderMesh
	// =============================================================================
	renderMesh(scene: Scene, color: string) {
		scene.ctx!.beginPath();
		scene.ctx!.strokeStyle = color;
		scene.ctx!.lineWidth = 1;

		const pos = scene.pointToScreen(
			scene.project({
				x: this.mesh[0].tx,
				y: this.mesh[0].ty,
				z: this.mesh[0].tz,
			})
		);
		scene.ctx!.moveTo(pos.x, pos.y);

		for (let i = 1; i < this.mesh.length; i++)
		{
			const pos = scene.pointToScreen(
				scene.project({
					x: this.mesh[i].tx,
					y: this.mesh[i].ty,
					z: this.mesh[i].tz,
				})
			);
			scene.ctx!.lineTo(pos.x, pos.y);
		}
		scene.ctx!.stroke();
	}

	// =============================================================================
	// @@@ [ M ] toggleVertex
	// =============================================================================
	toggleVertex(value: ToggleValue = undefined) {
		if (value === undefined)
			this.isVertexVisible = !this.isVertexVisible;
		else
			this.isVertexVisible = value;
	}

	// =============================================================================
	// @@@ [ M ] toggleMesh
	// =============================================================================
	toggleMesh(value: ToggleValue = undefined) {
		if (value === undefined)
			this.isMeshVisible = !this.isMeshVisible;
		else
			this.isMeshVisible = value;
	}

	// =============================================================================
	// @@@ [ M ] toggle1D
	// =============================================================================
	toggle1D() {
		this.isFlat = false;
		this.spin_x = Math.PI;
	}

	// =============================================================================
	// @@@ [ M ] toggle2D
	// =============================================================================
	toggle2D() {
		this.isFlat = true;
		this.spin_x = -Math.PI / 2;
	}

	// =============================================================================
	// @@@ [ M ] toggle3D
	// =============================================================================
	toggle3D() {
		this.isFlat = false;
		this.spin_x = -Math.PI / 6;
	}

	// =============================================================================
	// @@@ [ M ] toggleRotate
	// =============================================================================
	toggleRotate(value: ToggleValue = undefined) {
		if (value === undefined)
			this.isRotating = !this.isRotating;
		else
			this.isRotating = value;
	}

	// =============================================================================
	// @@@ [ M ] toggle45Deg
	// =============================================================================
	toggle45Deg() {
		this.isRotating = false;
		this.spin_y = this.spin_y ? 0 : Math.PI / 4;
	}

	// =============================================================================
	// @@@ [ M ] set0Deg
	// =============================================================================
	set0Deg() {
		this.isRotating = false;
		this.rotation_y = 0;
	}

	// =============================================================================
	// @@@ [ M ] set45Deg
	// =============================================================================
	set45Deg() {
		this.isRotating = false;
		this.rotation_y = Math.PI / 4;
	}
};
