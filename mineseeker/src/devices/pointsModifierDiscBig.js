import Device from "../device.js";

export default class PointsModifierDiscBig extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 1;
        this.desc = "Points Modifier +3 for big mines. Rest mines will give -1 points modifier.";
    }

    use(board){
        if(board.currentPointsModifier[0] > 0) {
            board.currentPointsModifier[0] -= 1;
        }
        if(board.currentPointsModifier[1] > 0) {
            board.currentPointsModifier[1] -= 1;
        }
        board.currentPointsModifier[2] += 3;
    }
}