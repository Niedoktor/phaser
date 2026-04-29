import Phaser from 'phaser';

export default class Mine
{
    constructor (cell, x = 0, y = 0, size = 1, fragSize = 5, forceMultipier, forcePoint = { x: 0.5, y: 0.5 })
    {
        this.cell = cell;
        this.scene = cell.scene;

        this.x = x;
        this.y = y;
        this.fragSize = fragSize;
        this.size = size;
        this.forcePoint = forcePoint;
        this.forceMultipier = forceMultipier;
        this.colGroup = this.scene.matter.world.nextGroup(true);
    }

    init()
    {
        this.render();
        this.forcePointContainer = this.scene.add.container(this.cell.sceneX + this.cell.size * this.forcePoint.x, this.cell.sceneY + this.cell.size * this.forcePoint.y);
        this.forcePointContainer.add(this.scene.add.circle(0, 0, 2, 0xff0000));
        for(let i = 1; i < this.size + 1; i++)
            this.forcePointContainer.add(this.scene.add.circle(0, 0, 8 * i, 0, 0).setStrokeStyle(4, 0xff0000));
        // this.label = this.scene.add.text(this.x, this.y, 'III', {
        //     fontSize: 48,
        //     color: '#ffffff',
        //     fontFamily: 'Sixtyfour'
        // }).setOrigin(0.5, 0.45);
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

        const forceMagnitude = this.size * this.forceMultipier;
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

        this.forcePointContainer.destroy();
        
        const layers = this.cell.size / this.fragSize;

        for(let j = 1; j < layers; j++) {
            const radius = this.fragSize * j - this.fragSize / 2;
            const layerSize = 2 * Math.PI * radius / this.fragSize;
            const angleStep = 360 / layerSize;
            const angleOffset = Phaser.Math.DegToRad(360 * Math.random());

            for (let i = 0; i < layerSize; i++) {
                const x = Math.cos(Phaser.Math.DegToRad(i * angleStep + angleOffset)) * radius + this.cell.size * this.forcePoint.x;
                const y = Math.sin(Phaser.Math.DegToRad(i * angleStep + angleOffset)) * radius + this.cell.size * this.forcePoint.y;
                const cX = x - (this.cell.size - this.mine.width) * this.mine.originX;
                const cY = y - (this.cell.size - this.mine.height) * this.mine.originY;

                if(this.mine.geom.contains(cX, cY)) {
                    const frag = this.createFrag(
                        this.x + x - this.cell.size * this.mine.originX,
                        this.y + y - this.cell.size * this.mine.originY,
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