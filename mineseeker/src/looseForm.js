import Phaser from 'phaser';
import Style from './styles';

export default class LooseForm
{
    constructor (board, x, y)
    {
        this.board = board;
        this.scene = board.scene;

        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.5);

        const form = this.scene.add.container(x, y);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, lineSpace, 'YOU LOOSE!', Style.red14).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace * 2, `You have reached level ${board.game.level}`, Style.bla7).setOrigin(0.5));

        form.add(this.newButton = this.scene.add.text(w / 2, form.last.y + lineSpace * 2, 'New Game', Style.bla7).setOrigin(0.5));

        this.newButton.setInteractive();
        this.newButton.on('pointerdown', () => {
            localStorage.setItem('game.level', undefined);
            this.scene.scene.start('Game');
            form.destroy();
            delete this;
        });
        this.newButton.on('pointerover', () => {
            this.newButton.setStyle(Style.red7);
        });
        this.newButton.on('pointerout', () => {
            this.newButton.setStyle(Style.bla7);
        });        
    }
}