import Device from "../device.js";

export default class PointsModifierByCash extends Device {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Points Modifier +X to all mines where X is the amount of cash available.";
    }

    use(board) {
        for(let i = 0; i < board.currentPointsModifier.length; i++) {
            board.currentPointsModifier[i] += board.game.cash;
        }
    }

    static tryUnlock(board) {
        if(board.game.cash >= board.game.initialMinePrice * 10) {
            return true;
        }
        return false;
    }
}