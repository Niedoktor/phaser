import Phaser from 'phaser';
import Style from './styles';

export default class InfoPanel
{
    constructor (game, x, y, w, h)
    {
        this.game = game;
        this.scene = game;
        
        const lineSpace = Math.floor(this.scene.scale.height * 0.04);
        
        const info = this.scene.add.container(x, y);

        info.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        info.add(game.levelDisplay = this.scene.add.text(w / 2, lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        info.add(this.scene.add.text(w / 2, info.last.y + lineSpace * 2, `Score to next level`, Style.bla4).setOrigin(0.5, 0));

        info.add(game.scoreTargetDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace * 0.6, ``, Style.bla7).setOrigin(0.5, 0));
        
        info.add(game.rewardDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.pointsCounterDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.minesCounterDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace, ``, Style.bla7).setOrigin(0.5, 0));
        
        info.add(game.scansCounterDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));

        info.add(this.scene.add.line(w / 2, info.last.y + lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        info.add(game.cashDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        info.add(game.timeCounterDisplay = this.scene.add.text(w / 2, info.last.y + lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));
    }
}