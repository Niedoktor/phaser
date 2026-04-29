import Mine from '../mine.js';

export default class FragMine extends Mine {
    constructor (cell, x = 0, y = 0, fragSize = 5, size = 1)
    {
        x += (cell.size / 2);
        y += (cell.size / 2);

        super(cell, x, y, size, fragSize, size * 0.16, { x: 0.5, y: 0.5 });

        this.radius = cell.mineParams.radius;

        this.init();
    }

    render()
    {
        const circle = this.scene.add.circle(this.x, this.y, this.radius, 0x000000);
        const verts = circle.pathData.join(' ');
        this.mine = this.scene.add.polygon(this.x, this.y, verts, 0x000000);
        const points = this.mine.geom.getPoints(20);
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
        circle.destroy();
    }

    static setMineParams(cell) {
        cell.mineParams = {
            radius: cell.size * (0.1 + cell.mineSize * 0.1)
        }
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