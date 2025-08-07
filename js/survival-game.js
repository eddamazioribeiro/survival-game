const config = {
	type: Phaser.AUTO,
	parent: 'survival-game',
	width: 512,
	height: 512,
	backgroundColor: '#333333',
	scene: [],
	scale: {
		zoom: 2,
	},
	physics: {
		default: 'matter',
		matter: { 
			debug: true,
			gravity: { y: 0 },
		}
	},
	plugins: {
		scene: [
			{
				plugin: 'PhaserMatterCollisionPlugin',
				key: 'matterCollision',
				maping: 'matterCollision',
			}
		]
	}
}

new Phaser.Game(config);