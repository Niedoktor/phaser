import Booster from "../booster.js";
import Style from '../styles';

export default class MineBooster extends Booster {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Choose 1 mine from 3 possibilities.";
    }

    open () {
        const lineSpace = Math.floor(this.scene.scale.height * 0.07);
        const w = Math.floor(this.scene.scale.width * 0.5);
        const h = Math.floor(this.scene.scale.height * 0.5);

        const form = this.scene.add.container(this.scene.scale.width / 4, this.scene.scale.height / 4);

        form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        form.add(this.scene.add.text(w / 2, form.last.y + lineSpace , 'Choose 1 mine', Style.bla7).setOrigin(0.5));

        const mines = [];
        while(mines.length < 3){
            const mine = {...this.game.mines[Math.floor(Math.random() * this.game.mines.length)]};
            mine.size = Phaser.Math.Between(1, 3);
            mine.mineParams = mine.class.setMineParams(mine.size);
            if(!mines.some(m => m.class === mine.class && m.size === mine.size)){
                mines.push(mine);
            }
        }

        let dx = (w - lineSpace * 5.7) / 2;

        form.add(this.minesContainer = this.scene.add.container(dx, form.last.y + lineSpace));

        this.minesContainer.add(this.scene.add.rectangle(0, 0, lineSpace * 5.7, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));

        for(let i = 0; i < mines.length; i++) {
            const legend = mines[i].class.legend(this.scene, lineSpace * 1.8, lineSpace + i * lineSpace * 1.9, lineSpace, mines[i].size, mines[i].mineParams);
            this.minesContainer.add(legend);
            
            // device.rect.setInteractive();
            // device.rect.on('pointerdown', () => {
            //     if(this.game.devicesInPlay.length < 5 && this.game.cash >= device.priceTier * basePrice){
            //         this.game.cash -= device.priceTier * basePrice;
            //         this.game.addDevice(devices[i].name);
            //         deviceContainer.destroy();
            //     }
            // });
        }        
    }
}