import Device from "../device.js";

export default class PointsMultiplierDiscSmall extends Device {
    static enabled = true;
    
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 1;
        this.desc = "Points Multiplier +3 for small mines. Rest mines will give -1 points multiplier.";
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