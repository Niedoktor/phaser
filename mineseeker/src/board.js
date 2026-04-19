import Phaser from 'phaser';
import { Cell } from './cell';

export class Board
{
    #timeCounter;
    #scansCounter;
    #pointsCounter;

    constructor (scene, sceneX, sceneY, cellSize, width, height, mines)
    {
        this.scene = scene;

        this.sceneX = sceneX;
        this.sceneY = sceneY;

        this.cellSize = cellSize;

        this.width = width;
        this.height = height;
        this.size = width * height;

        this.bombQty = mines;
        this.bombsCounter = mines;

        this.playing = false;
        this.populated = false;

        this.data = [];

        this.container = this.scene.add.container(this.sceneX, this.sceneY);

        // this.button;

        this.createCells();
        this.createCounters();

        // this.button.setInteractive();

        // this.button.on('pointerdown', this.onButtonDown, this);
        // this.button.on('pointerup', this.onButtonUp, this);
    }

    set timeCounter(val){
        this.#timeCounter = val;
        this.timeCounterDisplay.setText(`TIME: ${this.#timeCounter}`);
    }
    get timeCounter(){
        return this.#timeCounter;
    }

    set scansCounter(val){
        this.#scansCounter = val;
        this.scansCounterDisplay.setText(`SCANS: ${this.#scansCounter}`);
    }
    get scansCounter(){
        return this.#scansCounter;
    }

    set pointsCounter(val){
        this.#pointsCounter = val;
        this.pointsCounterDisplay.setText(`POINTS: ${this.#pointsCounter}`);
    }
    get pointsCounter(){
        return this.#pointsCounter;
    }

    createCounters (){
        this.timeCounterDisplay = this.scene.add.text(this.sceneX, 14, ``, {
            fontSize: 64,
            color: '#000000',
            fontFamily: 'Kode Mono'
        });
        this.scansCounterDisplay = this.scene.add.text(this.sceneX + this.width * this.cellSize, 14, ``, {
            fontSize: 64,
            color: '#000000',
            fontFamily: 'Kode Mono'
        }).setOrigin(1, 0);
        this.pointsCounterDisplay = this.scene.add.text(this.sceneX + this.width * this.cellSize / 2, 14, ``, {
            fontSize: 64,
            color: '#000000',
            fontFamily: 'Kode Mono'
        }).setOrigin(0.5, 0);
        this.timeCounter = 10;
        this.scansCounter = 5;
        this.pointsCounter = 0;
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
        const mines = this.generateRandomMines(startIndex);

        mines.forEach(cell => {

            //  Update the 8 cells around this bomb cell
            const adjacent = this.getAdjacentCells(cell);

            adjacent.forEach(adjacentCell => {

                if (adjacentCell && !adjacentCell.bomb)
                {
                    adjacentCell.value++;
                }
            });
        });

        this.playing = true;
        this.populated = true;
        this.state = 1;

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

        if (cell && !cell.open && !cell.bomb)
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

    generateRandomMines (startIndex)
    {
        const mines = [];

        do {
            const location = Phaser.Math.Between(0, this.size - 1);

            const cell = this.getCell(location);

            if (!cell.bomb && cell.index !== startIndex)
            {
                cell.bomb = Phaser.Math.Between(1, 3);

                this.bombQty--;

                mines.push(cell);
            }

        } while (this.bombQty > 0);

        return mines;
    }

    generateThreeMines (startIndex)
    {
        const mines = [];

        let cell = this.getCellXY(3, 4);
        cell.bomb = 1;
        mines.push(cell);
        cell = this.getCellXY(5, 4);
        cell.bomb = 3;
        mines.push(cell);
        cell = this.getCellXY(7, 4);
        cell.bomb = 2;
        mines.push(cell);

        return mines;
    }    
}