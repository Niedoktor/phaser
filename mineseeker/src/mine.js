import Phaser from 'phaser';

export default class Mine
{
    constructor (cell, x = 0, y = 0, size = 1, fragSize = 5, forcePoint = { x: 0.5, y: 0.5 })
    {
        this.cell = cell;
        this.scene = cell.scene;

        this.x = x;
        this.y = y;
        this.fragSize = fragSize;
        this.size = size;
        this.forcePoint = forcePoint;
        this.colGroup = this.scene.matter.world.nextGroup(true);
    }

    createFrag (x, y) {
        const frag = this.scene.add.rectangle(
            x,
            y,
            this.fragSize,
            this.fragSize,
            Phaser.Display.Color.GetColor(Phaser.Math.Between(0, 0xFF), 0, 0),
        );

        frag.frag = true;

        const forceMagnitude = this.size * 0.16;
        const v = new Phaser.Math.Vector2(frag.x - this.x - this.cell.size * (this.forcePoint.x - this.mine.originX), frag.y - this.y - this.cell.size * (this.forcePoint.y - this.mine.originY));
        v.normalize();

        this.scene.matter.add.gameObject(frag, {
            shape: {
                type: 'rectangle',
                width: this.fragSize,
                height: this.fragSize
            },
            frictionAir: 0.045,
            //friction: 1,
            //frictionStatic: 1,
            force: {
                x: v.x * forceMagnitude,
                y: v.y * forceMagnitude
            },
            collisionFilter: {
                group: this.colGroup,
                category: 0x0001,
                mask: 0xFFFFFFFF,
            },                    
            mass: 2
        });

        frag.setRotation(v.angle());

        this.scene.tweens.add({
            targets: frag,
            alpha: 0,
            duration: frag.body.mass * 300, // Longer duration for heavier objects
            ease: 'Cubic.in',
            onComplete: () => {
                frag.destroy();
                const frags = this.scene.children.list.filter(gameObject => gameObject.frag).length;
                if(frags === 0) {
                    document.body.style.cursor = 'default';
                }
            } // Optional: destroy after fade
        });        

        return frag;
    }

    blowUp () {
        this.scene.cameras.main.shake(1500, this.size * 0.001, true);
        
        const layers = this.cell.size / this.fragSize;

        for(let j = 1; j < layers; j++) {
            const radius = this.fragSize * j - this.fragSize / 2;
            const layerSize = 2 * Math.PI * radius / this.fragSize;
            const angleStep = 360 / layerSize;
            const angleOffset = Phaser.Math.DegToRad(360 * Math.random());

            for (let i = 0; i < layerSize; i++) {
                const cX = Math.cos(Phaser.Math.DegToRad(i * angleStep + angleOffset)) * radius + this.cell.size * (this.forcePoint.x - this.mine.originX);
                const cY = Math.sin(Phaser.Math.DegToRad(i * angleStep + angleOffset)) * radius + this.cell.size * (this.forcePoint.y - this.mine.originY);

                if(this.mine.geom.contains(cX, cY)) {
                    const frag = this.createFrag(
                        this.x + cX,
                        this.y + cY
                    );
                }
            }
        }        

        setTimeout(() => {
            this.label.setText('X');
            this.label.setColor('#ff0000');
            this.label.setFontSize(this.size * 30);
            this.label.setAlpha(0);

            this.scene.tweens.add({
                targets: this.label,
                alpha: 1,
                duration: 500,
                ease: 'Linear'
            });            
        }, 1000);
    }
}