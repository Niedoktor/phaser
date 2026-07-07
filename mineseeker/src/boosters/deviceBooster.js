import Booster from "../booster.js";
import Style from '../styles';

export default class DeviceBooster extends Booster {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Choose 1 device from 3 possibilities.";
    }

    open () {
        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.5);

        this.form = this.scene.add.container(this.scene.scale.width / 4, this.scene.scale.height / 4);

        this.form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000).setInteractive());

        this.form.add(this.scene.add.text(w / 2, this.form.last.y + lineSpace , 'Choose 1 device', Style.bla7).setOrigin(0.5));

        const devices = [];
        while(devices.length < 3){
            const device = this.game.devices[Math.floor(Math.random() * this.game.devices.length)];
            if(!devices.includes(device) && device.enabled){
                devices.push(device);
            }
        }

        let dx = (w - lineSpace * 11.2) / 2;

        this.form.add(this.devicesContainer = this.scene.add.container(dx, this.form.last.y + lineSpace));

        this.devicesContainer.add(this.scene.add.rectangle(0, 0, lineSpace * 11.2, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));

        for(let i = 0; i < devices.length; i++) {
            const device = new devices[i].class(this.game, lineSpace * 0.1 + i * lineSpace * 3.7, lineSpace * 0.1, lineSpace * 3.6, lineSpace * 1.8);
            const deviceContainer = device.render();
            this.devicesContainer.add(deviceContainer);

            device.rect.setInteractive();
            device.rect.on('pointerdown', () => {
                this.game.addDevice(devices[i].class.name);
                deviceContainer.destroy();
                this.close();             
            });
        }      
        
        this.form.add(this.cancelButton = this.scene.add.text(w / 2, h - lineSpace / 2, 'Cancel', Style.bla7).setOrigin(0.5, 1));

        this.cancelButton.setInteractive();
        this.cancelButton.on('pointerdown', () => {
            this.close();
        });
        this.cancelButton.on('pointerover', () => {
            this.cancelButton.setStyle(Style.red7);
        });
        this.cancelButton.on('pointerout', () => {
            this.cancelButton.setStyle(Style.bla7);
        });
    }

    close() {
        this.form.destroy();
        if(this.game.shop.formBlur) this.game.shop.form.postFX.remove(this.game.shop.formBlur);
        this.game.shop.nextLevelButton.setInteractive();
        delete this;
    }    
}