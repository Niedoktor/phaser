import Device from "../device.js";

export default class PointsMultiplierDiscSmall extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +3 for small mines. Rest mines will give                                     -1 points modifier.";
    }

    use(){
        this.board.currentPointsMultiplier[0] += 3;
        if(this.board.currentPointsMultiplier[1] > 0) {
            this.board.currentPointsMultiplier[1] -= 1;
        }
        if(this.board.currentPointsMultiplier[2] > 0) {
            this.board.currentPointsMultiplier[2] -= 1;
        }
    }
}