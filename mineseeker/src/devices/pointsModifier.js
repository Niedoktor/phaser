import Device from "../device.js";

export default class PointsModifier extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Points Modifier +1 to all mines";
    }

    use(board) {
        for(let i = 0; i < board.currentPointsModifier.length; i++) {
            board.currentPointsModifier[i] += 1;
        }
    }
}