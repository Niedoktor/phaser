import Phaser from 'phaser';

export default class WinForm
{
    constructor (board, x, y)
    {
        this.board = board;
        this.scene = board.scene;

        const fs = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.5);

        const fontStyle1 = { fill: '#0a0', font: `bold ${fs}px Doto` };
        const fontStyle2 = { fill: '#000', font: `bold ${fs / 2}px Doto` };

        const form = this.scene.add.container(x, y);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, fs, 'YOU WIN!', fontStyle1).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + fs * 2, `You have reached level ${board.game.level}`, fontStyle2).setOrigin(0.5));

        form.add(this.nextLevelButton = this.scene.add.text(w / 2, form.last.y + fs * 2, 'Next Level', fontStyle2).setOrigin(0.5));

        this.nextLevelButton.setInteractive();
        this.nextLevelButton.on('pointerdown', () => {
            board.destroy();
            board.game.initBoard();
            form.destroy();
        });
        this.nextLevelButton.on('pointerover', () => {
            this.nextLevelButton.setStyle({ fill: '#f00' });
        });
        this.nextLevelButton.on('pointerout', () => {
            this.nextLevelButton.setStyle({ fill: '#000' });
        });        
    }
}