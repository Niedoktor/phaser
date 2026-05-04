import Device from "../device.js";

export default class PointsMultiplierDiscSmall extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +3 for small mines. Rest mines will give                                     -1 points modifier.";
    }

    use(board){
        board.currentPointsMultiplier[0] += 3;
        if(board.currentPointsMultiplier[1] > 0) {
            board.currentPointsMultiplier[1] -= 1;
        }
        if(board.currentPointsMultiplier[2] > 0) {
            board.currentPointsMultiplier[2] -= 1;
        }
    }
}