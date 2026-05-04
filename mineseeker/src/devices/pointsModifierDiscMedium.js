import Device from "../device.js";

export default class PointsModifierDiscMedium extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +4 for medium mines. Rest mines will give -1 points modifier.";
    }

    use(board){
        if(board.currentPointsModifier[0] > 0) {
            board.currentPointsModifier[0] -= 1;
        }
        board.currentPointsModifier[1] += 4;
        if(board.currentPointsModifier[2] > 0) {
            board.currentPointsModifier[2] -= 1;
        }
    }
}