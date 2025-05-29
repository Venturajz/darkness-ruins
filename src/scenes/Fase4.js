import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  preload() {
    this.load.image('lina', '/assets/Personagens/lina.png');
    this.load.image('ghorn', '/assets/Personagens/ghorn.png');
    this.load.image('mapa_labirinto', '/assets/Mapas/mapa_labirinto.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Fundo do labirinto
    this.add.image(centerX, centerY, 'mapa_labirinto')
      .setDepth(-1)
      .setOrigin(0.5)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Título da fase
    this.add.text(centerX - 150, 50, 'Fase Final - Labirinto das Ruínas', {
      fontSize: '20px',
      color: '#ff6666',
    });

    // Lina com corpo físico e tamanho padronizado
    this.lina = this.physics.add.image(centerX, centerY + 100, 'lina').setScale(0.13);

    // Boss Ghorn com animação de brilho
    const boss = this.add.image(centerX, centerY, 'ghorn').setScale(0.23);
    this.tweens.add({
      targets: boss,
      alpha: { from: 0.6, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Texto explicativo
    this.add.text(centerX - 160, centerY + 200, 'Derrote Ghorn e salve a ilha!\nAperte ENTER para ver os créditos.', {
      fontSize: '16px',
      color: '#ffffff',
    });

    // Teclas
    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      avancar: 'ENTER',
    });
  }

  update() {
    const speed = 2;
    const { cima, baixo, esquerda, direita, avancar } = this.teclas;

    // Movimento da Lina
    if (cima.isDown) this.lina.y -= speed;
    if (baixo.isDown) this.lina.y += speed;
    if (esquerda.isDown) this.lina.x -= speed;
    if (direita.isDown) this.lina.x += speed;

    // Transição para créditos
    if (Phaser.Input.Keyboard.JustDown(avancar)) {
      this.scene.start('Creditos');
    }
  }
}

export default Fase4;
