export default class Player extends Phaser.Physics.Matter.Sprite {
	constructor(data) {
		let { scene, x, y, texture, frame, fixedRotation } = data;
		const { Body, Bodies } = Phaser.Physics.Matter.Matter;

		super(scene.matter.world, x, y, texture, frame);
		this.touching = [];
		this.scene.add.existing(this);
		// weapon
		this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'icons', 162);
		this.spriteWeapon.setScale(0.8);
		this.spriteWeapon.setOrigin(0.25, 0.75);
		this.scene.add.existing(this.spriteWeapon);

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

		this.createMiningCollisions(playerSensor);

		this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
	}

	static preload(scene) {
		scene.load.atlas('townsfolk', 'assets/images/townsfolk.png', 'assets/images/townsfolk_atlas.json');
		scene.load.animation('townsfolk_anim', 'assets/images/townsfolk_anim.json');
		scene.load.spritesheet('icons', 'assets/images/icons.png', { frameWidth: 32, frameHeight: 32 });
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

		this.spriteWeapon.setPosition(this.x, this.y);
		this.weaponRotate();
	}

	weaponRotate() {
		let pointer = this.scene.input.activePointer;

		if (pointer.isDown) this.weaponRotation += 3;
		else this.weaponRotation = 0;

		if (this.weaponRotation > 40) {
			this.whackStuff()
			this.weaponRotation = 0;
		}

		if (this.flipX) this.spriteWeapon.setAngle(-this.weaponRotation - 90);
		else this.spriteWeapon.setAngle(this.weaponRotation);
	}

	createMiningCollisions(playerSensor) {
		this.scene.matterCollision.addOnCollideStart({
			objectA: [playerSensor],
			callback: other => {
				if (other.bodyB.isSensor) return
				this.touching.push(other.gameObjectB);
				console.log(this.touching, this.touching.length);
			},
			context: this.scene,
		});

		this.scene.matterCollision.addOnCollideEnd({
			objectA: [playerSensor],
			callback: other => {
				const i = this.touching.findIndex(obj => obj.name === other.gameObjectB.name);
				this.touching.splice(i, 1);
			},
			context: this.scene,
		});
	}

	whackStuff() { 
		this.touching.filter(obj => obj.hit && !obj.dead);
		this.touching.forEach(obj => {
			obj.hit();

			if (obj.dead) {
				console.log('obj', obj);
				
				const i = this.touching.findIndex(o => o.name === obj.name);
				this.touching.splice(i, 1);
				obj.destroy();
			}
		});
	}
}