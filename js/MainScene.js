import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	preload() {
		Player.preload(this);
		this.load.image('tiles', 'assets/images/rpg_nature_tileset.png');
		this.load.tilemapTiledJSON('map', 'assets/images/map.json');
		this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
	}

	create() {
		const map = this.make.tilemap({ key: 'map' });
		this.map = map;
		const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0);
		const layer1 = map.createLayer('tile_layer_1', tileset, 0, 0);
		const layer2 = map.createLayer('tile_layer_2', tileset, 0, 0);
		layer1.setCollisionByProperty({ collides: true });
		this.matter.world.convertTilemapLayer(layer1)

		this.addResources();

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

	addResources() {
		const resources = this.map.getObjectLayer('resources');
		resources.objects.forEach(resource => {
			let item = new Phaser.Physics.Matter.Sprite(this.matter.world, resource.x, resource.y, 'resources', resource.type);
			let yOrigin = resource.properties.find(prop => prop.name === 'yOrigin').value;
			
			item.x += item.width/2;
			item.y -= item.height/2;
			item.y = item.y + item.height * (yOrigin - 0.5);

			const { Body, Bodies } = Phaser.Physics.Matter.Matter;
			let circleCollider = Bodies.circle(item.x, item.y, 12, {
				isSensor: false,
				label: 'collider'
			});

			item.setExistingBody(circleCollider);
			item.setStatic(true);
			item.setOrigin(0.5, yOrigin);
			this.add.existing(item);
		});
	}

	update() {
		this.player.update();
	}
}