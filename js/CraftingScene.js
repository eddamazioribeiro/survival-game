import UIBaseScene from './UIBaseScene.js';

export default class CraftingScene extends UIBaseScene {
	constructor() {
		super('CraftingScene');

		this.craftingSlots = [];
		this.uiScale = 1.0;
		
	}
	
	init(data) {
		// let { mainScene } = data;
		// this.mainScene = mainScene;
		// this.crafting = mainScene.crafting;
		// this.crafting.inventory.subscribe(() => this.updateCraftableSlots());
	}

	create() {
		this.updateCraftableSlots();
	}

	destroyCrafitingSlot(slot) {
		slot.materials.forEach(m => m.destroy());
		slot.item.destroy();
		slot.destroy();
	}

	updateCraftableSlots() {
		for (let i = 0; i < 3; i++) {
			if (this.craftingSlots[i]) this.destroyCrafitingSlot(this.craftingSlots[i]);

			let x = this.margin + this.tileSize / 2;
			let y = i * this.tileSize + this.game.config.height / 2;

			this.craftingSlots[i] = this.add.sprite(x, y, 'icons', 11);
			this.craftingSlots[i].item = this.add.sprite(x, y, 'icons', 0);
			this.craftingSlots[i].materials = [];

			for (let j = 0; j < 4; j++) {
				let scale = 0.75;
				let x = x + this.tileSize + j * this.tileSize * scale;

				this.craftingSlots[i].materials[j] = this.add.sprite(x,	y, 'icons', 1);
				this.craftingSlots[i].materials[j].setScale(scale);
			}
		}
	}
}