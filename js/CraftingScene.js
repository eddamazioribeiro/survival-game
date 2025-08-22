import UIBaseScene from './UIBaseScene.js';

export default class CraftingScene extends UIBaseScene {
	constructor() {
		super('CraftingScene');

		this.craftingSlots = [];
		this.uiScale = 1.0;
	}
	
	init(data) {
		let { mainScene } = data;
		this.mainScene = mainScene;
		this.crafting = mainScene.crafting;
		this.crafting.inventory.subscribe(() => this.updateCraftableSlots());
	}

	create() {
		this.updateCraftableSlots();
		this.input.on('wheel', ({ deltaY }) => {
			this.crafting.selected = Math.max(0, this.crafting.selected + (deltaY > 0 ? 1 : -1)) % this.crafting.items.length;
			this.updateSelected();
		});

		this.input.keyboard.on('keydown-E', () => {
			this.crafting.craft();
		});
	}

	updateSelected() {
		for (let i = 0; i < this.crafting.items.length; i++) {
			this.craftingSlots[i].tint = this.crafting.selected === i ? 0xffff00 : 0xffffff;
		}
	}

	destroyCrafitingSlot(slot) {
		slot.materials.forEach(m => m.destroy());
		slot.item.destroy();
		slot.destroy();
	}

	updateCraftableSlots() {
		this.crafting.updateItems();

		for (let i = 0; i < this.crafting.items.length; i++) {
			let craftingSlot = this.craftingSlots[i];

			if (craftingSlot) this.destroyCrafitingSlot(craftingSlot);
			const craftableItem = this.crafting.items[i];

			let xSlot = this.margin + this.tileSize / 2;
			let ySlot = i * this.tileSize + this.game.config.height / 2;

			craftingSlot = this.add.sprite(xSlot, ySlot, 'icons', 11);
			craftingSlot.item = this.add.sprite(xSlot, ySlot, 'icons', craftableItem.frame);
			craftingSlot.item.tint = craftableItem.canCraft ? '0xffffff' : '0x555555';
			craftingSlot.materials = [];

			for (let j = 0; j < craftableItem.matDetails.length; j++) {
				let scale = 0.75;
				let xMaterial = xSlot + this.tileSize + j * this.tileSize * scale;
				const item = craftableItem.matDetails[j];
				let material = craftingSlot.materials[j];

				material = this.add.sprite(xMaterial, ySlot, 'icons', item.frame);
				material.setScale(scale);
				material.tint = item.available ? '0xffffff' : '0x555555';
			}

			this.craftingSlots[i] = craftingSlot;
		}
	}
}