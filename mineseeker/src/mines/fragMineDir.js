import Mine from '../mine.js';

export default class FragMineDir extends Mine {
    constructor (cell, x = 0, y = 0, fragSize = 5, size = 1)
    {
        x += (cell.size / 2);
        y += (cell.size / 2);

        super(cell, x, y, size, fragSize, 0.32);

        this.radius = cell.mineParams.radius;
        this.angle = cell.mineParams.angle;

        switch(this.angle) {
            case 0:
                this.forcePoint = { x: 0.5, y: 0.5 - this.radius * 0.005 };
                break;
            case 90:
                this.forcePoint = { x: 0.5 + this.radius * 0.005, y: 0.5 };
                break;
            case 180:
                this.forcePoint = { x: 0.5, y: 0.5 + this.radius * 0.005 };                
                break;
            case 270:
                this.forcePoint = { x: 0.5 - this.radius * 0.005, y: 0.5 };
                break;
        }

        this.init();
    }

    render()
    {
        const arc = this.scene.add.arc(this.x, this.y, this.radius, this.angle, this.angle + 180, false, 0x000000);
        const verts = arc.pathData.map((point, index) => {
            if(index % 2 === 0) {
                return point - (this.angle === 270 ? arc.width / 2 : 0);
            } else {
                return point - (this.angle === 0 ? arc.height / 2 : 0);
            }
        }).join(' ');        
        this.mine = this.scene.add.polygon(this.x, this.y, verts, 0x000000);
        const points = this.mine.geom.getPoints(20).map(point => ({ x: point.x + this.x, y: point.y + this.y }));
        this.scene.matter.add.gameObject(this.mine, {
            shape: {
                type: 'fromVerts',
                verts: points,
                flagInternal: true
            },
            isStatic: true,
            collisionFilter: {
                group: this.colGroup,
                category: 0x0001,
                mask: 0xFFFFFFFF,
            },
        });
        arc.destroy();
    }

    static setMineParams(cell) {
        cell.mineParams = {
            radius: cell.size * (0.1 + cell.mineSize * 0.1),
            angle: Phaser.Math.Between(0, 3) * 90
        }
    }

    static legend(cell, x, y, index){
        const w = cell.size / 2;
        const r = cell.size * (0.05 + cell.mineSize * 0.05);

        cell.mineLegend = cell.scene.add.arc(x, y, r, cell.mineParams.angle, cell.mineParams.angle + 180, false, 0x000000);
    }

    blowUp () {
        super.blowUp();
        
        this.mine.destroy();
        this.mine = null;
    }
}