import Device from "../device.js";

export default class PointsModifierOnlySmall extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 3;
        this.desc = "Points Modifier +4 if small mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            board.currentPointsModifier[0] += 4;
        }
    }

    static tryUnlock(board) {
        return false;
    }
}