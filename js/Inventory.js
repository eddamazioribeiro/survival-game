export default class Inventory {
	constructor() {
		this.items = {
			0: { name: 'pickaxe', quantity: 1 },
			1: { name: 'stone', quantity: 3 }
		}
	}

	getItem(index) {
		return this.items[index];
	}
}