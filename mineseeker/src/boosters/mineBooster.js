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

        this.form = this.scene.add.container(this.scene.scale.width / 4, this.scene.scale.height / 4);

        this.form.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000).setInteractive());

        this.form.add(this.scene.add.text(w / 2, this.form.last.y + lineSpace , 'Choose 1 mine', Style.bla7).setOrigin(0.5));

        const mines = [];
        while(mines.length < 3){
            const mine = {...this.game.mines[Math.floor(Math.random() * this.game.mines.length)]};
            mine.size = Phaser.Math.Between(1, 3);
            mine.mineParams = mine.class.setMineParams(mine.size);
            if(!mines.some(m => m.class === mine.class && m.size === mine.size)){
                mines.push(mine);
            }
        }

        let dx = (w - lineSpace * 5.8) / 2;

        this.form.add(this.minesContainer = this.scene.add.container(dx, this.form.last.y + lineSpace));

        this.minesContainer.add(this.scene.add.rectangle(0, 0, lineSpace * 5.8, lineSpace * 2, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));

        for(let i = 0; i < mines.length; i++) {
            const rect = this.scene.add.rectangle(lineSpace * 0.1 + i * lineSpace * 1.9, lineSpace * 0.1, lineSpace * 1.8, lineSpace * 1.8, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000)
            this.minesContainer.add(rect);

            const legend = mines[i].class.legend(this.scene, lineSpace * 1.8, lineSpace + i * lineSpace * 1.9, lineSpace, mines[i].size, mines[i].mineParams);
            this.minesContainer.add(legend);
            
            rect.setInteractive();
            rect.on('pointerdown', () => {
                this.game.addMine({ class: mines[i].class, size: mines[i].size, classIndex: i });
                //rect.destroy();
                //legend.destroy();
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