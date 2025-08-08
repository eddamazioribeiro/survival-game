import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	preload() {
		Player.preload(this);
		this.load.image('tiles', 'assets/images/rpg_nature_tileset.png');
		this.load.tilemapTiledJSON('map', 'assets/images/map.json');
	}

	create() {
		const map = this.make.tilemap({ key: 'map' });
		const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0);
		const layer1 = map.createLayer('tile_layer_1', tileset, 0, 0);
		const layer2 = map.createLayer('tile_layer_2', tileset, 0, 0);
		layer1.setCollisionByProperty({ collides: true });
		this.matter.world.convertTilemapLayer(layer1)

		this.player = new Player({
			scene: this,
			x: 100,
			y: 100, 
			texture: 'townsfolk',
			frame: 'townsfolk_m_idle_1',
			fixedRotation: true
		});
		this.player.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});
	}

	update() {
		this.player.update();
	}
}