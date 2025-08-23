
import items from './Items.js';
import DropItem from './DropItem.js';

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

	craft() {
		let item = this.items[this.selected];

		if (item.canCraft) {
			new DropItem({
				name: item.name,
				frame: item.frame,
				scene: this.mainScene,
				x: this.player.x - 32,
				y: this.player.y - 32
			});

			item.matDetails.forEach(m => this.inventory.removeItem(m.name));
		}
	}
}
