import Enemy from './Enemy.js';
import Player from './Player.js';
import Resource from './Resource.js';

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
		
		this.enemies = [];
	}

	preload() {
		Player.preload(this);
		Enemy.preload(this);
		Resource.preload(this);
		this.load.image('tiles', 'assets/images/rpg_nature_tileset.png');
		this.load.tilemapTiledJSON('map', 'assets/images/map.json');
		this.load.audio('game_start', 'assets/audio/game_start.mp3');
	}

	create() {
		const map = this.make.tilemap({ key: 'map' });
		this.map = map;
		const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 1, 2);
		const layer1 = map.createLayer('tile_layer_1', tileset, 0, 0);
		const layer2 = map.createLayer('tile_layer_2', tileset, 0, 0);
		layer1.setCollisionByProperty({ collides: true });
		this.matter.world.convertTilemapLayer(layer1)

		this.map.getObjectLayer('resources').objects.forEach(resource => new Resource({ scene: this, resource }));
		this.map.getObjectLayer('enemies').objects.forEach(enemy => this.enemies.push(new Enemy({ scene: this, enemy })));

		this.player = new Player({
			scene: this,
			speed: 2.5,
			x: 100,
			y: 100, 
			texture: 'peasant',
			frame: 'peasant_m_idle_1',
			fixedRotation: true
		});
		this.player.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		let camera = this.cameras.main;
		camera.zoom = 2;
		camera.startFollow(this.player);
		camera.setLerp(0.1, 0.1);
		camera.setBounds(0, 0, this.game.config.width, this.game.config.height);

		this.soundGameStart = this.sound.add('game_start');
		if (this.soundGameStart) this.soundGameStart.play();

		this.scene.launch('InventoryScene', { mainScene: this });
	}

	update() {
		this.enemies.forEach(enemy => enemy.update());
		this.player.update();
	}
}