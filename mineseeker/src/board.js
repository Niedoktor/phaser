import Phaser from 'phaser';
import { Cell } from './cell';
import LooseForm from './looseForm';
import WinForm from './winForm';
import ShopForm from './shopForm';
import PropertyArray from './propertyArray';
import property from './property';
import InfoPanel from './infoPanel';

export default class Board
{
    constructor (game, sceneX, sceneY, cellSize, width, height, mines)
    {
        this.game = game;
        this.scene = game;

        this.sceneX = sceneX;
        this.sceneY = sceneY;
        this.sceneW = cellSize * width;
        this.sceneH = cellSize * height;

        this.cellSize = cellSize;

        this.width = width;
        this.height = height;
        this.size = width * height;

        property(this, 'minesQty', 'board.minesQty');
        property(this, 'playing', 'board.playing');
        property(this, 'populated', 'board.populated');
        property(this, 'scannerRange', 'board.scannerRange');

        property(this, 'timeCounter', 'board.timeCounter', (val) => {
            InfoPanel.instance.timeCounterDisplay.setText(InfoPanel.instance.timeCounterDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'scansCounter', 'board.scansCounter', (val) => {
            InfoPanel.instance.scansCounterDisplay.setText(InfoPanel.instance.scansCounterDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'pointsCounter', 'board.pointsCounter', (val) => {
            InfoPanel.instance.pointsCounterDisplay.setText(InfoPanel.instance.pointsCounterDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'minesCounter', 'board.minesCounter', (val) => {
            InfoPanel.instance.minesCounterDisplay.setText(InfoPanel.instance.minesCounterDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'scoreTarget', 'board.scoreTarget', (val) => {
            InfoPanel.instance.scoreTargetDisplay.setText(InfoPanel.instance.scoreTargetDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'reward', 'board.reward', (val) => {
            InfoPanel.instance.rewardDisplay.setText(InfoPanel.instance.rewardDisplay.textTemplate.replace('{val}', val));
        });

        if(mines > 0){
            this.minesQty = mines;
            this.playing = false;
            this.populated = false;
            this.scannerRange = 0;
        }
        
        this.pointsModifier = [0, 0, 0];
        this.pointsMultiplier = [1, 1, 1];

        this.data = [];

        this.container = this.scene.add.container(this.sceneX, this.sceneY);

        const w = this.sceneW / (this.minesQty + 1);
        const x = this.sceneX + this.sceneW / 2 - ((this.minesQty - 1) / 2) * w;
        
        this.legendContainer = this.scene.add.container(x, (this.sceneY - w) / 2);

        this.initBoard();
    }

    async initBoard() {
        this.createCells();
        if(this.populated) {
            this.minedCells = new PropertyArray('board.mines');
            this.minedCells.forEach(mine => {
                const cell = this.getCell(mine.cellIndex);
                mine.cell = cell;
                if(cell.open) cell.createMine();
            });
            this.minedCells.sort((a, b) => { return b.cell.mineSize - a.cell.mineSize; });
            this.data.forEach(column => {
                column.forEach(cell => {
                    cell.render();
                });
            });
            this.drawLegend();
        }else await this.newBoard();
    }

    async newBoard(){
        this.timeCounter = 99;
        this.scansCounter = 5;
        this.pointsCounter = 0;
        this.scansCounter = 5;
        this.pointsCounter = 0;
        this.minesCounter = this.minesQty;
        this.scoreTarget = this.game.level == 1 ? this.game.firstLevelScore : 2.5 * (this.game.level - 1) * this.game.firstLevelScore;
        this.reward = Math.floor(this.game.firstLevelReward + this.game.level / 3);

        this.playDevices();
    }

    playDevices() {
        this.game.devicesInstances.forEach(device => {
            device.play(this);
        });
    }

    createCells ()
    {
        let i = 0;

        for (let x = 0; x < this.width; x++)
        {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++)
            {
                this.data[x][y] = new Cell(this, i, x, y, this.cellSize);

                i++;
            }
        }
    }

    drawLegend(){
        const w = this.sceneW / (this.minesQty + 1);

        let i = 0;
        this.minedCells.forEach(cell => {
            const x = i++ * w;

            this.legendContainer.add(this.scene.add.rectangle(x, 0, w, w, 0xdddddd).setStrokeStyle(4, 0x000000).setOrigin(0.5, 0));

            cell.cell.mineLegend = cell.cell.mineClass.legend(this.scene, w, x, w / 2, cell.cell.mineSize, cell.cell.mineParams);
            this.legendContainer.add(cell.cell.mineLegend);
            if(cell.cell.exploded) {
                cell.cell.changeMineLegendLabel();
            }
        });
    }

    async generate (startIndex)
    {
        this.minedCells = this.generateMines(startIndex);
        this.minedCells.sort((a, b) => { return b.cell.mineSize - a.cell.mineSize; });

        this.minedCells.forEach(cell => {
            //  Update the 8 cells around this bomb cell
            const adjacent = this.getAdjacentCells(cell.cell);

            adjacent.forEach(adjacentCell => {

                if (adjacentCell && !adjacentCell.mineSize)
                {
                    adjacentCell.value++;
                }
            });
        });

        this.playing = true;
        this.populated = true;

        this.drawLegend();

        // for (let x = 0; x < this.width; x++)
        // {
        //     for (let y = 0; y < this.height; y++)
        //     {
        //         this.data[x][y].scan();
        //     }
        // }        
    }

    getCell (index)
    {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.data[pos.y][pos.x];
    }

    getCellXY (x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        {
            return null;
        }

        return this.data[x][y];
    }

    getAdjacentCells (cell)
    {
        return [
            //  Top-Left, Top-Middle, Top-Right
            this.getCellXY(cell.x - 1, cell.y - 1),
            this.getCellXY(cell.x, cell.y - 1),
            this.getCellXY(cell.x + 1, cell.y - 1),

            //  Left, Right
            this.getCellXY(cell.x - 1, cell.y),
            this.getCellXY(cell.x + 1, cell.y),

            //  Bottom-Left, Bottom-Middle, Bottom-Right
            this.getCellXY(cell.x - 1, cell.y + 1),
            this.getCellXY(cell.x, cell.y + 1),
            this.getCellXY(cell.x + 1, cell.y + 1)
        ];
    }

    floodFill (x, y)
    {
        const cell = this.getCellXY(x, y);

        if (cell && !cell.open && !cell.mineSize)
        {
            cell.show();

            if (cell.value === 0)
            {
                this.floodFill(x, y - 1);
                this.floodFill(x, y + 1);
                this.floodFill(x - 1, y);
                this.floodFill(x + 1, y);
                this.floodFill(x - 1, y - 1);
                this.floodFill(x - 1, y + 1);
                this.floodFill(x + 1, y - 1);
                this.floodFill(x + 1, y + 1);
            }
        }
    }

    destroy(){
        this.container.destroy();
        this.legendContainer.destroy();
        this.data.forEach(column => {
            column.forEach(cell => {
                cell.destroy();
            });
        });
    }

    checkWinLooseConditions ()
    {
        if(this.minesCounter === 0 && this.pointsCounter < this.scoreTarget) {
            this.playing = false;
            new LooseForm(this, this.scene.scale.width / 4, this.scene.scale.height / 4);
        }
        if(this.pointsCounter >= this.scoreTarget) {
            this.playing = false;
            new WinForm(this, this.scene.scale.width / 4, this.scene.scale.height / 4);
        }
    }

    generateMines (startIndex)
    {
        const mines = new PropertyArray('board.mines', true);
        const minesInPlay = [...this.game.minesInPlay];

        let minesPlaced = 0;
        while(minesPlaced < this.minesQty) {
            const location = Phaser.Math.Between(0, this.size - 1);
            const cell = this.getCell(location);

            if (!cell.mineSize && cell.index !== startIndex)
            {
                const p = Phaser.Math.Between(0, minesInPlay.length - 1);
                const m = minesInPlay[p];

                cell.mineSize = m.size;
                cell.mineClass = m.class;
                cell.mineParams = cell.mineClass.setMineParams(m.size);

                minesPlaced++;
                mines.push({ cellIndex: cell.index });

                minesInPlay.splice(p, 1);
            }
        };

        mines.forEach(mine => {
            const cell = this.getCell(mine.cellIndex);
            mine.cell = cell;
        });

        return mines;
    }
}