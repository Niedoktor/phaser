import Phaser from 'phaser';

export class Mine
{
    constructor (scene, x = 0, y = 0, radius = 30, fragSize = 5, power = 1, expRadius = 50)
    {
        this.scene = scene;

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fragSize = fragSize;
        this.power = power;
        this.expRadius = expRadius;

        this.colGroup = this.scene.matter.world.nextGroup();

        this.mine = this.scene.add.circle(this.x, this.y, this.radius, 0x000000);
        this.scene.matter.add.gameObject(this.mine, {
            shape: {
                type: 'circle',
                radius: this.radius,
            },
            isStatic: true,
            collisionFilter: {
                group: this.colGroup,
                category: 0x0001,
                mask: 0xFFFFFFFF,
            },
        });
        this.mine.setOnCollide(() => {
            if(this.mine) this.blowUp();
        })

        this.label = this.scene.add.text(this.x, this.y, this.power, {
            fontSize: 48,
            color: '#ffffff',
            fontFamily: 'Kode Mono'
        }).setOrigin(0.5);
    }

    blowUp() {
        this.mine.destroy();
        this.label.destroy();

        this.mine = null;

        const layers = this.radius / this.fragSize;

        for(let j = 0; j < layers - 1; j++) {
            const radius = this.radius - this.fragSize * (j + 1);
            const layerSize = 2 * Math.PI * radius / this.fragSize;
            const angleStep = 360 / layerSize;

            for (let i = 0; i < layerSize; i++) {
                const rect = this.scene.add.rectangle(
                    this.x + Math.cos(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    this.y + Math.sin(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    this.fragSize,
                    this.fragSize,
                    0x000000
                );

                const forceMagnitude = Math.sqrt(this.expRadius) * 0.014;
                const v = new Phaser.Math.Vector2(rect.x - this.x, rect.y - this.y);
                v.normalize();

                this.scene.matter.add.gameObject(rect, {
                    shape: {
                        type: 'rectangle',
                        width: this.fragSize,
                        height: this.fragSize
                    },
                    frictionAir: 0.2,
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
                    mass: Phaser.Math.FloatBetween(1, 3),
                });

                rect.setRotation(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2));
                this.scene.tweens.add({
                    targets: rect,
                    alpha: 0,
                    duration: rect.body.mass * 500, // Longer duration for heavier objects
                    ease: 'Linear',
                    onComplete: () => { rect.destroy(); } // Optional: destroy after fade
                });
            }
        }
    }
}