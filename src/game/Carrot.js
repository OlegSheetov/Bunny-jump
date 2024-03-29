import Phaser from '../lib/phaser.js';

export default class Carrot extends Phaser.GameObjects.Sprite  { 
    constructor(scene , x , y , texture){
        super(scene, x, y, texture);
        this.setScale(0.5);
    }
    create() { 
        this.physics.add.collider(this.platforms, this.carrot)
    }
}
