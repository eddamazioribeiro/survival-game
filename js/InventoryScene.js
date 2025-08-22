import items from './Items.js';
import UIBaseScene from './UIBaseScene.js';

export default class InventoryScene extends UIBaseScene {
	constructor() {
		super('InventoryScene');
		
		this.rows = 1;
		this.gridSpacing = 4;
		this.inventorySlots = [];
	}

	init(data ) {
		let { mainScene } = data;
		
		this.mainScene = mainScene;
		this.inventory = mainScene.player.inventory;
		this.maxColumns = this.inventory.maxColumns;
		this.maxRows = this.inventory.maxRows;
		this.inventory.subscribe(() => this.refresh());
	}

	get tileSize() {
		return this._tileSize * this.uiScale;
	}

	destroyInventorySlot(slot) {
		if (slot.item) slot.item.destroy();
		if (slot.quantityText) slot.quantityText.destroy();
		
		slot.destroy();
	}

	refresh() {
		this.inventorySlots.forEach(s => this.destroyInventorySlot(s));
		this.inventorySlots = [];

		for (let i = 0; i < this.maxColumns * this.rows; i++) {
			let x = this.margin + this.tileSize / 2 + (i % this.maxColumns) * (this.tileSize + this.gridSpacing);
			let y = this.margin + this.tileSize /2 + Math.floor(i/this.maxColumns) * (this.tileSize + this.gridSpacing);

			let inventorySlot = this.add.sprite(x, y, 'icons', 11);
			inventorySlot.setScale(this.uiScale);
			inventorySlot.depth = -1;

			inventorySlot.setInteractive();
			inventorySlot.on('pointerover', _ => {
				this.hoverIndex = i;
			});
			inventorySlot.on('pointerdown', () => {
				if (i < this.maxColumns) {
					this.inventory.selected = i;
					this.updateSelected();
				}
			});

			let item = this.inventory.getItem(i);

			if (item) {
				inventorySlot.item = this.add.sprite(
					inventorySlot.x,
					inventorySlot.y - this.tileSize / 12,
					'icons',
					items[item.name].frame
				);
				inventorySlot.quantityText = this.add.text(
					inventorySlot.x + this.tileSize / 4,
					inventorySlot.y + this.tileSize / 6,
					item.quantity, {
						font: '11px Courier',
						fill: '#111'
					}
				).setOrigin(0.5, 0);
				
				inventorySlot.item.setInteractive();
				this.input.setDraggable(inventorySlot.item);
			}

			this.inventorySlots.push(inventorySlot);
		}

		this.updateSelected();
	}

	updateSelected() {
		for (let i = 0; i < this.maxColumns; i++) {
			this.inventorySlots[i].tint = this.inventory.selected === i ?'0xffff00' : '0xffffff';
		}
	}

	create() {
		this.input.on('wheel', ({ deltaY }) => {
			this.inventory.selected = Math.max(0, this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns;
			this.updateSelected();
		})

		this.input.keyboard.on('keydown-I', () => {
			this.rows = this.rows === 1 ? this.maxRows : 1;
			this.refresh();
		});

		this.input.setTopOnly(false);
		this.input.on('dragstart', () => {
			this.inventory.dragging = true;
			this.startIndex = this.hoverIndex;
			this.inventorySlots[this.startIndex].quantityText.destroy();
		});
		this.input.on('drag', (_, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
		this.input.on('dragend', () => {
			this.inventory.dragging = false;
			this.inventory.moveItem(this.startIndex, this.hoverIndex);

			if (this.hoverIndex > this.maxColumns) {
				this.inventory.selected = undefined;
				this.updateSelected();
			}

			this.refresh();
		});

		this.refresh();
	}
}