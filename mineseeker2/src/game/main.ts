import { GeomExample } from './scenes/GeomExample';
import { Explosion } from './scenes/Explosion';
import { AUTO, Game, Types } from 'phaser';
import { MinePlugin } from './objects/Mine';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: false
        }
    },
    plugins: {
        global: [
            { key: 'MinePlugin', plugin: MinePlugin, start: true }
        ]
    },    
    scene: [
        Explosion
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
