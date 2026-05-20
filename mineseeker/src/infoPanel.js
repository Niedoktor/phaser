import Phaser from 'phaser';
import Style from './styles';

export default class InfoPanel
{
    constructor (game, x, y, w, h)
    {
        this.game = game;
        this.scene = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.lineSpace = Math.floor(this.scene.scale.height * 0.04);
        
        this.info = this.scene.add.container(x, y);

        this.info.add(this.scene.add.rectangle(0, 0, w, h, 0xdddddd).setOrigin(0).setStrokeStyle(4, 0x000000));

        this.info.add(this.game.levelDisplay = this.scene.add.text(w / 2, this.lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        this.info.add(this.scene.add.text(w / 2, this.info.last.y + this.lineSpace * 2, `Score to next level`, Style.bla4).setOrigin(0.5, 0));

        this.info.add(this.game.scoreTargetDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace * 0.6, ``, Style.bla7).setOrigin(0.5, 0));
        
        this.info.add(this.game.rewardDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));

        this.info.add(this.scene.add.line(w / 2, this.info.last.y + this.lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        this.info.add(this.game.pointsCounterDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        this.info.add(this.scene.add.line(w / 2, this.info.last.y + this.lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        this.info.add(this.game.minesCounterDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace, ``, Style.bla7).setOrigin(0.5, 0));
        
        this.info.add(this.game.scansCounterDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));

        this.info.add(this.scene.add.line(w / 2, this.info.last.y + this.lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));

        this.info.add(this.game.cashDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace, ``, Style.bla7).setOrigin(0.5, 0));

        this.info.add(this.game.timeCounterDisplay = this.scene.add.text(w / 2, this.info.last.y + this.lineSpace * 2, ``, Style.bla7).setOrigin(0.5, 0));
        
        this.info.add(this.scene.add.line(w / 2, this.info.last.y + this.lineSpace * 2, 0, 0, w, 0, 0x000000).setOrigin(0.5));
    }

    minesInfo(){
        if(!this.game.minesInPlay) return;

        if(this.mines) this.mines.destroy();

        const w = this.w - this.lineSpace * 0.4;
        const h = this.h - this.info.last.y - this.lineSpace * 0.4;

        const sp = (w - this.lineSpace * 0.1) * 0.12;
        const c = Math.floor((w - this.lineSpace * 0.1) / sp);
        const s = sp - this.lineSpace * 0.1;

        this.info.add(this.mines = this.scene.add.container(this.lineSpace * 0.2, this.info.last.y + this.lineSpace * 0.2));

        this.mines.add(this.scene.add.rectangle(0, 0, w, h, 0xffffff).setOrigin(0).setStrokeStyle(4, 0x000000));
        
        this.game.minesInPlay.forEach((mine, i) => {
            const x = (i % c) * sp;
            const y = Math.floor(i / c) * sp;

            this.mines.add(this.scene.add.rectangle(this.lineSpace * 0.1 + x, this.lineSpace * 0.1 + y, s, s, 0xdddddd).setOrigin(0).setStrokeStyle(3, 0x000000)); 
            const legend = mine.class.legend(this.scene, s, this.lineSpace * 0.1 + x + s / 2, this.lineSpace * 0.1 + y + s / 2, mine.size);
            this.mines.add(legend);
        });
    }
}