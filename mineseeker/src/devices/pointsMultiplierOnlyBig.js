import Device from "../device.js";

export default class PointsMultiplierOnlyBig extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +2 if big mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb < 3 && !cell.exploded).length === 0) {
            board.currentPointsMultiplier[2] += 2;
        }
    }
}