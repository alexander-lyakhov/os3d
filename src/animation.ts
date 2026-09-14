import { EventList } from './ui';

type AnimationID = number | null;

export default class Animation extends EventList {
	private last_update: number = 0;
	private animation_id: AnimationID = null;

	private firstFrame: (timestamp: number) => void;
	private nextFrame:  (timestamp: number) => void;

	constructor() {
		super();

		this.firstFrame = this.first_frame.bind(this);
		this.nextFrame  = this.next_frame.bind(this);
	}

	start(): void {
		this.animation_id = requestAnimationFrame(this.firstFrame);
	}

	stop(): void {
		cancelAnimationFrame(this.animation_id as number);
	}

	first_frame(timestamp: number): void {
		this.last_update = timestamp;
		this.animation_id = requestAnimationFrame(this.nextFrame);

		this.eventList.init?.call(this, { timestamp });
	}

	next_frame(timestamp: number): void {
		const fps = Math.round(1000 / (timestamp - this.last_update));
		const actual_dt = (timestamp - this.last_update) / 1000;
		const dt = Math.min(actual_dt, .02);

		if (actual_dt > 0.05) {
			console.log('LARGE DT:', actual_dt);
			this.eventList.lag?.call(this, dt);
		}

		this.last_update = timestamp;
		this.animation_id = requestAnimationFrame(this.nextFrame);

		this.eventList.frame?.call(this, { timestamp, dt, fps });
	}
};
