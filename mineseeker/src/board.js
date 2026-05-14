import Phaser from 'phaser';
import { Cell } from './cell';
import LooseForm from './looseForm';
import WinForm from './winForm';
import ShopForm from './shopForm';

export default class Board
{
    #timeCounter;
    #scansCounter;
    #pointsCounter;
    #minesCounter;
    #scoreTarget;
    #reward;

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

        this.minesQty = mines;

        this.playing = false;        
        this.populated = false;

        this.scannerRange = 0;
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
        await this.newBoard();        
    }

    set timeCounter(val){
        this.#timeCounter = val;
        this.game.timeCounterDisplay.setText(`Time ${this.#timeCounter}`);
    }
    get timeCounter(){
        return this.#timeCounter;
    }
    
    set scansCounter(val){
        this.#scansCounter = val;
        this.game.scansCounterDisplay.setText(`Scans ${this.#scansCounter}`);
    }
    get scansCounter(){
        return this.#scansCounter;
    }

    set pointsCounter(val){
        this.#pointsCounter = val;
        this.game.pointsCounterDisplay.setText(`Score ${this.#pointsCounter}`);
    }
    get pointsCounter(){
        return this.#pointsCounter;
    }

    set minesCounter(val){
        this.#minesCounter = val;
        this.game.minesCounterDisplay.setText(`Mines ${this.#minesCounter}`);
    }
    get minesCounter(){
        return this.#minesCounter;
    }

    set scoreTarget(val){
        this.#scoreTarget = val;
        this.game.scoreTargetDisplay.setText(`${this.#scoreTarget}`);
    }
    get scoreTarget(){
        return this.#scoreTarget;
    }

    set reward(val){
        this.#reward = val;
        this.game.rewardDisplay.setText(`Reward ${this.#reward}$`);
    }
    get reward(){
        return this.#reward;
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
        this.game.devicesInPlay.forEach(device => {
            device.inst.play(this);
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

    async generate (startIndex)
    {
        //const mines = this.generateThreeMines(startIndex);
        this.minedCells = this.generateRandomMines(startIndex);

        this.minedCells.sort((a, b) => { return b.mineSize - a.mineSize; });

        const w = this.sceneW / (this.minesQty + 1);

        let i = 0;
        this.minedCells.forEach(cell => {
            const x = i * w

            this.legendContainer.add(this.scene.add.rectangle(x, 0, w, w, 0xdddddd).setStrokeStyle(4, 0x000000).setOrigin(0.5, 0));
            this.legendContainer.add(cell.mineClass.legend(cell, x, w / 2, i++));

            //  Update the 8 cells around this bomb cell
            const adjacent = this.getAdjacentCells(cell);

            adjacent.forEach(adjacentCell => {

                if (adjacentCell && !adjacentCell.mineSize)
                {
                    adjacentCell.value++;
                }
            });
        });

        this.playing = true;
        this.populated = true;

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

        return this.data[pos.x][pos.y];
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

    generateRandomMines (startIndex, sizeDistribution = [1.0 / 3, 1.0 / 3, 1.0 / 3])
    {
        const mines = [];
        sizeDistribution = sizeDistribution.map((val, index) => { return this.minesQty * val; });

        let minesPlaced = 0;
        do {
            const location = Phaser.Math.Between(0, this.size - 1);
            const cell = this.getCell(location);

            if (!cell.mineSize && cell.index !== startIndex)
            {
                do {
                    const p = Phaser.Math.Between(0, sizeDistribution.length - 1);
                    if(sizeDistribution[p] > 0) {
                        cell.mineSize = p + 1;
                        cell.mineClass = this.game.mines[0].class;
                        cell.mineClass.setMineParams(cell);
                        sizeDistribution[p]--;
                    }
                } while (!cell.mineSize);

                minesPlaced++;

                mines.push(cell);
            }

        } while (minesPlaced < this.minesQty);

        return mines;
    }

    generateThreeMines (startIndex)
    {
        const mines = [];

        let cell = this.getCellXY(3, 4);
        cell.mineSize = 1;
        mines.push(cell);
        cell = this.getCellXY(5, 4);
        cell.mineSize = 3;
        mines.push(cell);
        cell = this.getCellXY(7, 4);
        cell.mineSize = 2;
        mines.push(cell);

        return mines;
    }
}