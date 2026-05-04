import Device from "../device.js";

export default class PointsMultiplierOnlyMedium extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +3 if medium mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb !== 2 && !cell.exploded).length === 0) {
            board.currentPointsMultiplier[1] += 3;
        }
    }
}