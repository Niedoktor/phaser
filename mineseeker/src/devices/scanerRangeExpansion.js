export default class ScanerRangeExpansion {
    constructor(board) {
        this.board = board;
    }

    play(){
        this.board.scannerRange++;
    }
}