import Device from "../device.js";

export default class PointsMultiplierDiscBig extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +3 for big mines. Rest mines will give -1 points modifier.";
    }

    use(){
        this.board.currentPointsMultiplier[2] += 3;
        if(this.board.currentPointsMultiplier[0] > 0) {
            this.board.currentPointsMultiplier[0] -= 1;
        }
        if(this.board.currentPointsMultiplier[1] > 0) {
            this.board.currentPointsMultiplier[1] -= 1;
        }
    }
}