import items from './Items.js';

export default class Inventory {
	constructor() {
		this.maxColumns = 8;
		this.maxRows = 3;
		this.selected = 0;
		this.observers = [];
		this.dragging = false;
		this.items = {
			0: { name: 'pickaxe', quantity: 1 }
		}
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
					this.items[i] = item;
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

	dropItem(item, coordinates) {
		console.log('dropItem', { item, coordinates });
		// to drop a new item in the pointer coordinates
		// new DropItem({
		// 	name: item.name,
		// 	frame: item.frame,
		// 	scene: this.mainScene,
		// 	x: coordinates.x,
		// 	y: coordinates.y,
		// });

		// removeitem(item.name)
		// this.broadcast();

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