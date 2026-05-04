import Phaser from 'phaser';

export default class InfoPanel
{
    constructor (game, x, y, w, h)
    {
        this.game = game;
        this.scene = game;
        
        const fontSize = Math.floor(this.scene.scale.height * 0.04);
        const fontStyle = {
            fontSize: fontSize,
            color: '#000000',
            fontFamily: 'Doto',
            fontStyle: 'bold'
        }
        
        const info = this.scene.add.container(x, y);

        info.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        info.add(game.levelDisplay = this.scene.add.text(w / 2, fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.text(w / 2, info.last.y + fontSize * 2, `Score to next level`, {
            fontSize: fontSize * 0.5,
            color: '#000000',
            fontFamily: 'Doto',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0));

        info.add(game.scoreTargetDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 0.6, ``, fontStyle).setOrigin(0.5, 0));
        
        info.add(game.rewardDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.pointsCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.minesCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));
        
        info.add(game.scansCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + fontSize * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.cashDisplay = this.scene.add.text(w / 2, info.last.y + fontSize, ``, fontStyle).setOrigin(0.5, 0));

        info.add(game.timeCounterDisplay = this.scene.add.text(w / 2, info.last.y + fontSize * 2, ``, fontStyle).setOrigin(0.5, 0));
    }
}