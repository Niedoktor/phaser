import Phaser from 'phaser';
import Style from './styles';

export default class WinForm
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

        form.add(this.scene.add.text(w / 2, lineSpace, 'YOU WIN!', Style.gre14).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace, `You have reached level ${board.game.level + 1}`, Style.bla7).setOrigin(0.5));

        form.add(this.scene.add.line(w / 2, form.last.y + lineSpace, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        form.add(this.scene.add.text(lineSpace, form.last.y + lineSpace, `Score at least ${board.scoreTarget} points`, Style.bla7).setOrigin(0, 0.5));

        form.add(this.scene.add.text(w - lineSpace, form.last.y, board.reward.toString().padStart(7, '.') + '$', Style.bla7).setOrigin(1, 0.5));

        form.add(this.scene.add.text(lineSpace, form.last.y + lineSpace, `${board.minesCounter} mine left (1$/mine)`, Style.bla7).setOrigin(0, 0.5));

        form.add(this.scene.add.text(w - lineSpace, form.last.y, board.minesCounter.toString().padStart(10, '.') + '$', Style.bla7).setOrigin(1, 0.5));

        form.add(this.shopButton = this.scene.add.text(w / 2, h - lineSpace / 2, 'Shop', Style.bla7).setOrigin(0.5, 1));

        this.shopButton.setInteractive();
        this.shopButton.on('pointerdown', () => {
            this.board.game.level++;
            this.board.game.cash += this.board.reward + this.board.minesCounter;
            this.board.game.openShop(true);

            form.destroy();
            delete this;
        });
        this.shopButton.on('pointerover', () => {
            this.shopButton.setStyle(Style.red7);
        });
        this.shopButton.on('pointerout', () => {
            this.shopButton.setStyle(Style.bla7);
        });        
    }
}