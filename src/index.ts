import './styles/index.scss'
import { Settings } from './ui';
import Grid from './grid';
import Scene from './scene';
import Animation from './animation';

const config = [
	{
		kDelay: 1500,
		kFreq:  8,
		kAmp:   0.05,
	},

	{
		kDelay: 4000,
		kFreq:  8,
		kAmp:   0.025,
	},
	
	{
		kDelay: 1000,
		kFreq:  2,
		kAmp:   0.2,
	},
	
	{
		kDelay: 2500,
		kFreq:  2,
		kAmp:   0.5,
	},
];

// =============================================================================
// @@@ [ M ] useApp
// =============================================================================
window.app = (function useApp() {
	const scene     = new Scene();
	const grid      = new Grid();
	const animation = new Animation();
	const settings  = new Settings({ isOpen: false })

	scene.init();
	grid.init(config[0]);
	animation.start();

	grid[['toggle1D', 'toggle2D', 'toggle3D'][settings.groupDimensions.selectedIndex]]();
	grid[['set0Deg', 'set45Deg'][settings.groupPerspective.selectedIndex]]();

	grid.toggleVertex(settings.cbVertex.isChecked);
	grid.toggleMesh(settings.cbMesh.isChecked);
	grid.toggleRotate(settings.cbRotation.isChecked);

	const _this = {
		grid,

		reset(cfg = {}) {
			animation.stop();
			grid.init(cfg);
			scene.init();
			animation.start();
		},
	}

	window.addEventListener('resize', _this.reset);

	window.addEventListener('keydown', (e) => {
		if (e.keyCode >= 49 && e.keyCode <= 52) {
			_this.reset(config[e.keyCode - 49]);
			settings.groupPresets.selectedIndex = e.keyCode - 49;
		}

		if (e.code === 'KeyT') {
			settings.btnSettings.toggle();
		}

		if (e.code === 'KeyQ') {
			grid.toggle1D();
			settings.groupDimensions.selectedIndex = 0;
		}

		if (e.code === 'KeyW') {
			grid.toggle2D();
			settings.groupDimensions.selectedIndex = 1;
		}

		if (e.code === 'KeyE') {
			grid.toggle3D();
			settings.groupDimensions.selectedIndex = 2;
		}

		if (e.code === 'KeyA') {
			grid.set0Deg();
			settings.groupPerspective.selectedIndex = 0;
			settings.cbRotation.isChecked = false;
		}

		if (e.code === 'KeyS') {
			grid.set45Deg();
			settings.groupPerspective.selectedIndex = 1;
			settings.cbRotation.isChecked = false;
		}

		if (e.code === 'KeyV') {
			grid.toggleVertex();
			settings.cbVertex.isChecked = !settings.cbVertex.isChecked;
		}

		if (e.code === 'KeyM') {
			grid.toggleMesh();
			settings.cbMesh.isChecked = !settings.cbMesh.isChecked;
		}

		if (e.code === 'KeyR') {
			grid.toggleRotate();
			settings.cbRotation.isChecked = !settings.cbRotation.isChecked;
			settings.groupPerspective.deselect();
		}
	});

	animation.on('init', ({ timestamp }) => {
		grid.data.forEach(el => {
			el.delay = timestamp + el.v * Grid.kDelay;
		})
	});
	
	animation.on('frame', ({ timestamp, dt }) => {
		scene.clear();

		if (grid.isRotating) {
			grid.rotation_y += dt * 0.2;
		}

		grid.data.forEach((el) => {
			let p = {
				x: el.x,
				y: el.y,
				z: el.z,
			};

			if (el.delay < timestamp) {
				p = el.updatePhase(dt)
			}

			if (!grid.isFlat) { // 2D
				p.x = el.x;
				p.y = el.y;
			}
			else { // NOT 2d
				p.z = el.z;
			}

			p = grid.rotateYZ(p, -Math.PI / 2);
			p = grid.rotateXZ(p, grid.rotation_y);
			p = grid.rotateYZ(p, grid.spin_x);

			grid.isVertexVisible && scene.drawPoint(
				scene.pointToScreen(
					scene.project({
						x: p.x + grid.x,
						y: p.y + grid.y,
						z: p.z + grid.z,
					})
				)
			)

			el.tx = p.x + grid.x;
			el.ty = p.y + grid.y;
			el.tz = p.z + grid.z;
		})

		grid.isMeshVisible && grid.renderMesh(scene, grid.isVertexVisible ? '#e0e0e0' : '#ffffff');
	});

	settings.on('change', (e) => {
		e.action === 'reset'
			? _this.reset(config[e.index])
			: grid[e.action] && grid[e.action]();

		if (e.action === 'set0Deg' || e.action === 'set45Deg') {
			settings.cbRotation.isChecked = false;
		}

		if (settings.cbRotation.isChecked) {
			settings.groupPerspective.deselect();
		}
	})

	return _this;

})();
