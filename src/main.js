import Phaser from './lib/phaser.js';

import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type: Phaser.AUTO, 
    scale: { 
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Game, GameOver],
    physics: { 
        default: 'arcade',
        arcade: { 
            gravity: {
                y: 200
            },
        }
    }
})





