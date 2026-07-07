import Device from "../device.js";

export default class PointsModifierByScansLeft extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Points Modifier +X to all mines where X is the number of scans left.";
    }

    use(board) {
        for(let i = 0; i < board.currentPointsModifier.length; i++) {
            board.currentPointsModifier[i] += board.scansCounter;
        }
    }

    static tryUnlock(board) {
        if(board.scansCounter > board.game.scansCount - 2) {
            return true;
        }
        return false;
    }
}