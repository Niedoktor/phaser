import Phaser from 'phaser';

export class Mine extends Phaser.GameObjects.Container
{
    minePosition;
    coreRadius;
    mineLayers;
    firstlayerSize;
    group;

    constructor (scene, x = 0, y = 0, coreRadius = 10, mineLayers = 16, firstlayerSize = 20, children = [])
    {
        super(scene, x, y, children);

        this.minePosition = new Phaser.Math.Vector2(x, y);
        this.coreRadius = coreRadius;
        this.mineLayers = mineLayers;
        this.firstlayerSize = firstlayerSize;
        this.group = this.scene.add.group();

        const core = this.scene.add.circle(this.minePosition.x, this.minePosition.y, this.coreRadius, 0x000000);
        this.scene.matter.add.gameObject(core, {
            shape: {
                type: 'circle',
                radius: this.coreRadius,
            },
            isStatic: true,
        });
        this.group.add(core);

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
                    frictionAir: 0.2,
                    friction: 0.1,
                    mass: Phaser.Math.FloatBetween(1, 3)
                });
                rect.setRotation(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2));
                this.group.add(rect);
            }
            radius += fragSize;
            layerSize = 2 * Math.PI * radius / fragSize;
            angleStep = 360 / layerSize;
        }

        this.setInteractive(new Phaser.Geom.Circle(this.coreRadius, this.coreRadius, radius), Phaser.Geom.Circle.Contains);
        this.on("pointerdown", () => {
            this.blowUp();
        },
        this);
    }

    blowUp() {
        this.group.children.each((obj) => {
            if (obj.body) {
                const vector = new Phaser.Math.Vector2(obj.x - this.minePosition.x, obj.y - this.minePosition.y);
                const forceMagnitude = 0.002;

                const force = new Phaser.Math.Vector2(vector.x * forceMagnitude, vector.y * forceMagnitude);

                obj.applyForceFrom(this.minePosition, force);
            }
        });
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

    createMine (x, y)
    {
        return this.displayList.add(new Mine(this.scene, x, y));
    }
}