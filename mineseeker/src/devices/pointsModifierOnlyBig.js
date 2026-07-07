import Device from "../device.js";

export default class PointsModifierOnlyBig extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 3;
        this.desc = "Points Modifier +2 if big mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb < 3 && !cell.exploded).length === 0) {
            board.currentPointsModifier[2] += 2;
        }
    }

    static tryUnlock(board) {
        return false;
    }
}