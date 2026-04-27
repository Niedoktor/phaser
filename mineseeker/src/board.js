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

        this.minesQty = mines;
        this.minesCounter = mines;

        this.playing = false;
        this.populated = false;

        this.scannerRange = 0;
        this.pointsModifier = [0, 0, 0];
        this.pointsMultiplier = [1, 1, 1];

        this.data = [];

        this.devices = [];
        this.devicesInPlay = [];

        this.mines = [];

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
        await this.loadMines();
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

        this.playDevice('scannerModifierRange');
        this.playDevice('scannerModifierPower');
        //this.playDevice('pointsModifierOnlySmall');
        //this.playDevice('pointsModifierOnlyMedium');
        //this.playDevice('pointsModifierOnlyBig');
        //this.playDevice('pointsMultiplierOnlySmall');
        //this.playDevice('pointsMultiplierOnlyMedium');
        //this.playDevice('pointsMultiplierOnlyBig');
        //this.playDevice('pointsModifierDiscSmall');
        //this.playDevice('pointsModifierDiscMedium');
        //this.playDevice('pointsModifierDiscBig');
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

    async loadMine(name) {
        this.mines.push({
            name: name,
            class: (await import(`./mines/${name}.js`)).default
        });
    }

    async loadDevices () {
        await this.loadDevice('scannerModifierRange');
        await this.loadDevice('scannerModifierPower');
        await this.loadDevice('pointsModifier');
        await this.loadDevice('pointsMultiplier');
        await this.loadDevice('pointsModifierOnlySmall');
        await this.loadDevice('pointsModifierOnlyMedium');
        await this.loadDevice('pointsModifierOnlyBig');
        await this.loadDevice('pointsMultiplierOnlySmall');
        await this.loadDevice('pointsMultiplierOnlyMedium');
        await this.loadDevice('pointsMultiplierOnlyBig');
        await this.loadDevice('pointsModifierDiscSmall');
        await this.loadDevice('pointsModifierDiscMedium');
        await this.loadDevice('pointsModifierDiscBig');
        await this.loadDevice('pointsMultiplierDiscSmall');
        await this.loadDevice('pointsMultiplierDiscMedium');
        await this.loadDevice('pointsMultiplierDiscBig');
    }

    async loadMines () {
        await this.loadMine('fragMine');
        await this.loadMine('fragMineDir');
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

    async generate (startIndex)
    {
        //const mines = this.generateThreeMines(startIndex);
        this.minedCells = this.generateRandomMines(startIndex);

        this.minedCells.sort((a, b) => { return b.mineSize - a.mineSize; });

        let i = 0;
        this.minedCells.forEach(cell => {
            const w = this.cellSize / 2;
            const x = this.sceneX + this.width * this.cellSize / 2 - this.minesQty * w / 2 + i * w + w / 2;
            const y = this.sceneY - w + 22;

            cell.mineClass.legend(cell, x, y, i++);

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
                        cell.mineClass = this.mines[1].class;
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