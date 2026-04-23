import Device from "../device.js";

export default class PointsMultiplierDiscMedium extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +3 for medium mines. Rest mines will give -1 points modifier.";
    }

    use(){
        this.board.currentPointsMultiplier[1] += 3;
        if(this.board.currentPointsMultiplier[0] > 0) {
            this.board.currentPointsMultiplier[0] -= 1;
        }
        if(this.board.currentPointsMultiplier[2] > 0) {
            this.board.currentPointsMultiplier[2] -= 1;
        }
    }
}