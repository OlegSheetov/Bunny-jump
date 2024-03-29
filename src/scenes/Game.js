import Phaser from '../lib/phaser.js';
import Carrot from '../game/Carrot.js';
export default class Game extends Phaser.Scene { 

    player

    platforms

    cursors

    carrots

    carrotsCollected = 0; 

    carrotsCollectedText

    PlayerVelocity = -300

    NumberOfPlatform = 8 






    findBottomMostPlatform(){ 
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0];
        for( let i = 1; i < platforms.length; ++i ){ 
            const platform = platforms[i];
            if (platform.y < bottomPlatform.y) { 
                continue
            }
            bottomPlatform = platform
        }

        return bottomPlatform

    }

    
    addCarrotAbove(sprite) { 
        const y = sprite.y - sprite.displayHeight
        const carrot = this.carrots.get(sprite.x, y, 'carrot')


        carrot.setActive(true);
        carrot.setVisible(true);
        this.add.existing(carrot);

        carrot.body.setSize(carrot.width, carrot.height)

        this.physics.world.enable(carrot)

        return carrot
    } 

    handleCollectCarrot(player , carrot ){ 
        //hide from display
        this.carrots.killAndHide(carrot) 

        // disable from physics world 
        this.physics.world.disableBody(carrot.body)

        //increment by 1 
        this.carrotsCollected++

        // create new text value and set it 
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value


    }

    horizontalWrap(sprite){ 
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width 
        if(sprite.x < -halfWidth){ 
            sprite.x = gameWidth + halfWidth
        }else if ( sprite.x > gameWidth + halfWidth ){
            sprite.x = -halfWidth;
        }
    }

    constructor() { 
        super('game');
    }


    init() { 

        this.carrotsCollected = 0;
    }


    preload(){
        this.load.image('background', 'assets/bg_layer1_compressed.webp');
        this.load.image('platform' , 'assets/ground_grass.webp');

        this.load.image('bunny-stand', 'assets/bunny1_stand.webp');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.load.image('carrot' , 'assets/carrot.webp')
        const carrot = new Carrot(this, 240 , 320, 'carrot');
        this.add.existing(carrot)

        this.load.image('bunny-jump' , 'assets/bunny1_jump.webp');
        this.load.audio('jump' , 'assets/sfx/phaseJump1.webm');

    }

    create(){ 
        this.add.image(240 , 320, 'background').setScrollFactor(1,0);
        this.platforms = this.physics.add.staticGroup();

        for(let i=0; i < this.NumberOfPlatform ; ++i){

            const x = Phaser.Math.Between(-50 , 400);
            const y = 150 * i

            const platform = this.platforms.create(x, y, 'platform');
            platform.scale = 0.2


            const body = platform.body
            body.updateFromGameObject()

            // Disable colision from bottom , left and right 
            body.checkCollision.down = false
            body.checkCollision.left = false 
            body.checkCollision.right = false

        }
            //player
            this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5);
            this.physics.add.collider(this.platforms, this.player)
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setDeadzone(this.scale.width * 1.5);
            


        this.carrots = this.physics.add.group({
            classType: Carrot
        })

                
        this.physics.add.collider(this.platforms, this.carrots)

        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined, // called for overlap
            this,
        )

        // UI which display collected carrots  
        const style = { color: '#000' , fontSize: 24 }
        this.carrotsCollectedText =  this.add.text(240, 10, 'Carrots: 0' , style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);


        //Buttons for mobile input 
        const buttonL = this.add.text(300 , 600 ,
            '<', 
            {fill: '#fffff' , fontSize: 104})
        buttonL.setInteractive().setScrollFactor(0);

        buttonL.on('pointerdown' ,() => {


            this.player.setVelocityX(-200);
        })

        const buttonR = this.add.text(600 , 600 ,
            '>', 
            {fill: '#fffff' , fontSize: 104})
        buttonR.setInteractive().setScrollFactor(0);

        buttonR.on('pointerdown' ,() => { 


            
            this.player.setVelocityX(200);
        })


    }

    update(t , dt){
        // auto jump and increasing speed each jump 
        const touchingDown = this.player.body.touching.down
        if(touchingDown){ 
            // Jump
            this.player.setVelocityY(this.PlayerVelocity);
            // increase player jump speeed each jump
            this.PlayerVelocity = this.PlayerVelocity - 20

            //switch to jump texture
            this.player.setTexture('bunny-jump')

            //play jump sound
            this.sound.play('jump');

            // Increate count of platforms each jump
            //this.NumberOfPlatform++
            

        }
        // Change player texture to stand
        const vy = this.player.body.velocity.y;
        if(vy > 0 && this.player.texture.key !== 'bunny-stand'){ 
            this.player.setTexture('bunny-stand');
        }

        this.platforms.children.iterate(child => { 
            
        // reuse platforms ? 
        const platform = child 
        const scrollY = this.cameras.main.scrollY
        if(platform.y >= scrollY + 700){
            platform.y = scrollY - Phaser.Math.Between(50 , 100);
            platform.body.updateFromGameObject();

            this.addCarrotAbove(platform);


        }
        })


        if(this.cursors.left.isDown && !touchingDown){ 
            this.player.setVelocityX(-200);
        }else if (this.cursors.right.isDown && !touchingDown) { 
            this.player.setVelocityX(200)
        }else { 
            // This off inertia
            //this.player.setVelocityX(0)
        }

        //this.horizontalWrap(this.player);

        const bottomPlatform = this.findBottomMostPlatform() 
        if(this.player.y > bottomPlatform.y + 200) { 
            this.scene.start('game-over')
        }
    }
     





}
