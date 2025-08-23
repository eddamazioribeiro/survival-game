import MainScene from './MainScene.js';
import InventoryScene from './InventoryScene.js';
import CraftingScene from './CraftingScene.js';

const config = {
	type: Phaser.AUTO,
	parent: 'survival-game',
	width: 512,
	height: 512,
	backgroundColor: '#999999',
	scene: [ 
		MainScene,
		InventoryScene,
		CraftingScene
	],
	scale: {
		zoom: 2,
	},
	physics: {
		default: 'matter',
		matter: { 
			debug: false,
			gravity: { y: 0 },
		}
	},
	plugins: {
		scene: [
			{
				plugin: PhaserMatterCollisionPlugin.default,
				key: 'matterCollision',
				mapping: 'matterCollision'
			}
		]
	}
}

new Phaser.Game(config);