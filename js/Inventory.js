import items from './Items.js';
import DropItem from './DropItem.js';

export default class Inventory {
	constructor(data) {
		const { scene } = data;

		this.mainScene = scene;
		this.maxColumns = 8;
		this.maxRows = 3;
		this.selected = 0;
		this.observers = [];
		this.dragging = false;
		this.items = {}

		this.addItem({ name: 'pickaxe', quantity: 1 });
	}

	get selectedItem() {
		return this.items[this.selected];
	}

	subscribe = (fn) => { this.observers.push(fn) }

	unsubscribe = (fn) => { this.observers.filter(subscriber =>  subscriber !== fn) }

	broadcast = () => { this.observers.forEach(subscriber => subscriber()) }

	addItem(item) {
		let existingKey = Object.keys(this.items).find(key => this.items[key].name === item.name);

		if (existingKey) {
			this.items[existingKey].quantity += item.quantity;
		} else {
			for (let i = 0; i < this.maxColumns * this.maxRows; i++) {
				let existingItem = this.items[i];
				
				if (!existingItem) {
					this.items[i] = { ...item, frame: items[item.name].frame };
					break;
				}
			}
		}

		this.broadcast();
	}

	getItem(index) {
		return this.items[index];
	}

	moveItem(start, end) {
		if (start === end) return;

		let item = this.items[end];

		this.items[end] = this.items[start];
		delete this.items[start];
		
		if (item) this.items[start] = item;

		this.selected = end;
		this.broadcast();
	}

	removeItem(itemName) {
		let existingKey = Object.keys(this.items).find(key => this.items[key].name === itemName);

		if (existingKey) {
			this.items[existingKey].quantity--;

			if (this.items[existingKey].quantity <= 0) delete this.items[existingKey];
		}

		this.broadcast();
	}

	dropItem(item, { x, y}) {
		for (let i = 0; i < item.quantity; i++) {
			new DropItem({
				name: item.name,
				frame: item.frame,
				scene: this.mainScene,
				x: x ,
				y: y
			});

			this.removeItem(item.name)
		}

		this.broadcast();
	}

	getItemFrame(item) {
		return items[item.name].frame;
	}

	getItemQuantity(itemName) {
		return Object.values(this.items)
			.filter(i => i.name === itemName)
			.map(i => i.quantity)
			.reduce((acc, currVal) => acc + currVal, 0); // defaults to 0 if undefined
	}
}