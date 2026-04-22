import Device from "../device.js";

export default class PointsModifier extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +1 to all mines";
    }

    use(){
        this.board.currentPointsModifier = this.board.currentPointsModifier.map(mod => mod + 1);
    }
}