import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        WebFont.load({
            google: {
                families: [ 'Roboto Mono', 'Doto', 'Sixtyfour', 'Kode Mono' ]
            },
            active: () => {
                const x = Math.floor(this.scale.width / 2);
                const y = Math.floor(this.scale.height * 0.25);
                const fs = Math.floor(this.scale.height * 0.07);

                this.add.text(x, y, 'Mine Seeker', { fill: '#000', font: `bold ${fs}px Doto` }).setOrigin(0.5);

                const newButton = this.add.text(x, 2 * y, 'New Game', { fill: '#000', font: `bold ${fs / 2}px Doto` }).setOrigin(0.5);
                const contButton = this.add.text(x, 2 * y + fs, 'Continue', { fill: '#aaa', font: `bold ${fs / 2}px Doto` }).setOrigin(0.5);
                newButton.setInteractive();
                newButton.on('pointerdown', () => {
                    this.scene.start('Game');
                });
                newButton.on('pointerover', () => {
                    newButton.setStyle({ fill: '#f00' });
                });
                newButton.on('pointerout', () => {
                    newButton.setStyle({ fill: '#000' });
                });
            }
        });
    }
}