import DropItem from './DropItem.js';

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
	constructor(data) {
		let { scene, name, x, y, health, speed, drops, texture, frame, depth } = data;

		super(scene.matter.world, x, y, texture, frame);

		this.x += this.width/2;
		this.y -= this.height/2;
		this.depth = depth || 1;
		this.name = name;
		this.health = health;
		this.speed = speed || 2.5;
		this.drops = drops;
		this._position = new Phaser.Math.Vector2(this.x, this.y);

		if (this.name) this.sound = this.scene.sound.add(this.name);
		this.scene.add.existing(this)
		this.setFixedRotation();
	}

	get position() {
		this._position.set(this.x, this.y);
		return this._position;
	}

	set velocity({ vector, speed }) {
		vector.normalize();
		vector.scale(speed);
		super.setVelocity(vector.x, vector.y)
	}

	get velocity() {
		return this.body.velocity;
	}

	get isDead() {
		return this.health <= 0;
	}

	onDeath = () => {

	}

	hit = () => {		
		this.health--;
		if (this.sound) {
			if (!this.isDead) this.sound.play();
			else this.sound.stop();
		}

		if (this.isDead) {
			this.drops.forEach(drop => new DropItem({
				scene: this.scene,
				x: this.x,
				y: this.y,
				frame: drop
			}));
		}
	}
}