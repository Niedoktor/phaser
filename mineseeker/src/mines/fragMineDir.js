import Mine from '../mine.js';

export default class FragMineDir extends Mine {
    constructor (cell, x = 0, y = 0, fragSize = 5, size = 1)
    {
        x += (cell.size / 2);
        y += (cell.size / 2);

        super(cell, x, y, size, fragSize, { x: 0.5, y: 1 });

        this.radius = cell.size * (0.1 + cell.mineSize * 0.1);
        this.angle = Phaser.Math.Between(0, 3) * 90;

        // switch(this.angle) {
        //     case 0:
        //         this.x += (cell.size / 2);
        //         this.y += (cell.size / 2) - this.radius;
        //         break;
        //     case 90:
        //         this.x += (cell.size / 2) + this.radius;
        //         this.y += (cell.size / 2);
        //         break;
        //     case 180:
        //         this.x += (cell.size / 2);
        //         this.y += (cell.size / 2) + this.radius;
        //         break;
        //     case 270:
        //         this.x += (cell.size / 2) - this.radius;
        //         this.y += (cell.size / 2);
        //         break;
        // }

        //this.mine = this.scene.add.arc(this.x, this.y, this.radius, 180, 360, false, 0x000000);
        const arc = this.scene.add.arc(0, 0, this.radius, 180, 360, false, 0x000000);
        //const geom = new Phaser.Geom.Polygon(this.mine.pathData);
        const points = arc.pathData.map((point, index) => {
            if(index % 2 === 0) {
                return point + this.x;
            } else {
                return point + this.y;
            }
        }).join(' ');
        //const points = geom.getPoints(200).map(point => ({ x: point.x + this.x, y: point.y + this.y }));
        this.mine = this.scene.add.polygon(this.x, this.y, arc.pathData, 0x000000);
        this.mine.setOrigin(0.5, 1);
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

        // this.label = this.scene.add.text(this.x, this.y, this.size, {
        //     fontSize: 48,
        //     color: '#ffffff',
        //     fontFamily: 'Sixtyfour'
        // }).setOrigin(0.5, 0.45);
    }

    static legend(cell, x, y, index){
        const w = cell.size / 2;
        const r = cell.size * (0.05 + cell.mineSize * 0.05);

        cell.mineLegend = cell.scene.add.circle(x, y, r, 0x000000);
    }

    blowUp () {
        super.blowUp();
        
        this.mine.destroy();
        this.mine = null;
    }
}