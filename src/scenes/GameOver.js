import Phaser from '../lib/phaser.js';

export default class GameOver extends Phaser.Scene{ 

    constructor() { 
        super('game-over');
    }
    create(){ 
        const width = this.scale.width 
        const height = this.scale.height
        this.add.text(
            width * 0.5, 
            height * 0.5, 
            'Game Over \n\r Hit SPACE to play again',
            {
                fontSize: 28
            }
        )
        .setOrigin(0.5)

        this.input.keyboard.once( 'keydown-SPACE' , ()=> { 
            this.scene.start('game');
        } )
        
        const buttonRestart = this.add.text(400 , 600 ,
            'Restart',
            {  fontSize: 44  })
        buttonRestart.setInteractive().setScrollFactor(0);

        buttonRestart.on('pointerdown' ,() => { 
            this.scene.start('game');
        })
    }



}
