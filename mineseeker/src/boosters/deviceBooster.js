import Booster from "../booster.js";

export default class DeviceBooster extends Booster {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.priceTier = 2;
        this.desc = "Choose 1 device from 3 possibilities.";
    }
}