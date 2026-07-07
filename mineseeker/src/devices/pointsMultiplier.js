import Device from "../device.js";

export default class PointsMultiplier extends Device {
    static enabled = true;
    
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Points Multiplier +1 to all mines";
    }

    use(board){
        for(let i = 0; i < board.currentPointsMultiplier.length; i++) {
            board.currentPointsMultiplier[i] += 1;
        }
    }
}