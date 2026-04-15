import Phaser from 'phaser';
import { Board } from './board';

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
     WebFont.load({
            google: {
                families: [ 'Roboto Mono', 'Doto', 'Sixtyfour', 'Kode Mono' ]
            }});

    const width = 10;
    const height = 10;
    const cellSize = (this.scale.height - 150) / height;
    const x = Math.floor((this.scale.width / 2) - (width * cellSize) / 2);
    const y = 100;

    //  0 = waiting to create the grid
    //  1 = playing
    //  2 = game won
    //  3 = game lost
    this.state = 0;

    this.board = new Board(this, x, y, cellSize, width, height, 20);
  }

  update() {
  }
}
