import Device from "../device.js";

export default class PointsModifierOnlyBig extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +1 if big mines left only";
    }

    play(){
        this.render();
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb < 3 && !cell.exploded).length === 0) {
            this.board.currentPointsModifier += 1;
        }
    }
}