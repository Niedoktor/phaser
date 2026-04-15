import Phaser from 'phaser';

export class Mine extends Phaser.GameObjects.Container
{
    constructor (scene, x = 0, y = 0, coreRadius = 10, mineLayers = 16, firstlayerSize = 20, children = [])
    {
        super(scene, x, y, children);

        this.minePosition = new Phaser.Math.Vector2(x, y);
        this.coreRadius = coreRadius;
        this.mineLayers = mineLayers;
        this.firstlayerSize = firstlayerSize;
        this.group = this.scene.add.group();

        //const collGroup = this.scene.matter.world.nextGroup();

        this.core = this.scene.add.circle(this.minePosition.x, this.minePosition.y, this.coreRadius, 0x000000);
        this.scene.matter.add.gameObject(this.core, {
            shape: {
                type: 'circle',
                radius: this.coreRadius,
            },
            isStatic: true,
        });//.setCollisionGroup(collGroup);
        this.group.add(this.core);

        let radius = this.coreRadius;
        let layerSize = this.firstlayerSize;
        let angleStep = 360 / layerSize;
        const fragSize = 2 * Math.PI * radius / layerSize;

        for(let j = 0; j < this.mineLayers; j++) {
            for (let i = 0; i < layerSize; i++) {
                const rect = this.scene.add.rectangle(
                    this.minePosition.x + Math.cos(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    this.minePosition.y + Math.sin(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
                    fragSize,
                    fragSize,
                    0x000000
                );
                this.scene.matter.add.gameObject(rect, {
                    shape: {
                        type: 'rectangle',
                        width: fragSize,
                        height: fragSize
                    },
                    frictionAir: 1,
                    friction: 1,
                    frictionStatic: 1,
                    mass: Phaser.Math.FloatBetween(1, 3),
                });//.setCollisionGroup(collGroup);
                rect.setRotation(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2));
                this.group.add(rect);
                rect.constraint = this.scene.matter.add.constraint(this.core, rect);
            }
            radius += fragSize;
            layerSize = 2 * Math.PI * radius / fragSize;
            angleStep = 360 / layerSize;
        }

        this.label = this.scene.add.text(this.minePosition.x, this.minePosition.y, '2', {
            fontSize: 48,
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        this.group.add(this.label);

        // this.scene.matter.add.gameObject(this.group, {
        //     shape: {
        //         type: 'circle',
        //         radius: this.coreRadius,
        //     },
        // }).setCollisionGroup(collGroup);

        this.setInteractive(new Phaser.Geom.Circle(this.coreRadius, this.coreRadius, radius), Phaser.Geom.Circle.Contains);
        this.on("pointerdown", () => {
            this.blowUp();
        },
        this);
    }

    blowUp() {
        this.group.children.each((obj) => {
            if (obj.body && !obj.isStatic()) {
                const vector = new Phaser.Math.Vector2(obj.x - this.minePosition.x, obj.y - this.minePosition.y);
                const forceMagnitude = 0.002;
                const force = new Phaser.Math.Vector2(vector.x * forceMagnitude, vector.y * forceMagnitude);

                this.scene.matter.world.removeConstraint(obj.constraint);
                obj.applyForceFrom(this.minePosition, force);
                this.scene.tweens.add({
                    targets: obj,
                    alpha: 0,
                    duration: obj.body.mass * 500, // Longer duration for heavier objects
                    ease: 'Linear',
                    onComplete: () => { obj.destroy(); } // Optional: destroy after fade
                });
            }
        });

        this.scene.tweens.add({
            targets: this.core,
            alpha: 0,
            duration: 200,
            ease: 'Linear',
            onComplete: () => { this.core.destroy(); }
        });        

        this.scene.tweens.add({
            targets: this.label,
            alpha: 0,
            duration: 200,
            ease: 'Linear',
            onComplete: () => { this.label.destroy(); }
        });

        setTimeout(() => {
            this.group.destroy();
            this.destroy();
        }, 2000);
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

    createMine (x, y, coreRadius = 10, mineLayers = 16, firstlayerSize = 20)
    {
        return this.displayList.add(new Mine(this.scene, x, y, coreRadius, mineLayers, firstlayerSize, []));
    }
}