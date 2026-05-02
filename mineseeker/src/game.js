import Phaser from 'phaser';
import Board from './board';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.matter.world.engine.timing.timeScale = 0.25;
        this.tweens.timeScale = 0.25;

        const width = 10;
        const height = 10;
        const y = Math.floor(this.scale.height * 0.1);
        const cellSize = (this.scale.height - y - this.scale.height * 0.01) / height;
        const x = Math.floor((this.scale.width / 2) - (width * cellSize) / 2);

        this.board = new Board(this, x, y, cellSize, width, height, 12);    
    }

    update() {
    }
}
