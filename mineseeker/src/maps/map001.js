import Phaser from 'phaser';

export default function generateMines(board, mineCount, startIndex) {
    const mines = [];

    do {
        const location = Phaser.Math.Between(0, board.size - 1);

        const cell = board.getCell(location);

        if (!cell.bomb && cell.index !== startIndex)
        {
            cell.bomb = Phaser.Math.Between(1, 3);

            mineCount--;

            mines.push(cell);
        }

    } while (mineCount > 0);

  return mines;
}