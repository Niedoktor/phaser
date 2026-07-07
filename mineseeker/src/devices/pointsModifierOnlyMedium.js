import Device from "../device.js";

export default class PointsModifierOnlyMedium extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 3;
        this.desc = "Points Modifier +3 if medium mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb !== 2 && !cell.exploded).length === 0) {
            board.currentPointsModifier[1] += 3;
        }
    }

    static tryUnlock(board) {
        return false;
    }
}