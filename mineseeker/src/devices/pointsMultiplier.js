import Device from "../device.js";

export default class PointsMultiplier extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Multiplier +1 to all mines";
    }

    use(){
        this.board.currentPointsMultiplier = this.board.currentPointsMultiplier.map(multiplier => multiplier + 1);
    }
}