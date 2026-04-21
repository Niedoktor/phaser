import Device from "../device.js";

export default class PointsModifier extends Device {
    constructor(board) {
        super(board);
        this.desc = "Points Modifier +1";
    }

    play(){
        this.board.currentPointsModifier++;
        this.render();
    }
}