import Device from "../device.js";

export default class PointsMultiplierOnlyMedium extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +3 if medium mines left only";
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb !== 2 && !cell.exploded).length === 0) {
            this.board.currentPointsMultiplier[1] += 3;
        }
    }
}