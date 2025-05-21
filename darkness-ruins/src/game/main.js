import Phaser from 'phaser'
import GameScene from './scenes/GameScene.js'

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  parent: 'game-container',
  scene: [GameScene]
}

function preload() {
    this.load.image('lina', new URL('./assets/images/lina.png', import.meta.url).href)

}

function create() {
   const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    this.add.image(centerX, centerY, 'lina').setOrigin(0.5)


}

function update() {}

new Phaser.Game(config)

