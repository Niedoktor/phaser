import Phaser from 'phaser';

export class Cell
{
    constructor (board, index, x, y, cellSize)
    {
        this.board = board;
        this.scene = board.scene;

        this.index = index;
        this.x = x;
        this.y = y;

        this.cellSize = cellSize;

        this.open = false;
        this.bomb = false;

        this.flagged = false;
        this.query = false;
        this.exploded = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;

        this.tile = this.scene.add.rectangle(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize, 0x000000).setOrigin(0).setStrokeStyle(2, 0xffffff);
        this.board.container.add(this.tile);
        this.tile.setInteractive();

        this.tile.on('pointerdown', this.onPointerDown, this);
        //this.tile.on('pointerup', this.onPointerUp, this);
    }

    onPointerDown (pointer)
    {
        if (!this.board.populated)
        {
            this.board.generate(this.index);
        }

        if (this.open || !this.board.playing)
        {
            return;
        }

        if (pointer.rightButtonDown())
        {
            if (this.query)
            {
                this.query = false;
                //this.tile.setFrame(0);
            }
            else if (this.flagged)
            {
                this.query = true;
                this.flagged = false;
                //this.board.updateBombs(-1);
                //this.tile.setFrame(3);
            }
            else if (!this.flagged)
            {
                this.flagged = true;
                //this.tile.setFrame(2);
                //this.board.updateBombs(1);
                //this.board.checkWinState();
            }
        }
        else if (!this.flagged && !this.query)
        {
            this.onClick();
        }
    }

    onClick ()
    {
        if (this.bomb)
        {
            this.exploded = true;

            //this.grid.gameOver();
        }
        else
        {
            if (this.value === 0)
            {
                this.board.floodFill(this.x, this.y);
            }
            else
            {
                this.show();
            }

            //this.board.button.setFrame(2);
            //this.board.checkWinState();
        }
    }

    show ()
    {
        if(this.value > 0) {
            const val = this.scene.add.text(this.x * this.cellSize + (this.cellSize / 2), this.y * this.cellSize + (this.cellSize / 2), this.value, {
                fontSize: 64,
                color: '#000000',
                fontFamily: 'Kode Mono'
            }).setOrigin(0.5);
            this.board.container.add(val);
        }

        this.tile.setFillStyle(0xffffff);
        this.tile.setStrokeStyle(2, 0x000000);

        this.open = true;
    }
}