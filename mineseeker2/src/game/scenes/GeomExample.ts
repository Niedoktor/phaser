import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class GeomExample extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
    }

    create ()
    {
        const graphics = this.add.graphics({ fillStyle: { color: 0x0000ff }, lineStyle: { color: 0x0000aa } });

        const rectangles: Phaser.Geom.Rectangle[][] = [];

        const width = this.scale.width / 10;
        const height = this.scale.height / 10;

        for (let x = 0; x < 10; x++)
        {
            rectangles[x] = [];
            for (let y = 0; y < 10; y++)
            {
                rectangles[x][y] = new Phaser.Geom.Rectangle(x * width, y * height, width, height);
            }
        }

        this.input.on('pointerdown', (pointer: { x: number; y: number; }) =>
        {
            const x = Math.floor(pointer.x / width);
            const y = Math.floor(pointer.y / height);

            rectangles[x][y].setEmpty();

            redraw();
        });

        redraw();

        function redraw ()
        {
            graphics.clear();

            for (let x = 0; x < 10; x++)
            {
                for (let y = 0; y < 10; y++)
                {
                    graphics.fillRectShape(rectangles[x][y]);
                    graphics.strokeRectShape(rectangles[x][y]);
                }
            }
        }
        
        EventBus.emit('current-scene-ready', this);
    }
}
