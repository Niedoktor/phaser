import Device from "../device.js";

export default class PointsMultiplierOnlyBig extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +1 if big mines left only";
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb < 3 && !cell.exploded).length === 0) {
            this.board.currentPointsMultiplier[2]++;
        }
    }
}