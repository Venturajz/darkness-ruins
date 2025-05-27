import Phaser from 'phaser';

class Fase3 extends Phaser.Scene {
  constructor() {
    super('Fase3');
  }

  preload() {
    this.load.image('lina', 'assets/lina.png');
    this.load.image('vilao1', 'assets/vilao1.png');
    this.load.image('mapa_floresta', 'assets/mapa_floresta.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.image(width / 2, height / 2, 'mapa_floresta').setDepth(-1).setDisplaySize(width, height);

    this.add.text(width / 2 - 60, 50, 'Fase 3', {
      fontSize: '20px',
      color: '#ffffff',
    });

    this.lina = this.physics.add.image(width / 2, height / 2 + 50, 'lina').setScale(0.13);

    this.ogros = [
      this.criarOgro(width / 2 - 150, height / 2 - 50),
      this.criarOgro(width / 2, height / 2 - 100),
      this.criarOgro(width / 2 + 150, height / 2 - 50),
    ];

    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      atacar: 'SPACE',
      avancar: 'ENTER',
    });
  }

  criarOgro(x, y) {
    const vilao = this.physics.add.image(x, y, 'vilao1').setScale(0.2);
    vilao.vida = 25;
    vilao.barraVida = this.add.graphics();
    return vilao;
  }

  update() {
    const speed = 2;
    const { cima, baixo, esquerda, direita, atacar, avancar } = this.teclas;

    if (cima.isDown) this.lina.y -= speed;
    if (baixo.isDown) this.lina.y += speed;
    if (esquerda.isDown) this.lina.x -= speed;
    if (direita.isDown) this.lina.x += speed;

    if (Phaser.Input.Keyboard.JustDown(atacar)) {
      this.ogros.forEach(vilao => {
        const distancia = Phaser.Math.Distance.BetweenPoints(this.lina, vilao);
        if (distancia < 80 && vilao.vida > 0) {
          vilao.vida -= 5;
          if (vilao.vida <= 0) {
            vilao.destroy();
            vilao.barraVida.clear();
          }
        }
      });
    }

    // Atualiza a barra de vida
    this.ogros.forEach(vilao => {
      if (vilao.active && vilao.barraVida) {
        const barraX = vilao.x - 30;
        const barraY = vilao.y - vilao.displayHeight / 2 - 10;
        const largura = 60;
        const altura = 8;
        const vida = Math.max(vilao.vida, 0);
        const proporcao = vida / 25;

        vilao.barraVida.clear();
        vilao.barraVida.fillStyle(0x000000);
        vilao.barraVida.fillRect(barraX, barraY, largura, altura);
        vilao.barraVida.fillStyle(0xff0000);
        vilao.barraVida.fillRect(barraX + 1, barraY + 1, (largura - 2) * proporcao, altura - 2);
        vilao.barraVida.setDepth(2);
      }
    });

    if (Phaser.Input.Keyboard.JustDown(avancar)) {
      this.scene.start('Fase4');
    }
  }
}

export default Fase3;
