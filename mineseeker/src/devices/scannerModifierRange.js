import Device from "../device.js";

export default class ScannerModifierRange extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 3;
        this.desc = "Scanner Range +1.";
    }

    play(board){
        board.scannerRange++;
    }
}