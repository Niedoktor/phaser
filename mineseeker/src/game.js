import Phaser from 'phaser';
import Board from './board';
import InfoPanel from './infoPanel';
import ShopForm from './shopForm';
import PropertyArray from './propertyArray';
import { importDevice, importBooster, importMine } from './modules';
import property from './property';

export default class Game extends Phaser.Scene
{   
    constructor() {
        super('Game');
    }

    create(data) {
        this.input.mouse.disableContextMenu();
        this.matter.world.engine.timing.timeScale = 0.25;
        this.tweens.timeScale = 0.25;

        this.firstLevelScore = 10;
        this.firstLevelReward = 3;

        this.devices = [];
        this.mines = [];
        this.boosters = [];

        this.columnWidth = Math.floor(this.scale.width / 8);

        this.shopDevicesCount = 2;

        this.initGame();
    }

    async initGame() {
        const panelWidth = this.columnWidth * 2 * 0.95;
        const panelHeight = this.scale.height * 0.98;
        const panelX = this.scale.width - this.columnWidth - panelWidth / 2;
        const panelY = this.scale.height * 0.01;
        
        this.infoPanel = InfoPanel.create(this, panelX, panelY, panelWidth, panelHeight);

        await this.loadDevices();
        await this.loadMines();
        await this.loadBoosters();

        property(this, 'level', 'game.level', (val) => {
            this.infoPanel.levelDisplay.setText(this.infoPanel.levelDisplay.textTemplate.replace('{val}', val));
        });
        property(this, 'cash', 'game.cash', (val) => {
            this.infoPanel.cashDisplay.setText(this.infoPanel.cashDisplay.textTemplate.replace('{val}', val));
        });

        if(this.level !== undefined) {
            await this.continueGame();
        }else{
            await this.newGame();
        }

        //this.openShop();
    }

    openShop() {
        this.shop = new ShopForm(this, this.scale.width / 4, this.scale.height / 8);                
    }

    async loadDevice(name) {
        this.devices.push({
            name: name,
            class: (await importDevice(name))
        });
    }

    async loadMine(name) {
        this.mines.push({
            name: name,
            class: (await importMine(name))
        });
    }

    async loadBooster(name) {
        this.boosters.push({
            name: name,
            class: (await importBooster(name))
        });
    }

    async loadBoosters() {
        await this.loadBooster('deviceBooster');
        await this.loadBooster('mineBooster');
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

    async newGame (){
        localStorage.clear();

        this.level = 1;
        this.cash = 0;

        this.devicesInPlay = new PropertyArray('game.devicesInPlay', true);

        this.addDevice('ScannerModifierRange');
        // this.addDevice('scannerModifierPower');

        this.initStartingMines(12);
        this.initBoard(12);
    }

    async continueGame (){
        this.devicesInPlay = new PropertyArray('game.devicesInPlay');
        this.renderDevicesInPlay();

        this.minesInPlay = new PropertyArray('game.minesInPlay');
        this.infoPanel.minesInfo();
        
        this.initBoard(0);
    }

    initStartingMines (mineCount) {
        this.minesInPlay = this.generateEvenMines(mineCount);
        this.infoPanel.minesInfo();
    }

    generateEvenMines (mineCount){
        const mines = new PropertyArray('game.minesInPlay', true);
        const sizeDistribution = [];

        this.mines.forEach(mine => {
            sizeDistribution.push([mineCount / 3 / this.mines.length, mineCount / 3 / this.mines.length, mineCount / 3 / this.mines.length]);
        });

        while(mines.length < mineCount){
            const s = Phaser.Math.Between(0, 2);
            const m = Phaser.Math.Between(0, this.mines.length - 1);
            if(sizeDistribution[m][s] >= 1) {
                mines.push({ class: this.mines[m].class, size: s + 1, classIndex: m });
                sizeDistribution[m][s]--;
            }
        }
        mines.sort((a, b) => { return a.classIndex + b.size * 10 - b.classIndex - a.size * 10; });
        mines.save();

        return mines;
    }

    addDevice(name) {
        const device = this.devices.find(device => device.class.name === name);
        if (device && this.devicesInPlay.length < 5) {
            this.devicesInPlay.push({ class: device.class });
            this.renderDevicesInPlay();
        }
    }

    addMine(mine) {
        this.minesInPlay.push(mine);
        this.infoPanel.minesInfo();
    }

    renderDevicesInPlay() {
        const w = this.columnWidth * 2 * 0.95;
        const h = this.scale.height * 0.85 / 5;
        const x = this.columnWidth - w / 2;
        const space = this.scale.height * 0.012;

        if(this.devicesContainer){
            this.devicesContainer.destroy();
            this.devicesContainer = null;
        }

        this.devicesContainer = this.add.container(x, space);

        this.devicesInPlay.forEach((device, index) => {
            device.inst = new device.class(this, 0, index * (h + space), w, h);
            const deviceContainer = device.inst.render();
            this.devicesContainer.add(deviceContainer);
        });
    }

    initBoard(mines) {
        const boardGridWidth = 10;
        const boardGridHeight = 10;
        const boardY = Math.floor(this.scale.height * 0.1);
        const cellSize = (this.scale.height - boardY - this.scale.height * 0.01) / boardGridHeight;
        const boardX = Math.floor((this.scale.width / 2) - (boardGridWidth * cellSize) / 2);

        this.board = new Board(this, boardX, boardY, cellSize, boardGridWidth, boardGridHeight, mines); 
    }

    preload() {
    }

    update() {
    }
}
