import MatterEntity from './MatterEntity.js';

export default class Enemy extends MatterEntity {
	static preload(scene) {
		scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
		scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json');
		scene.load.audio('bear', 'assets/audio/rock.mp3');
		scene.load.audio('wolf', 'assets/audio/rock.mp3');
		scene.load.audio('ent', 'assets/audio/rock.mp3');
	}

	constructor(data) {
		let { scene, enemy } = data;
		let drops = JSON.parse(enemy.properties.find(prop => prop.name === 'drops').value)
		let health = enemy.properties.find(prop => prop.name === 'health').value;

		super({
			scene,
			name: enemy.name,
			x: enemy.x,
			y: enemy.y,
			texture: 'enemies',
			frame: `${enemy.name}_idle_1`,
			drops,
			health,
			
		});
	}

	update() {
		console.log(`enemy ${this.name} updated`);
	}
}