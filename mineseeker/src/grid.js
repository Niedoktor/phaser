import Phaser from 'phaser';

export class Grid extends Phaser.Scene {
  constructor() {
    super('Grid');
  }

  preload() {
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const cellSize = height / 10;

    this.add.grid(0, 0, width, height, cellSize, cellSize, 0xffffff).setOutlineStyle(0x000000).setOrigin(0);
  }

  update() {
  }
}
