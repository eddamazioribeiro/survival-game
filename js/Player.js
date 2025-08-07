export default class Player extends Phaser.Physics.Matter.Sprite {
	constructor(data) {
		let { scene, x, y, texture, frame, fixedRotation } = data;
		const { Body, Bodies } = Phaser.Physics.Matter.Matter;

		super(scene.matter.world, x, y, texture, frame);
		this.scene.add.existing(this);

		var playerCollider = Bodies.circle(
			this.x,
			this.y,
			12,
			{ isSensor: false, label: 'playerCollider' }
		);
		var playerSensor = Bodies.circle(
			this.x,
			this.y,
			24,
			{ isSensor: true, label: 'playerSensor' }
		);
		const compoundBody = Body.create({
			parts: [ playerCollider, playerSensor ],
			frictionAir: 0.35
		});

		this.setExistingBody(compoundBody);
		if (fixedRotation) this.setFixedRotation();
	}

	static preload(scene) {
		scene.load.atlas('townsfolk', 'assets/images/townsfolk.png', 'assets/images/townsfolk_atlas.json');
		scene.load.animation('townsfolk_anim', 'assets/images/townsfolk_anim.json');
	}
	
	get velocity() {
		return this.body.velocity;
	}

	update() {
		const speed = 2.5;
		let playerVelocity = new Phaser.Math.Vector2();

		if (this.inputKeys.left.isDown) {
			playerVelocity.x = -1;
		} else if (this.inputKeys.right.isDown) {
			playerVelocity.x = 1;
		}

		if (this.inputKeys.up.isDown) {
			playerVelocity.y = -1;
		} else if (this.inputKeys.down.isDown) {
			playerVelocity.y = 1;
		}

		playerVelocity.normalize();
		playerVelocity.scale(speed);
		this.setVelocity(playerVelocity.x, playerVelocity.y);

		if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
			this.anims.play('townsfolk_walk', true);
		} else {
			this.anims.play('townsfolk_idle', true);
		}
	}
}