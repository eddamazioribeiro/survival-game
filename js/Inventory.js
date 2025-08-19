export default class Inventory {
	constructor() {
		this.maxColumns = 8;
		this.maxRows = 3;

		this.items = {
			0: { name: 'pickaxe', quantity: 1 },
			1: { name: 'fur', quantity: 5 },
			2: { name: 'stone', quantity: 3 }
		}

		this.addItem({ name: 'health_potion', quantity: 1 });
	}

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
	}
}