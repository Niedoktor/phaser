import Phaser from 'phaser';
import { Mine } from './mine';

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

        // this.flagged = false;
        // this.query = false;
        this.exploded = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;

        this.tile = this.scene.add.rectangle(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize, 0x000000).setOrigin(0).setStrokeStyle(2, 0xffffff);
        this.board.container.add(this.tile);
        this.tile.setInteractive();

        this.tile.on('pointerdown', this.onPointerDown, this);
        //this.tile.on('pointerup', this.onPointerUp, this);
    }

    async onPointerDown (pointer)
    {
        if (!this.board.populated)
        {
            await this.board.generate(this.index);
        }

        if ((this.open && !this.bomb) || !this.board.playing || this.exploded)
        {
            return;
        }

        if (pointer.rightButtonDown())
        {
            if (!this.open && this.board.scansCounter > 0)
            {
                this.scan();
                this.board.scansCounter--;
            }
        }
        else if (this.board.timeCounter > 0)
        {
            this.onClick();
        }
    }

    scan ()
    {
        this.show();

        if(this.bomb){
            const x = this.board.sceneX + this.x * this.cellSize + (this.cellSize / 2);
            const y = this.board.sceneY + this.y * this.cellSize + (this.cellSize / 2);
            const r = this.cellSize * (0.1 + this.bomb * 0.1);
            const f = this.cellSize / 20;
            const er = this.cellSize * this.bomb;

            this.mine = new Mine(this.scene, x, y, r, f, this.bomb, er);

            this.mine.mine.setOnCollide(() => {
                if(this.mine.mine) this.mineBlowUp(this.mine);
            })
        }
    }

    mineBlowUp (mine)
    {
        this.board.pointsCounter += mine.power * this.board.sequence;
        this.board.sequence++;
        mine.blowUp();
    }

    onClick ()
    {
        if (this.bomb)
        {
            this.exploded = true;
            if(!this.open){
                this.scan();
            }
            this.board.sequence = 1;
            this.mineBlowUp(this.mine);
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
        }
        this.board.timeCounter--;        
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