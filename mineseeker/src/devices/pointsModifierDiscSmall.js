import Device from "../device.js";

export default class PointsModifierDiscSmall extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +3 for small mines. Rest mines will give -1 points modifier.";
    }

    use(){
        this.board.currentPointsModifier[0] += 3;
        if(this.board.currentPointsModifier[1] > 0) {
            this.board.currentPointsModifier[1] -= 1;
        }
        if(this.board.currentPointsModifier[2] > 0) {
            this.board.currentPointsModifier[2] -= 1;
        }
    }
}