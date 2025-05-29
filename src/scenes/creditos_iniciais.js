import Phaser from 'phaser';

class CreditosIniciais extends Phaser.Scene {
  constructor() {
    super('CreditosIniciais');
  }

  preload() {
    // Carrega a imagem da capa e o botão play
    this.load.image('capa', '/assets/capa_darkness.png');
    this.load.image('botao_play', '/assets/play1.png'); // Ajustado aqui
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Imagem da capa como fundo
    this.add.image(width / 2, height / 2, 'capa')
      .setDisplaySize(width, height)
      .setDepth(-1);

    // Botão "Jogar"
    const botao = this.add.image(width / 2, height / 2 + 100, 'botao_play')
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    // Ação ao clicar no botão
    botao.on('pointerdown', () => {
      this.scene.start('Fase1');
    });

    // Efeito hover
    botao.on('pointerover', () => {
      botao.setScale(0.55);
    });

    botao.on('pointerout', () => {
      botao.setScale(0.5);
    });
  }
}

export default CreditosIniciais;
