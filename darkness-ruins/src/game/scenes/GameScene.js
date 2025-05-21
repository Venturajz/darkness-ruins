import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.player=null 
    this.cursors=null
  }

  preload() {
    this.load.image('lina', new URL('../assets/images/lina.png', import.meta.url).href)
  }

  create() {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2
    this.player = this.add.image(centerX, centerY, 'lina')
    .setOrigin(0.5)
    .setScale(1)


    //captura as teclas WASD
   this.cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    right: Phaser.Input.Keyboard.KeyCodes.D
})

  }

  update() {
    console.log(' UPDATE rodando')

    const speed = 2

  if (this.cursors.left.isDown) {
    this.player.x -= speed
  }
  if (this.cursors.right.isDown) {
    this.player.x += speed
  }
  if (this.cursors.up.isDown) {
    this.player.y -= speed
  }
  if (this.cursors.down.isDown) {
    this.player.y += speed
  }
}
}
