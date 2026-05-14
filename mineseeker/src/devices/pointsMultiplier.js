import Device from "../device.js";

export default class PointsMultiplier extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Points Multiplier +1 to all mines";
    }

    use(board){
        board.currentPointsMultiplier = board.currentPointsMultiplier.map(multiplier => multiplier + 1);
    }
}