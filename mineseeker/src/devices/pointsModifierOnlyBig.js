import Device from "../device.js";

export default class PointsModifierOnlyBig extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +2 if big mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb < 3 && !cell.exploded).length === 0) {
            board.currentPointsModifier[2] += 2;
        }
    }
}