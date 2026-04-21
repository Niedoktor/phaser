export default class Device {
    desc;

    constructor(board) {
        this.board = board;
    }   

    render(){
        const y = this.board.sceneY + (this.board.devicesInPlay.length - 1) * 2 * this.board.cellSize + 8;
        const x = 14;
        const w = this.board.sceneX - 28;
        const h = this.board.cellSize * 2 - 16;

        this.board.scene.add.rectangle(x, y, w, h, 0x000000, 0.1).setOrigin(0, 0).setStrokeStyle(4, 0x000000);
        this.board.scene.add.text(x + w / 2, y + h / 2, this.desc, {
            fontSize: 32,
            color: '#000000',
            fontFamily: 'Kode Mono',
            wordWrap: { width: w - 20 },
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }
}