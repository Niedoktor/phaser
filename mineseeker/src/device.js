import Phaser from 'phaser';
import Style from './styles';

export default class Device {
    desc;

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

    render(){
        this.container = this.scene.add.container(this.x, this.y);

        this.container.add(this.scene.add.rectangle(0, 0, this.w, this.h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));
        this.container.add(this.scene.add.text(this.w / 2, this.h / 2, this.desc, { ...Style.bla4,
            wordWrap: { width: this.w * 0.8 },
            align: 'center'
        }).setOrigin(0.5));

        return this.container;
    }
}