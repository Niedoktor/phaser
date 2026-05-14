import Device from "../device.js";

export default class ScannerModifierPower extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 1;
        this.desc = "Scanner Power +1.";
    }

    play(board){
        board.scansCounter++;
    }
}