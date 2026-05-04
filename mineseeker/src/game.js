import Phaser from 'phaser';
import Board from './board';
import InfoPanel from './infoPanel';

export default class Game extends Phaser.Scene
{   
    #level;
    #cash;

    constructor() {
        super('Game');
    }

    set level(val){
        this.#level = val;
        this.levelDisplay.setText(`Level ${this.#level}`);
    }
    get level(){
        return this.#level;
    }

    set cash(val){
        this.#cash = val;
        this.cashDisplay.setText(`Cash ${this.#cash}$`);
    }
    get cash(){
        return this.#cash;
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.matter.world.engine.timing.timeScale = 0.25;
        this.tweens.timeScale = 0.25;

        this.firstLevelScore = 50;
        this.firstLevelReward = 3;

        this.devices = [];
        this.mines = [];

        this.columnWidth = Math.floor(this.scale.width / 8);

        this.initGame();
    }

    async initGame() {
        const panelWidth = this.columnWidth * 2 * 0.95;
        const panelHeight = this.scale.height * 0.98;
        const panelX = this.scale.width - this.columnWidth - panelWidth / 2;
        const panelY = this.scale.height * 0.01;
        
        this.infoPanel = new InfoPanel(this, panelX, panelY, panelWidth, panelHeight);

        await this.loadDevices();
        await this.loadMines();
        await this.newGame();
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

    async newGame(){
        this.level = 1;
        this.cash = 0;

        this.devicesInPlay = [];

        // this.addDevice('scannerModifierRange');
        // this.addDevice('scannerModifierPower');

        this.initBoard();
    }

    addDevice(name) {
        const device = this.devices.find(device => device.name === name);
        if (device && this.devicesInPlay.length < 5) {
            const dev = new device.class(this, this.devicesInPlay.length);
            this.devicesInPlay.push(dev);
        }
    }

    initBoard() {
        const boardGridWidth = 10;
        const boardGridHeight = 10;
        const boardY = Math.floor(this.scale.height * 0.1);
        const cellSize = (this.scale.height - boardY - this.scale.height * 0.01) / boardGridHeight;
        const boardX = Math.floor((this.scale.width / 2) - (boardGridWidth * cellSize) / 2);

        this.board = new Board(this, boardX, boardY, cellSize, boardGridWidth, boardGridHeight, 12); 
    }

    preload() {
    }

    update() {
    }
}
