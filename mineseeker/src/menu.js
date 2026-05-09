import Phaser from 'phaser';
import Style from './styles';

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
    }

    create() {
        const x = Math.floor(this.scale.width / 2);
        const y = Math.floor(this.scale.height * 0.25);

        this.add.text(x, y, 'Mine Seeker', Style.bla14).setOrigin(0.5);

        const newButton = this.add.text(x, 2 * y, 'New Game', Style.bla7).setOrigin(0.5);
        const contButton = this.add.text(x, 2 * y + newButton.height * 2, 'Continue', Style.gra7).setOrigin(0.5);
        
        newButton.setInteractive();
        newButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
        newButton.on('pointerover', () => {
            newButton.setStyle(Style.red7);
        });
        newButton.on('pointerout', () => {
            newButton.setStyle(Style.bla7);
        });

    }
}