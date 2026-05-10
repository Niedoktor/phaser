import Phaser from 'phaser';
import Style from './styles';

export default class Device {
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

    play(board){
        this.render();
    }

    render(basePrice = 0){
        this.container = this.scene.add.container(this.x, this.y);

        this.container.add(this.rect = this.scene.add.rectangle(0, 0, this.w, this.h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));
        this.container.add(this.scene.add.text(this.w / 2, this.h / 2, this.desc, { ...Style.bla4,
            wordWrap: { width: this.w * 0.8 },
            align: 'center'
        }).setOrigin(0.5));

        if(basePrice > 0){
            this.container.add(this.scene.add.text(this.w / 2, this.h * 0.9, `${basePrice * this.priceTier}$`, Style.bla4b).setOrigin(0.5, 1));
        }

        return this.container;
    }
}