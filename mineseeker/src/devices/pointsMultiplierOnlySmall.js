import Device from "../device.js";

export default class PointsMultiplierOnlySmall extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +3 if small mines left only";
    }

    play(){
        this.render();
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            this.board.currentPointsMultiplier += 3;
        }
    }
}