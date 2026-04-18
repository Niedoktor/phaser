import Phaser from 'phaser';

export class Mine extends Phaser.GameObjects.GameObject
{
    constructor (scene, x = 0, y = 0, radius = 30, layers = 16, firstlayerSize = 20, power = 1)
    {
        super(scene);

        this.group = this.scene.add.group();

        this.minePosition = new Phaser.Math.Vector2(x, y);
        this.radius = radius;
        this.layers = layers;
        this.firstlayerSize = firstlayerSize;
        this.power = power;

        this.mine = this.scene.add.circle(this.minePosition.x, this.minePosition.y, this.radius, 0x000000);
        this.scene.matter.add.gameObject(this.mine, {
            shape: {
                type: 'circle',
                radius: this.radius,
            },
            isStatic: true,
        });
        //this.group.add(this.mine);

        this.label = this.scene.add.text(this.minePosition.x, this.minePosition.y, this.power, {
            fontSize: 48,
            color: '#ffffff',
            fontFamily: 'Kode Mono'
        }).setOrigin(0.5);
        //this.group.add(this.label);
    }

    blowUp() {
        this.mine.destroy();

        const fragSize = this.radius / (this.layers + 1);
        const colGroup = this.scene.matter.world.nextGroup();

        for(let j = 0; j < this.layers; j++) {
            const radius = this.radius - fragSize * (j + 1);
            const layerSize = 2 * Math.PI * radius / fragSize;
            const angleStep = 360 / layerSize;

            for (let i = 0; i < layerSize; i++) {
                const rect = this.scene.add.rectangle(
                    Math.cos(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    Math.sin(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    fragSize,
                    fragSize,
                    0x000000
                );
                this.add(rect);

                const forceMagnitude = 0.002 * this.power;
                //const force = new Phaser.Math.Vector2(rect.x * forceMagnitude, rect.y * forceMagnitude);

                this.scene.matter.add.gameObject(rect, {
                    shape: {
                        type: 'rectangle',
                        width: fragSize,
                        height: fragSize
                    },
                    frictionAir: 0.2,
                    //friction: 1,
                    //frictionStatic: 1,
                    // force: {
                    //     x: rect.x * forceMagnitude,
                    //     y: rect.y * forceMagnitude
                    // },
                    collisionFilter: {
                        group: colGroup,
                        category: 0x0001,
                        mask: 0xFFFFFFFF,
                    },                    
                    mass: Phaser.Math.FloatBetween(1, 3),
                });

                rect.body.position.x += this.minePosition.x;
                rect.body.position.y += this.minePosition.y;
                rect.body.positionPrev.x = rect.body.position.x;
                rect.body.positionPrev.y = rect.body.position.y;

                rect.setRotation(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2));                
            }
        }

        // this.list.forEach((obj) => {
        //     if (obj.body && !obj.isStatic()) {
        //         const vector = new Phaser.Math.Vector2(obj.x, obj.y);
        //         const forceMagnitude = 0.002;
        //         const force = new Phaser.Math.Vector2(vector.x * forceMagnitude, vector.y * forceMagnitude);

        //         this.scene.matter.world.removeConstraint(obj.constraint);
        //         obj.applyForceFrom(Phaser.Math.Vector2.ZERO, force);
        //         this.scene.tweens.add({
        //             targets: obj,
        //             alpha: 0,
        //             duration: obj.body.mass * 500, // Longer duration for heavier objects
        //             ease: 'Linear',
        //             onComplete: () => { obj.destroy(); } // Optional: destroy after fade
        //         });
        //     }
        // });

        // this.scene.tweens.add({
        //     targets: this.core,
        //     alpha: 0,
        //     duration: 200,
        //     ease: 'Linear',
        //     onComplete: () => { this.core.destroy(); }
        // });        

        // this.scene.tweens.add({
        //     targets: this.label,
        //     alpha: 0,
        //     duration: 200,
        //     ease: 'Linear',
        //     onComplete: () => { this.label.destroy(); }
        // });

        // setTimeout(() => {
        //     this.destroy();
        // }, 2000);
    }

    // preUpdate (time: number, delta: number)
    // {
    // }
}

export class MinePlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager)
    {
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('mine', this.createMine);
    }

    createMine (x, y, radius = 10, layers = 16, firstlayerSize = 20, power = 1)
    {
        return this.displayList.add(new Mine(this.scene, x, y, radius, layers, firstlayerSize, power));
    }
}