export default class Device {
    desc;

    constructor(game, index) {
        this.game = game;
        this.scene = game;
        this.index = index;
    }

    play(board){
        this.render();
    }

    render(){
        const w = this.game.columnWidth * 2 * 0.95;
        const h = this.scene.scale.height / 5;

        const y = this.index * h + h / 2;
        const x = this.game.columnWidth;

        this.scene.add.rectangle(x, y, w, h * 0.95, 0xdddddd).setOrigin(0.5).setStrokeStyle(4, 0x000000);
        this.scene.add.text(x, y, this.desc, {
            fontSize: 32,
            color: '#000000',
            fontFamily: 'Kode Mono',
            wordWrap: { width: w * 0.8 },
            align: 'center'
        }).setOrigin(0.5);
    }
}