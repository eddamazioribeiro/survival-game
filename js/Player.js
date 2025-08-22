import MatterEntity from './MatterEntity.js';
import Inventory from './Inventory.js';

export default class Player extends MatterEntity {
		static preload(scene) {
		scene.load.atlas('peasant', 'assets/images/peasant.png', 'assets/images/peasant_atlas.json');
		scene.load.animation('peasant_anim', 'assets/images/peasant_anim.json');
		scene.load.spritesheet('icons', 'assets/images/icons.png', { frameWidth: 32, frameHeight: 32 });
		scene.load.audio('player', 'assets/audio/player_hurt.mp3');
		scene.load.audio('swish', 'assets/audio/swish_weapon.mp3');
		scene.load.audio('game_over', 'assets/audio/game_over.mp3');
	}

	constructor(data) {
		super({...data,
			name: 'player',
			health: 5,
			drops: []
		});
		
		this.touching = [];
		this.inventory = new Inventory();

		this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'icons', 162);
		this.spriteWeapon.setScale(0.8);
		this.spriteWeapon.setOrigin(0.25, 0.75);
		this.scene.add.existing(this.spriteWeapon);
		this.sound = this.scene.sound.add('player');
		this.soundWeapon = this.scene.sound.add('swish');
		this.soundGameOver = this.scene.sound.add('game_over');
		
		const { Body, Bodies } = Phaser.Physics.Matter.Matter;
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
		this.setFixedRotation();

		this.createMiningCollisions(playerSensor);
		this.createPickupCollisions(playerCollider);

		this.scene.input.on('pointermove', pointer => { 
			if (!this.isDead) this.setFlipX(pointer.worldX < this.x );
		});
	}

	update() {
		if (this.isDead) return;

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
		playerVelocity.scale(this.speed);
		this.velocity = { vector: playerVelocity, speed: this.speed };

		if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
			this.anims.play('peasant_walk', true);
		} else {
			this.anims.play('peasant_idle', true);
		}

		if (this.inventory.selectedItem) {
			this.spriteWeapon.setTexture('icons', this.inventory.getItemFrame(this.inventory.selectedItem));
			this.spriteWeapon.setVisible(true);
		} else {
			this.spriteWeapon.setVisible(false);
		}
		
		if (!this.inventory.dragging) {
			this.spriteWeapon.setPosition(this.x, this.y);
			this.weaponRotate();
		}
	}

	weaponRotate() {
		let pointer = this.scene.input.activePointer;

		if (!this.inventory.selectedItem) return;
		
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
			},
			context: this.scene,
		});

		this.scene.matterCollision.addOnCollideEnd({
			objectA: [playerSensor],
			callback: other => {
				this.touching = this.touching.filter(obj => obj !== other.gameObjectB);
			},
			context: this.scene,
		});
	}

	createPickupCollisions(playerCollider) {
		this.scene.matterCollision.addOnCollideStart({
			objectA: [playerCollider],
			callback: other => {
				if (other.gameObjectB && other.gameObjectB.pickup) {
					if (other.gameObjectB.pickup()) {
						this.inventory.addItem({ name: other.gameObjectB.name, quantity: 1 });
					}
				}
			},
			context: this.scene,
		});
	}
 
	whackStuff() { 
		this.touching = this.touching.filter(obj => obj.hit && !obj.isDead);

		if (this.touching.length > 0) {
			this.touching.forEach(obj => {
				obj.hit();
	
				if (obj.isDead) obj.destroy();
			});
		} else this.soundWeapon.play();
	}

	onDeath() {
		this.anims.stop();
		this.setTexture('icons', 0);
		this.setOrigin(0.5);
		this.spriteWeapon.destroy();
		if (this.soundGameOver) this.soundGameOver.play();
	}
}