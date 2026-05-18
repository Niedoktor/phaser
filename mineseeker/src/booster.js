import Phaser from 'phaser';
import Style from './styles';

export default class Booster {
    desc;
    priceTier = 0;

    constructor(game, x, y, w, h) {
        this.game = game;
        this.scene = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    open(){
    }

    render(basePrice = 0){
        this.container = this.scene.add.container(this.x, this.y);

        this.container.add(this.rect = this.scene.add.rectangle(0, 0, this.w, this.h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        const fontStyle = { ...Style.bla4,
            fontSize: Math.floor(this.h * 0.14),
            lineSpacing: Math.floor(this.h * 0.04),
            wordWrap: { width: this.w * 0.9 },
            align: 'center'
        };

        this.container.add(this.scene.add.text(this.w / 2, this.h * (0.4 + (basePrice === 0 ? 0.1 : 0)), this.desc, fontStyle).setOrigin(0.5));

        if(basePrice > 0){
            this.container.add(this.scene.add.text(this.w / 2, this.h * 0.92, `${basePrice * this.priceTier}$`, Style.bla4b).setOrigin(0.5, 1));
        }

        return this.container;
    }
}