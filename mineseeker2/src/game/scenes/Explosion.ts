import Phaser from 'phaser';
import { EventBus } from '../EventBus';
//import { Mine } from './objects/Mine';

export class Explosion extends Phaser.Scene {
    constructor() {
        super('Explosion');
    }

    preload() {
        // Load assets here
    }

    create() {
        this.matter.world.setBounds();

        //this.matter.add.mouseSpring();

        this.add.mine(this.scale.width / 2, this.scale.height / 2 - 100);
        this.add.mine(this.scale.width / 2, this.scale.height / 2 + 100);

        // const coreRadius = 10;
        // const mineLayers = 16;
        // const layerSize = 20;

        // const core = this.add.circle(minePosition.x, minePosition.y, coreRadius, 0x000000);

        // this.matter.add.gameObject(core, {
        //     shape: {
        //         type: 'circle',
        //         radius: coreRadius,
        //     },
        //     isStatic: true,
        // });

        // const createFrags = (count: number) =>{
        //     let radius = coreRadius;
        //     let angleStep = 360 / count;
        //     let fragSize = 2 * Math.PI * radius / count;

        //     for(let j = 0; j < mineLayers; j++) {
        //         for (let i = 0; i < count; i++) {
        //             const rect = this.add.rectangle(
        //                 minePosition.x + Math.cos(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
        //                 minePosition.y + Math.sin(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2)) * radius,
        //                 fragSize,
        //                 fragSize,
        //                 0x000000
        //             );
        //             this.matter.add.gameObject(rect, {
        //                 shape: {
        //                     type: 'rectangle',
        //                     width: fragSize,
        //                     height: fragSize
        //                 },
        //                 frictionAir: 0.2,
        //                 friction: 0.1,
        //                 mass: Phaser.Math.FloatBetween(1, 3)
        //             });
        //             rect.setRotation(Phaser.Math.DegToRad(i * angleStep + j * angleStep / 2));
        //         }
        //         radius += fragSize;
        //         count = 2 * Math.PI * radius / fragSize;
        //         angleStep = 360 / count;
        //     }
        // }

        // createFrags(layerSize);

        // this.input.on('pointerdown', (pointer: { x: number; y: number; }) => {
        //     this.children.each((obj: Phaser.GameObjects.GameObject) => {
        //         if (obj.body) {
        //             const matterObj = obj as Phaser.Physics.Matter.Image;
        //             const vector = new Phaser.Math.Vector2(matterObj.x - minePosition.x, matterObj.y - minePosition.y);
        //             const forceMagnitude = 0.002;

        //             const force = new Phaser.Math.Vector2(vector.x * forceMagnitude, vector.y * forceMagnitude);

        //             matterObj.applyForceFrom(minePosition, force);
        //         }
        //     });
        // });

        EventBus.emit('current-scene-ready', this);        
    }

    update() {
        // Update game logic each frame
    }
}