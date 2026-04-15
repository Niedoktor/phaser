import Phaser from 'phaser';

export class Explosion extends Phaser.Scene {
    constructor() {
        super('Explosion');
    }

    preload() {
        // Load assets here
    }

    create() {
        this.matter.world.setBounds();

        //this.matter.add.mouseSpring();

        //const collGroup = this.matter.world.nextGroup(true);

        this.add.mine(this.scale.width / 2, this.scale.height / 2 - 100, this.scale.height * 0.01);
        this.add.mine(this.scale.width / 2, this.scale.height / 2 + 100, this.scale.height * 0.01);
    }

    update() {
        // Update game logic each frame
    }
}