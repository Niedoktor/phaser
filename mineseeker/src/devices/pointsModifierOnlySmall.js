import Device from "../device.js";

export default class PointsModifierOnlySmall extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +4 if small mines left only";
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            this.board.currentPointsModifier[0] += 4;
        }
    }
}