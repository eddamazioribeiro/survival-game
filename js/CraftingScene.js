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

	updateCraftableSlots() {
		console.log('updateCraftableSlots');
		let x = 0;
		let y = 0;

		this.add.sprite(x, y, 'icons', 11);
	}
}