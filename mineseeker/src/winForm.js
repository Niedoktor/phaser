import Phaser from 'phaser';
import Style from './styles';

export default class WinForm
{
    constructor (board, x, y)
    {
        this.board = board;
        this.scene = board.scene;

        this.board.game.level++;
        this.board.game.cash += this.board.reward + this.board.minesCounter * this.board.game.minePrice;

        const unlockedDevices = [];
        board.game.devices.forEach(device => {
            if(!device.enabled) {
                if(device.class.tryUnlock(board)){
                    device.enabled = true;
                    unlockedDevices.push(device);
                }
            }
        });

        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * (unlockedDevices.length > 0 ? 0.75 : 0.5));

        const form = this.scene.add.container(x, y - (unlockedDevices.length > 0 ? this.scene.scale.height * 0.25 : 0));

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, lineSpace, 'YOU WIN!', Style.gre14).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace, `You have reached level ${board.game.level}`, Style.bla7).setOrigin(0.5));

        form.add(this.scene.add.line(w / 2, form.last.y + lineSpace, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        form.add(this.scene.add.text(lineSpace, form.last.y + lineSpace, `Score at least ${board.scoreTarget} points`, Style.bla7).setOrigin(0, 0.5));

        form.add(this.scene.add.text(w - lineSpace, form.last.y, board.reward.toString().padStart(7, '.') + '$', Style.bla7).setOrigin(1, 0.5));

        form.add(this.scene.add.text(lineSpace, form.last.y + lineSpace, `${board.minesCounter} mine left (${board.game.minePrice}$/mine)`, Style.bla7).setOrigin(0, 0.5));

        form.add(this.scene.add.text(w - lineSpace, form.last.y, (board.minesCounter * board.game.minePrice).toString().padStart(10, '.') + '$', Style.bla7).setOrigin(1, 0.5));

        if(unlockedDevices.length > 0){
            form.add(this.scene.add.line(w / 2, form.last.y + lineSpace, 0, 0, w, 0, 0x000000).setOrigin(0.5));

            form.add(this.scene.add.text(w / 2, form.last.y + lineSpace , `Unlocked devices`, Style.bla7).setOrigin(0.5));

            form.add(this.devicesContainer = this.scene.add.container(lineSpace / 2, form.last.y + lineSpace / 2));
        
            this.devicesContainer.add(this.scene.add.rectangle(0, 0, w - lineSpace, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));

            let dx = (w - lineSpace - (lineSpace * 3.6 * unlockedDevices.length + lineSpace * 0.1 * (unlockedDevices.length - 1))) / 2;

            for(let i = 0; i < unlockedDevices.length; i++) {
                const device = new unlockedDevices[i].class(this.board.game, dx + i * (lineSpace * 3.7), lineSpace * 0.1, lineSpace * 3.6, lineSpace * 1.8);
                const deviceContainer = device.render();
                this.devicesContainer.add(deviceContainer);
            }
        }

        form.add(this.shopButton = this.scene.add.text(w / 2, h - lineSpace / 2, 'Shop', Style.bla7).setOrigin(0.5, 1));

        this.shopButton.setInteractive();
        this.shopButton.on('pointerdown', () => {
            this.board.game.openShop(true);
            if(this.deviceContainer) deviceContainer.destroy();
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