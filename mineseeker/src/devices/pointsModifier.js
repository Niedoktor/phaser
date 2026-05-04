import Device from "../device.js";

export default class PointsModifier extends Device {
    constructor(game, index) {
        super(game, index);
        this.desc = "Points Modifier +1 to all mines";
    }

    use(board) {
        board.currentPointsModifier = board.currentPointsModifier.map(mod => mod + 1);
    }
}