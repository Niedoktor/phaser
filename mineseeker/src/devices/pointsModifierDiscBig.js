import Device from "../device.js";

export default class PointsModifierDiscBig extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +3 for big mines. Rest mines will give -1 points modifier.";
    }

    use(){
        this.board.currentPointsModifier[0] -= 1;
        this.board.currentPointsModifier[1] -= 1;
        this.board.currentPointsModifier[2] += 3;
    }
}