import Device from "../device.js";

export default class ScannerModifierRange extends Device {
    constructor(board) {
        super(board);
        this.desc = "Scanner Range +1.";
    }

    play(){
        this.board.scannerRange++;
        this.render();
    }
}