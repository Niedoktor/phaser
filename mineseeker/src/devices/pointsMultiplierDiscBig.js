import Device from "../device.js";

export default class PointsMultiplierDiscBig extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +3 for big mines. Rest mines will give -1 points modifier.";
    }

    use(board){
        board.currentPointsMultiplier[2] += 3;
        if(board.currentPointsMultiplier[0] > 0) {
            board.currentPointsMultiplier[0] -= 1;
        }
        if(board.currentPointsMultiplier[1] > 0) {
            board.currentPointsMultiplier[1] -= 1;
        }
    }
}