import Device from "../device.js";

export default class ScannerModifierPower extends Device {
    constructor(board) {
        super(board);
        this.desc = "Scanner Power +1.";
    }

    play(){
        this.board.scansCounter++;
        this.render();
    }
}