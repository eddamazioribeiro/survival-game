
import items from './Items.js';

export default class Crafting {
	constructor(data) {
		let { mainScene } = data;
		
		this.mainScene = mainScene;
		this.inventory = mainScene.player.inventory;
		this.player = mainScene.player;
		this.selected = 0;
		this.items = [];
	}

	updateItems() {
		this.items = [];
		let craftables = Object.keys(items).filter(i => !!items[i].materials);

		for (let i = 0; i < craftables.length; i++) {
			const itemName = craftables[i];
			const materials = items[itemName].materials;

			let lastMat = '';
			let matDetails = [];
			let canCraft = true;
			let qty = 0;

			materials.forEach(m => {
				qty = (lastMat === m) ? qty - 1 : this.inventory.getItemQuantity(m);
				let available = (qty > 0);
				matDetails.push({ name: m, frame: items[m].frame, available });
				lastMat = m;

				if (!available) canCraft = false;
			});

			this.items.push({ name: itemName, frame: items[itemName].frame, matDetails, canCraft });
		}
	}
}
