import Device from "../device.js";

export default class PointsModifierDiscSmall extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +5 for small mines. Rest mines will give -1 points modifier.";
    }

    use(board){
        board.currentPointsModifier[0] += 5;
        if(board.currentPointsModifier[1] > 0) {
            board.currentPointsModifier[1] -= 1;
        }
        if(board.currentPointsModifier[2] > 0) {
            board.currentPointsModifier[2] -= 1;
        }
    }
}