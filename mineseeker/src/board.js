import Phaser from 'phaser';
import { Cell } from './cell';

export default class Board
{
    #timeCounter;
    #scansCounter;
    #pointsCounter;
    #minesCounter;
    #level;
    #scoreTarget;
    #cash;
    #reward;

    constructor (scene, sceneX, sceneY, cellSize, width, height, mines)
    {
        this.scene = scene;

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

        this.devices = [];
        this.devicesInPlay = [];

        this.mines = [];

        this.firstLevelScore = 50;
        this.firstLevelReward = 3;

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
        this.timeCounterDisplay.setText(`TIME ${this.#timeCounter}`);
    }
    get timeCounter(){
        return this.#timeCounter;
    }

    set scansCounter(val){
        this.#scansCounter = val;
        this.scansCounterDisplay.setText(`SCANS ${this.#scansCounter}`);
    }
    get scansCounter(){
        return this.#scansCounter;
    }

    set pointsCounter(val){
        this.#pointsCounter = val;
        this.pointsCounterDisplay.setText(`SCORE ${this.#pointsCounter}`);
    }
    get pointsCounter(){
        return this.#pointsCounter;
    }

    set minesCounter(val){
        this.#minesCounter = val;
        this.minesCounterDisplay.setText(`MINES ${this.#minesCounter}`);
    }
    get minesCounter(){
        return this.#minesCounter;
    }

    set level(val){
        this.#level = val;
        this.levelDisplay.setText(`LEVEL ${this.#level}`);
    }
    get level(){
        return this.#level;
    }

    set scoreTarget(val){
        this.#scoreTarget = val;
        this.scoreTargetDisplay.setText(`${this.#scoreTarget}`);
    }
    get scoreTarget(){
        return this.#scoreTarget;
    }

    set cash(val){
        this.#cash = val;
        this.cashDisplay.setText(`CASH ${this.#cash}$`);
    }
    get cash(){
        return this.#cash;
    }    

    set reward(val){
        this.#reward = val;
        this.rewardDisplay.setText(`REWARD ${this.#reward}$`);
    }
    get reward(){
        return this.#reward;
    }

    async newGame(){
        this.timeCounter = 99;
        this.scansCounter = 5;
        this.pointsCounter = 0;
        this.timeCounter = 99;
        this.scansCounter = 5;
        this.pointsCounter = 0;
        this.minesCounter = this.minesQty;
        this.level = 1;
        this.scoreTarget = this.firstLevelScore;
        this.cash = 0;
        this.reward = this.firstLevelReward;

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
        const fontSize = Math.floor(this.scene.scale.height * 0.04);
        const fontStyle = {
            fontSize: fontSize,
            color: '#000000',
            fontFamily: 'Doto',
            fontStyle: 'bold'
        }

        const w = this.sceneX * 0.95;
        const h = this.scene.scale.height * 0.98;
        const y = this.scene.scale.height * 0.01;
        const x = this.scene.scale.width * 7 / 8 - w / 2;
        
        const info = this.scene.add.container(x, y);

        info.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        info.add(this.levelDisplay = this.scene.add.text(w / 2, fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.text(w / 2, info.last.y + fontSize * 2, `Score to next level`, {
            fontSize: fontSize * 0.5,
            color: '#000000',
            fontFamily: 'Doto',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0));

        info.add(this.scoreTargetDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 0.6, ``, fontStyle).setOrigin(0.5, 0));
        
        info.add(this.rewardDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(this.pointsCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(this.minesCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));
        
        info.add(this.scansCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(this.cashDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.timeCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));
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
            const w = this.sceneW / (this.minesQty + 1);
            const x = this.sceneX + this.sceneW / 2 - ((this.minesQty - 1) / 2 - i) * w;
            const y = this.sceneY / 2;

            this.scene.add.rectangle(x, y, w, w, 0xdddddd).setStrokeStyle(2, 0x000000).setOrigin(0.5);
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
                        cell.mineClass = this.mines[0].class;
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