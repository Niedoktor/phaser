import Phaser from 'phaser';
import Style from './styles';

export default class ShopForm
{
    constructor (game, x, y)
    {
        this.game = game;
        this.scene = game;

        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.75);

        const form = this.scene.add.container(x, y);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, lineSpace, '--- SHOP ---', Style.pur14).setOrigin(0.5));

        form.add(this.scene.add.line(w / 2, form.last.y + lineSpace, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace, `Devices`, Style.bla7).setOrigin(0.5));

        form.add(this.devicesContainer = this.scene.add.container(lineSpace / 2, form.last.y + lineSpace));
        
        this.devicesContainer.add(this.scene.add.rectangle(0, 0, w - lineSpace, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.nextLevelButton = this.scene.add.text(w / 2, h - lineSpace / 2, 'Next Level', Style.bla7).setOrigin(0.5, 1));

        const devices = [];
        while(devices.length < this.game.shopDevicesCount && devices.length + this.game.devicesInPlay.length < this.game.devices.length){
            const device = this.game.devices[Math.floor(Math.random() * this.game.devices.length)];
            if(!devices.includes(device) && !this.game.devicesInPlay.includes(device)){
                devices.push(device);
            }
        }

        const dx = (w - lineSpace - (lineSpace * 3.6 * devices.length + lineSpace * 0.1 * (devices.length - 1))) / 2;

        const basePrice = 1;
        for(let i = 0; i < devices.length; i++) {
            const device = new devices[i].class(this.game, dx + i * (lineSpace * 3.7), lineSpace * 0.1, lineSpace * 3.6, lineSpace * 1.8);
            const deviceContainer = device.render(basePrice);
            this.devicesContainer.add(deviceContainer);
            
            device.rect.setInteractive();
            device.rect.on('pointerdown', () => {
                if(this.game.devicesInPlay.length < 5 && this.game.cash >= device.priceTier * basePrice){
                    this.game.cash -= device.priceTier * basePrice;
                    this.game.addDevice(devices[i].name);
                    deviceContainer.destroy();
                }
            });
        }

        this.nextLevelButton.setInteractive();
        this.nextLevelButton.on('pointerdown', () => {
            this.game.board.destroy();
            this.game.initBoard();
            form.destroy();
            delete this;
        });
        this.nextLevelButton.on('pointerover', () => {
            this.nextLevelButton.setStyle(Style.red7);
        });
        this.nextLevelButton.on('pointerout', () => {
            this.nextLevelButton.setStyle(Style.bla7);
        });        
    }
}