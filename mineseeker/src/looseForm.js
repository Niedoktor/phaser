import Phaser from 'phaser';

export default class LooseForm
{
    constructor (board, x, y)
    {
        this.board = board;
        this.scene = board.scene;

        const fs = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.5);

        const fontStyle1 = { fill: '#f00', font: `bold ${fs}px Doto` };
        const fontStyle2 = { fill: '#000', font: `bold ${fs / 2}px Doto` };

        const form = this.scene.add.container(x, y);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, fs, 'YOU LOOSE!', fontStyle1).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + fs * 2, `You have reached level ${board.game.level}`, fontStyle2).setOrigin(0.5));

        form.add(this.newButton = this.scene.add.text(w / 2, form.last.y + fs * 2, 'New Game', fontStyle2).setOrigin(0.5));

        this.newButton.setInteractive();
        this.newButton.on('pointerdown', () => {
            this.scene.scene.start('Game');
            form.destroy();
        });
        this.newButton.on('pointerover', () => {
            this.newButton.setStyle({ fill: '#f00' });
        });
        this.newButton.on('pointerout', () => {
            this.newButton.setStyle({ fill: '#000' });
        });        
    }
}