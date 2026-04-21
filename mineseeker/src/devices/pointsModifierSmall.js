import Device from "../device.js";

export default class PointsModifierSmall extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +4 for small mines. Rest mines will give -1 points";
    }

    play(){
        this.render();
    }

    use(){
        if (this.board.minedCells.filter(cell => cell.bomb > 1 && !cell.exploded).length === 0) {
            this.board.currentPointsModifier += 3;
        }
    }
}