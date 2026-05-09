import Phaser from 'phaser';
import Style from './styles';

export default class ShopForm
{
    constructor (board, x, y)
    {
        this.board = board;
        this.scene = board.scene;

        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.75);
        const h = Math.floor(this.scene.scale.height * 0.75);

        const form = this.scene.add.container(x, y);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, lineSpace, '--- SHOP ---', Style.pur14).setOrigin(0.5));

        form.add(this.scene.add.line(w / 2, form.last.y + lineSpace, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace, `Devices`, Style.bla7).setOrigin(0.5));

        form.add(this.devicesContainer = this.scene.add.container(lineSpace, form.last.y + lineSpace));
        
        this.devicesContainer.add(this.scene.add.rectangle(0, 0, w - lineSpace * 2, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(1, 0x000000));

        form.add(this.playButton = this.scene.add.text(w / 2, h - lineSpace / 2, 'Play', Style.bla7).setOrigin(0.5, 1));

        this.devicesContainer.add(new board.game.devices[0].class(board.game, lineSpace * 0.1, lineSpace * 0.1, lineSpace * 3.6, lineSpace * 1.8).render());
        this.devicesContainer.add(new board.game.devices[1].class(board.game, lineSpace * 0.2 + lineSpace * 3.6, lineSpace * 0.1, lineSpace * 3.6, lineSpace * 1.8).render());        

        this.playButton.setInteractive();
        this.playButton.on('pointerdown', () => {
            board.destroy();
            board.game.initBoard();
            form.destroy();
            delete this;
        });
        this.playButton.on('pointerover', () => {
            this.playButton.setStyle(Style.red7);
        });
        this.playButton.on('pointerout', () => {
            this.playButton.setStyle(Style.bla7);
        });        
    }
}