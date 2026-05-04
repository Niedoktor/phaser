import Device from "../device.js";

export default class ScannerModifierRange extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Scanner Range +1.";
    }

    play(board){
        board.scannerRange++;
        this.render();
    }
}