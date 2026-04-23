import Device from "../device.js";

export default class PointsModifierOnlyMedium extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +3 if medium mines left only";
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb !== 2 && !cell.exploded).length === 0) {
            this.board.currentPointsModifier[1] += 3;
        }
    }
}