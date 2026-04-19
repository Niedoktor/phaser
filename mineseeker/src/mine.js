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

        this.label = this.scene.add.text(this.x, this.y, this.power, {
            fontSize: 48,
            color: '#ffffff',
            fontFamily: 'Sixtyfour'
        }).setOrigin(0.5, 0.45);
    }

    blowUp () {
        this.mine.destroy();
        //this.label.destroy();

        this.mine = null;

        this.scene.cameras.main.shake(1500, this.power * 0.001, true);

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
                    Phaser.Display.Color.GetColor(Phaser.Math.Between(0, 0xFF), 0, 0)
                );

                const forceMagnitude = this.expRadius * 0.0012;
                const v = new Phaser.Math.Vector2(rect.x - this.x, rect.y - this.y);
                v.normalize();

                this.scene.matter.add.gameObject(rect, {
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

        setTimeout(() => {
            this.label.setText('X');
            this.label.setColor('#ff0000');
            this.label.setFontSize(this.power * 30);
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