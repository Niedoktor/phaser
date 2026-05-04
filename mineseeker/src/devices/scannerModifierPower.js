import Device from "../device.js";

export default class ScannerModifierPower extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Scanner Power +1.";
    }

    play(board){
        board.scansCounter++;
        this.render();
    }
}