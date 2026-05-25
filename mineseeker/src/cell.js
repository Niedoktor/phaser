import Phaser from 'phaser';
import FragMine from './mines/fragMine';
import Style from './styles';

export class Cell
{
    constructor (board, index, x, y, size)
    {
        this.board = board;
        this.scene = board.scene;

        this.index = index;
        this.x = x;
        this.y = y;

        this.size = size;

        this.sceneX = x * this.size + this.board.sceneX;
        this.sceneY = y * this.size + this.board.sceneY;

        this.open = false;
        this.mineSize = false;

        this.exploded = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;

        this.tile = this.scene.add.rectangle(this.x * this.size, this.y * this.size, this.size, this.size, 0x000000).setOrigin(0).setStrokeStyle(4, 0xffffff);
        this.board.container.add(this.tile);
        this.tile.setInteractive();

        this.tile.on('pointerdown', this.onPointerDown, this);
        this.tile.on('pointerover', this.onPointerOver, this);
        this.tile.on('pointerout', this.onPointerOut, this);
    }

    onPointerOver (pointer){
        if(this.board.playing && !this.exploded&& this.mine && this.mine.mine) {
            this.mine.drawRange();
        }
    }

    onPointerOut (pointer){
        if(this.board.playing && this.mine && this.mine.rangeArea) {
            this.mine.rangeArea.destroy();
        }
    }

    async onPointerDown (pointer)
    {
        if (!this.board.populated)
        {
            await this.board.generate(this.index);
        }

        const frags = this.scene.children.list.filter(gameObject => gameObject.frag).length;

        if ((this.open && !this.mineSize) || !this.board.playing || this.exploded || frags > 0)
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

                        if(cell.mineSize){
                            const x = this.board.sceneX + cell.x * cell.size;
                            const y = this.board.sceneY + cell.y * cell.size;
                            const f = cell.size / 20;

                            cell.mine = new cell.mineClass(cell, x, y, f, cell.mineSize);

                            cell.mine.mine.setOnCollide(() => {
                                if(cell.mine.mine) cell.cellBlowUp(cell.mine);
                            })
                        }
                    }
                }
            }
        }
    }

    cellBlowUp (mine)
    {
        this.exploded = true;        
        this.board.pointsCounter += (mine.size + this.board.currentPointsModifier[mine.size - 1]) * this.board.sequence * this.board.currentPointsMultiplier[mine.size - 1];
        this.board.sequence++;
        this.board.minesCounter--;
        mine.blowUp(() => {
            const frags = this.scene.children.list.filter(gameObject => gameObject.frag).length;
            if(frags === 0) {
                document.body.style.cursor = 'default';
                this.board.checkWinLooseConditions();
            }
        });

        if(this.mineLegend) {
            this.mineLegendX = this.scene.add.text(this.mineLegend.x, this.mineLegend.y, 'X', Style.red12).setOrigin(0.5, 0.5);
            this.mineLegend.setAlpha(0.5);
            this.board.legendContainer.add(this.mineLegendX);
        }

        if(this.mine.rangeArea) {
            this.mine.rangeArea.destroy();
        }        
    }

    onClick ()
    {
        if (this.mineSize)
        {
            document.body.style.cursor = 'wait';
            
            if(!this.open){
                this.scan();
            }
            this.board.sequence = 1;
            this.board.currentPointsModifier = Phaser.Utils.Objects.DeepCopy(this.board.pointsModifier);
            this.board.currentPointsMultiplier = Phaser.Utils.Objects.DeepCopy(this.board.pointsMultiplier);
            this.board.game.devicesInPlay.forEach(device => {
                if(device.inst.use){
                    device.inst.use(this.board);
                }
            });
            this.cellBlowUp(this.mine);
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
        if(this.open) return;

        if(this.value > 0) {
            const val = this.scene.add.text(this.x * this.size + (this.size / 2), this.y * this.size + (this.size / 2), this.value, Style.bla7).setOrigin(0.5);
            this.board.container.add(val);
        }

        this.tile.setFillStyle(0xffffff);
        this.tile.setStrokeStyle(4, 0x000000);

        this.open = true;
    }

    destroy()
    {
        this.tile.destroy();
        if(this.mineLegend) this.mineLegend.destroy();
        if(this.mine) this.mine.destroy();
    }
}