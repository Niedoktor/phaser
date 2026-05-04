import Device from "../device.js";

export default class PointsModifierOnlySmall extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +4 if small mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            board.currentPointsModifier[0] += 4;
        }
    }
}