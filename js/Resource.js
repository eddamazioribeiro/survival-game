export default class Resource extends Phaser.Physics.Matter.Sprite {
	static preload(scene) {
		scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
		scene.load.audio('tree', 'assets/audio/wood.ogg');
		scene.load.audio('bush', 'assets/audio/bush.mp3');
		scene.load.audio('rock', 'assets/audio/rock.mp3');
	}

	constructor(data) {
		let { scene, resource } = data;
		
		super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
		this.scene.add.existing(this);

		let yOrigin = resource.properties.find(prop => prop.name === 'yOrigin').value;
			
		this.name = resource.type;
		this.health = 5;
		this.sound = this.scene.sound.add(this.name);
		this.x += this.width/2;
		this.y -= this.height/2;
		this.y = this.y + this.height * (yOrigin - 0.5);

		const { Bodies } = Phaser.Physics.Matter.Matter;
		let circleCollider = Bodies.circle(this.x, this.y, 12, {
			isSensor: false,
			label: 'collider'
		});

		this.setExistingBody(circleCollider);
		this.setStatic(true);
		this.setOrigin(0.5, yOrigin);
	}

	get dead() {
		return this.health <= 0;
	}

	hit () {
		if (this.sound) this.sound.play();
		this.health--;
	}
}