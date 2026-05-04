import Device from "../device.js";

export default class PointsMultiplierDiscMedium extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +3 for medium mines. Rest mines will give -1 points modifier.";
    }

    use(board){
        board.currentPointsMultiplier[1] += 3;
        if(board.currentPointsMultiplier[0] > 0) {
            board.currentPointsMultiplier[0] -= 1;
        }
        if(board.currentPointsMultiplier[2] > 0) {
            board.currentPointsMultiplier[2] -= 1;
        }
    }
}