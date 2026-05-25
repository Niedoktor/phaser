import Mine from '../mine.js';

export default class FragMine extends Mine {
    constructor (cell, x = 0, y = 0, fragSize = 5, size = 1)
    {
        x += (cell.size / 2);
        y += (cell.size / 2);

        super(cell, x, y, size, fragSize, size * 0.16, { x: 0.5, y: 0.5 });

        this.radius = cell.mineParams.radius * cell.size;

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

    static setMineParams(size) {
        return {
            radius: 0.1 + size * 0.1
        }
    }

    static isTheSameParams(params1, params2) {
        return params1.radius === params2.radius;
    }

    static legend(scene, parentSize, x, y, mineSize, mineParams){
        const r = parentSize * (0.05 + mineSize * 0.05);

        return scene.add.circle(x, y, r, 0x000000);
    }

    blowUp (completeCallback) {
        super.blowUp(completeCallback);
        
        this.mine.destroy();
        this.mine = null;
    }

    drawRange () {
        if(this.rangeArea) this.rangeArea.destroy();

        this.rangeArea = this.scene.add.circle(this.x, this.y, this.cell.size * this.size, 0xff0000, 0.2);
    }
}