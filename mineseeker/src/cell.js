import Phaser from 'phaser';
import Style from './styles';
import property from './property';

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

        property(this, 'open', `cell.${index}.open`);
        property(this, 'mineClass', `cell.${index}.mineClass`);
        property(this, 'mineSize', `cell.${index}.mineSize`);
        property(this, 'mineParams', `cell.${index}.mineParams`);
        property(this, 'value', `cell.${index}.value`);
        property(this, 'exploded', `cell.${index}.exploded`);
        property(this, 'pointsModifier', `cell.${index}.pointsModifier`);
        property(this, 'pointsMultiplier', `cell.${index}.pointsMultiplier`);

        if(!board.populated){
            this.open = false;
            this.exploded = false;
            //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
            this.value = 0;
            this.mineClass = undefined;
            this.mineSize = 0;
            this.mineParams = undefined;
            this.pointsModifier = undefined;
            this.pointsMultiplier = undefined;
        }

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
                        cell.createMine();
                    }
                }
            }
        }
    }

    createMine(){
        if(this.mineSize){
            const x = this.board.sceneX + this.x * this.size;
            const y = this.board.sceneY + this.y * this.size;
            const f = this.size / 20;

            this.mine = new this.mineClass(this, x, y, f, this.mineSize);

            if(this.mine.mine) {
                this.mine.mine.setOnCollide(() => {
                    if(this.mine.mine) this.cellBlowUp(this.mine);
                })
            }
        }
    }

    cellBlowUp (mine)
    {
        this.exploded = true;

        this.pointsModifier = this.board.currentPointsModifier[mine.size - 1];
        this.pointsMultiplier = this.board.currentPointsMultiplier[mine.size - 1] * this.board.sequence;

        this.board.pointsCounter += (mine.size + this.pointsModifier) * this.pointsMultiplier;

        this.board.sequence++;
        this.board.minesCounter--;
        mine.blowUp(() => {
            const frags = this.scene.children.list.filter(gameObject => gameObject.frag).length;
            if(frags === 0) {
                document.body.style.cursor = 'default';
                this.board.checkWinLooseConditions();
            }
        });

        this.changeMineLegendLabel();

        if(this.mine.rangeArea) {
            this.mine.rangeArea.destroy();
        }        
    }

    changeMineLegendLabel() {
        if (this.mineLegend) {
            this.mineLegendX = this.scene.add.text(this.mineLegend.x, this.mineLegend.y, 'X', Style.red12).setOrigin(0.5, 0.5);
            this.mineLegend.setAlpha(0.5);
            this.board.legendContainer.add(this.mineLegendX);
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
            this.board.game.devicesInstances.forEach(device => {
                if(device.use){
                    device.use(this.board);
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

        this.open = true;
        this.render();
    }

    render(){
        if(this.open) {
            if(this.value > 0) {
                if(this.valueText) this.valueText.destroy();

                this.valueText = this.scene.add.text(this.x * this.size + (this.size / 2), this.y * this.size + (this.size / 2), this.value, Style.bla7).setOrigin(0.5);
                this.board.container.add(this.valueText);
            }

            this.tile.setFillStyle(0xffffff);
            this.tile.setStrokeStyle(4, 0x000000);
        }
    }

    destroy()
    {
        this.tile.destroy();
        if(this.mineLegend) this.mineLegend.destroy();
        if(this.mine) this.mine.destroy();
    }
}