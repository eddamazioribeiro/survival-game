export default class InventoryScene extends Phaser.Scene {
	constructor() {
		super('InventoryScene');
		
		this.maxColumns = 8;
		this.maxRows = 3;
		this.rows = 1;
		this.uiScale = 1.5;
		this.gridSpacing = 4;
		this.margin = 8;
		this._tileSize = 32;
		this.inventorySlots = [];
	}

	init(data ) {
		let { mainScene } = data;
		
		// this.mainScene = mainScene;
		// this.inventory = mainScene.player.inventory;
	}

	get tileSize () {
		return this._tileSize * this.uiScale;
	}

	refresh () {
		for (let i = 0; i < this.maxColumns * this.rows; i++) {
			let x = this.margin + this.tileSize / 2 + (i % this.maxColumns) * (this.tileSize + this.gridSpacing);
			let y = this.margin + this.tileSize /2 + Math.floor(i/this.maxColumns) * (this.tileSize + this.gridSpacing);

			let inventorySlot = this.add.sprite(x, y, 'icons', 11);
			inventorySlot.setScale(this.uiScale);
		}
	}

	create() {
		this.refresh();
	}
}