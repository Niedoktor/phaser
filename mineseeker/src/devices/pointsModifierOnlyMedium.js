import Device from "../device.js";

export default class PointsModifierOnlyMedium extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +3 if medium mines left only";
    }

    use(board){
        if (board.minedCells.filter(cell => cell.bomb !== 2 && !cell.exploded).length === 0) {
            board.currentPointsModifier[1] += 3;
        }
    }
}