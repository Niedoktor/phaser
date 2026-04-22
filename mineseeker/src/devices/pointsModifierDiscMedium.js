import Device from "../device.js";

export default class PointsModifierDiscMedium extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +3 for medium mines. Rest mines will give -1 points modifier.";
    }

    use(){
        this.board.currentPointsModifier[0] -= 1;
        this.board.currentPointsModifier[1] += 3;
        this.board.currentPointsModifier[2] -= 1;
    }
}