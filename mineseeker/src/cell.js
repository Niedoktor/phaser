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
                this.scan(this.board.scannerRange);
                this.board.scansCounter--;
            }
        }
        else if (this.board.timeCounter > 0)
        {
            this.onClick();
        }
    }

    scan (range = 0)
    {
        for(let x = this.x - range; x <= this.x + range; x++){
            for(let y = this.y - range; y <= this.y + range; y++){
                const cell = this.board.getCellXY(x, y);
                if(cell){
                    if(!cell.open){
                        cell.show();
                    }
                    if(cell.bomb){
                        const x = this.board.sceneX + cell.x * cell.cellSize + (cell.cellSize / 2);
                        const y = this.board.sceneY + cell.y * cell.cellSize + (cell.cellSize / 2);
                        const r = cell.cellSize * (0.1 + cell.bomb * 0.1);
                        const f = cell.cellSize / 20;
                        const er = cell.cellSize * cell.bomb;

                        cell.mine = new Mine(this.scene, x, y, r, f, cell.bomb, er);

                        cell.mine.mine.setOnCollide(() => {
                            if(cell.mine.mine) cell.mineBlowUp(cell.mine);
                        })
                    }
                }
            }
        }
    }

    mineBlowUp (mine)
    {
        this.board.pointsCounter += mine.power * this.board.sequence;
        this.board.sequence++;
        mine.blowUp();

        if(this.mineLegend) {
            this.mineLegendX = this.scene.add.text(this.mineLegend.x, this.mineLegend.y, 'X', {
                fontSize: 20 * mine.power,
                color: '#ff0000',
                fontFamily: 'Sixtyfour'
            }).setOrigin(0.5, 0.45);
            this.mineLegend.setAlpha(0.5);
        }
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