import Device from "../device.js";

export default class PointsMultiplierDiscMedium extends Device {
    static enabled = true;
    
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 1;
        this.desc = "Points Multiplier +3 for medium mines. Rest mines will give -1 points multiplier.";
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