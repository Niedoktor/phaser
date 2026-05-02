export default class Device {
    desc;

    constructor(board) {
        this.board = board;
    }

    play(){
        this.render();
    }

    render(){
        const w = this.board.sceneX * 0.95;
        const h = this.board.scene.scale.height / 5;

        const y = (this.board.devicesInPlay.length - 1) * h + h / 2;
        const x = this.board.sceneX / 2;

        this.board.scene.add.rectangle(x, y, w, h * 0.9, 0xdddddd).setOrigin(0.5).setStrokeStyle(4, 0x000000);
        this.board.scene.add.text(x, y, this.desc, {
            fontSize: 32,
            color: '#000000',
            fontFamily: 'Kode Mono',
            wordWrap: { width: w * 0.8 },
            align: 'center'
        }).setOrigin(0.5);
    }
}