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

        this.scannerRange = 0;

        this.data = [];

        this.devices = [];
        this.devicesInPlay = [];

        this.container = this.scene.add.container(this.sceneX, this.sceneY);

        // this.button;

        this.createCounters();
        this.initBoard();

        // this.button.setInteractive();

        // this.button.on('pointerdown', this.onButtonDown, this);
        // this.button.on('pointerup', this.onButtonUp, this);
    }

    async initBoard() {
        this.createCells();
        await this.loadDevices();
        await this.newGame();        
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

    async newGame(){
        this.timeCounter = 99;
        this.scansCounter = 5;
        this.pointsCounter = 0;

        this.playDevice('scanerRangeExpansion');
    }

    playDevice(name) {
        const device = this.devices.find(device => device.name === name);
        if (device && this.devicesInPlay.length < 5) {
            const dev = new device.class(this);
            this.devicesInPlay.push(dev);
            dev.play();
        }
    }

    async loadDevice(name) {
        this.devices.push({
            name: name,
            class: (await import(`./devices/${name}.js`)).default
        });
    }

    async loadDevices () {
        await this.loadDevice('scanerRangeExpansion');
    }

    createCounters (){
        this.timeCounterDisplay = this.scene.add.text(this.sceneX, 14, ``, {
            fontSize: 48,
            color: '#000000',
            fontFamily: 'Kode Mono'
        });
        this.scansCounterDisplay = this.scene.add.text(this.sceneX + this.width * this.cellSize, 14, ``, {
            fontSize: 48,
            color: '#000000',
            fontFamily: 'Kode Mono'
        }).setOrigin(1, 0);
        this.pointsCounterDisplay = this.scene.add.text(this.sceneX + this.width * this.cellSize / 2, 14, ``, {
            fontSize: 48,
            color: '#000000',
            fontFamily: 'Kode Mono'
        }).setOrigin(0.5, 0);
        this.timeCounter = 99;
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

    mineLegend (cell, index)
    {
        const w = this.cellSize / 2;
        const r = this.cellSize * (0.05 + cell.bomb * 0.05);
        const x = this.sceneX + this.width * this.cellSize / 2 - this.bombsCounter * w / 2 + index * w + w / 2;
        const y = this.sceneY - w + 22;

        cell.mineLegend = this.scene.add.circle(x, y, r, 0x000000);
   }

    async generate (startIndex)
    {
        //const mines = this.generateThreeMines(startIndex);
        const mines = this.generateRandomMines(startIndex);

        mines.sort((a, b) => { return b.bomb - a.bomb; });

        let i = 0;
        mines.forEach(cell => {
            this.mineLegend(cell, i++);

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

    generateRandomMines (startIndex, powerDistribution = [1.0 / 3, 1.0 / 3, 1.0 / 3])
    {
        const mines = [];
        powerDistribution = powerDistribution.map((val, index) => { return this.bombQty * val; });

        do {
            const location = Phaser.Math.Between(0, this.size - 1);
            const cell = this.getCell(location);

            if (!cell.bomb && cell.index !== startIndex)
            {
                do {
                    const p = Phaser.Math.Between(0, powerDistribution.length - 1);
                    if(powerDistribution[p] > 0) {
                        cell.bomb = p + 1;
                        powerDistribution[p]--;
                    }
                } while (!cell.bomb);

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