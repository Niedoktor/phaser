import Phaser from 'phaser';
import Menu from './menu';
import Game from './game';

const config = {
    title: 'Mineseeker',
    type: Phaser.AUTO,
    width: 2560,
    height: 1440,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#ffffff',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: false,
            runner: {
               isFixed: true,
               fps: 60
            }
        }
    },
    scene: [
        Menu,
        Game
    ]
};

new Phaser.Game(config);
