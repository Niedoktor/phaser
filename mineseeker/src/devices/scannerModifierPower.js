import Device from "../device.js";

export default class ScannerModifierPower extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.desc = "Scanner Power +1.";
        this.priceTier = 1;
    }

    play(board){
        board.scansCounter++;
        this.render();
    }
}