import Device from "../device.js";

export default class PointsMultiplier extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +1 to all mines";
    }

    use(board){
        board.currentPointsMultiplier = board.currentPointsMultiplier.map(multiplier => multiplier + 1);
    }
}