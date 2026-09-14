// = ============================================================================
// @@@ class EventList
// =============================================================================
type EventHandler = (e: any) => any;

type EventListType = {
	[key: string]: EventHandler;
};

export type EventData = {
	action: string;
	index:  number;
};

export class EventList {
	protected eventList: EventListType;
	constructor() {
		this.eventList = {};
	}

	on(eventName: string, callback:EventHandler): EventList {
		this.eventList[eventName] = callback;
		return this;
	}	
};

// =============================================================================
// @@@ class UIComponent
// =============================================================================
export class UIComponent extends EventList {
	protected el: HTMLElement | null;

	constructor(componentName: string, selector: string) {
		super();

		this.el = document.querySelector(selector);

		if (!this.el)
			throw new Error(`-[ ${componentName} ]- Selector is invalid or not provided`);
	}
};

// =============================================================================
// @@@ class Block
// =============================================================================
class Block extends UIComponent {
	constructor(selector: string) {
		super('Block', selector);
	}

	show(): void {
		this.el && this.el.classList.remove('is-hidden');
	}

	hide(): void {
		this.el && this.el.classList.add('is-hidden');
	}

	toggle(isVisible: boolean): void {
		isVisible ? this.show() : this.hide();
	}
};

// =============================================================================
// @@@ class Panel
// =============================================================================
export class Panel extends Block {
	constructor(selector: string) {
		super(selector);
	}
};

// =============================================================================
// @@@ class ToggleButton
// =============================================================================
class ToggleButton extends UIComponent {
	private is_selected: boolean = false;
	private toggleSelect: () => void;

	constructor(selector: string) {
		super('ToggleButton', selector);

		this.toggleSelect = this.toggle.bind(this);
		this.el!.addEventListener("click", this.toggleSelect);
	}

	toggle(): void {
		this.is_selected = !this.is_selected;

		this.is_selected
			? this.el!.classList.add("selected")
			: this.el!.classList.remove("selected");

		this.eventList.toggle && this.eventList.toggle(this.is_selected);
	}

	get isSelected(): boolean {
		return this.is_selected;
	}

	set isSelected(value: boolean) {
		this.is_selected = value;
		this.eventList.toggle && this.eventList.toggle(this.is_selected);
	}
};

// =============================================================================
// @@@ class ButtonGroup
// =============================================================================
class ButtonGroup extends UIComponent {
	private buttons: HTMLButtonElement[];

	constructor(selector: string, selectedIndex: number = 0) {
		super('ButtonGroup', selector);

		this.buttons = [...this.el!.querySelectorAll(`button`)];

		if (this.buttons[selectedIndex]) {
			this.buttons[selectedIndex].classList.add('selected');
		}

		this.el!.addEventListener('click', (e) => {
			this.deselect();

			const target = e.target as HTMLElement;
			const button = target.closest('button') as HTMLElement;

			button.classList.add('selected');

			if (this.eventList.change && button.dataset.action) {
				this.eventList.change({
					action: button.dataset.action,
					index:  this.selectedIndex,
				});
			}
		})
	};

	get selectedIndex(): number {
		let index = this.buttons.findIndex(el => el.classList.contains('selected'));
		
		if (index === -1)
			index = 0;

		return index;
	}

	set selectedIndex(index: number) {
		this.deselect();
		this.buttons[index] && this.buttons[index].classList.add('selected');
	}

	deselect(): void {
		this.buttons.forEach(el =>
			el.classList.remove('selected')
		);
	}
};

// =============================================================================
// @@@ class Checkbox
// =============================================================================
export class Checkbox extends UIComponent {
	private checkbox: HTMLInputElement | null;
	private on_change: () => void;

	constructor(selector: string, isChecked: boolean = false) {
		super('Checkbox', selector);
		
		this.el!.innerHTML = `<input type="checkbox" ${ isChecked && 'checked' } />`;
		this.checkbox = this.el!.querySelector('input[type=checkbox]');

		this.on_change = this.onChange.bind(this);
		this.on_change();

		if (this.checkbox)
			this.checkbox.addEventListener('change', this.on_change);
	}

	get isChecked(): boolean {
		return this.checkbox!.checked;
	}

	set isChecked(value: boolean) {
		 this.checkbox!.checked = value;
	}

	onChange(): void {
		this.eventList.change?.call(this, {
			action: this.el!.dataset.action,
			value:  this.checkbox!.checked,
		});
	}
};

// =============================================================================
// @@@ class FPS
// =============================================================================
export class FPS extends UIComponent {
	constructor(selector: string) {
		super('FPS', selector)
	}

	set value(fps_value: number) {
		this.el!.textContent = `FPS: ${fps_value}`;
	}
};

// =============================================================================
// @@@ class Settings
// =============================================================================
export class Settings extends EventList {
	private is_open: boolean;
	
	public btnSettings: ToggleButton;
	public panel: Panel;
	public groupPresets: ButtonGroup;
	public groupDimensions: ButtonGroup;
	public groupPerspective: ButtonGroup;
	public cbVertex: Checkbox;
	public cbMesh: Checkbox;
	public cbRotation: Checkbox;

	constructor(cfg = {isOpen: false}) {
		super();

		this.is_open = cfg.isOpen;

		this.btnSettings      = new ToggleButton("#btn-settings");
		this.panel            = new Panel('.panel');

		this.groupPresets     = new ButtonGroup('.button-group--presets', 0);
		this.groupDimensions  = new ButtonGroup('.button-group--dimensions', 1);
		this.groupPerspective = new ButtonGroup('.button-group--perspective', 0);

		this.cbVertex         = new Checkbox('#cb-vertex',   true);
		this.cbMesh           = new Checkbox('#cb-mesh',     false);
		this.cbRotation       = new Checkbox('#cb-rotation', false);

		this.btnSettings.on('toggle', (e) => this.panel.toggle(e));

		this.btnSettings.isSelected = this.is_open;
		this.bindEvents();
	}

	bindEvents(): void {
		this.groupPresets    .on('change', (e) => this.eventList.change?.call(this, e));
		this.groupDimensions .on('change', (e) => this.eventList.change?.call(this, e));
		this.groupPerspective.on('change', (e) => this.eventList.change?.call(this, e));

		this.cbVertex  .on('change', (e) => this.eventList.change?.call(this, e));
		this.cbMesh    .on('change', (e) => this.eventList.change?.call(this, e));
		this.cbRotation.on('change', (e) => this.eventList.change?.call(this, e));
	}
};
