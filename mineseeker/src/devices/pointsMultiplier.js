import Device from "../device.js";

export default class PointsMultiplier extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +1";
    }

    play(){
        this.board.currentPointsMultiplier++;
        this.render();
    }
}