import Device from "../device.js";

export default class PointsMultiplierOnlySmall extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Multiplier +4 if small mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            board.currentPointsMultiplier[0] += 4;
        }
    }
}