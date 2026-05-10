import Device from "../device.js";

export default class ScannerModifierRange extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.desc = "Scanner Range +1.";
        this.priceTier = 3;
    }

    play(board){
        board.scannerRange++;
        this.render();
    }
}