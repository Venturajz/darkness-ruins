import Phaser from 'phaser';

class Fase3 extends Phaser.Scene {
  constructor() {
    super('Fase3');
  }

  preload() {
    this.load.image('lina', '/assets/Personagens/lina.png');
    this.load.image('vilao1', '/assets/Personagens/vilao1.png');
    this.load.image('mapa_floresta', '/assets/Mapas/mapa_floresta.png');
    this.load.image('coracoes', '/assets/Personagens/hud_coracoes.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    this.add.image(width / 2, height / 2, 'mapa_floresta').setDepth(-2).setDisplaySize(width, height);
    this.add.text(width / 2, 30, 'Fase 3', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5).setDepth(2);

    this.lina = this.physics.add.image(width / 2, height / 2, 'lina').setScale(0.13);
    this.lina.setCollideWorldBounds(true);
    this.vida = 100;

    this.coracoes = [];
    const totalCoracoes = 5;
    for (let i = 0; i < totalCoracoes; i++) {
      const coracao = this.add.image(0.5 + i * 60, 0.5, 'coracoes').setScale(0.08).setScrollFactor(0).setDepth(2).setOrigin(0, 0);
      this.coracoes.push(coracao);
    }

    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      atacar: 'SPACE',
      avancar: 'ENTER',
    });

    this.ogros = [];
    this.spawnIndex = 0;
    this.spawnOffsets = [
      [200, -100], [-200, -100], [200, 100], [-200, 100],
      [150, -150], [-150, 150], [100, 150], [-100, -150],
      [180, -120], [-180, 120], [0, -180], [0, 180]
    ];

    this.spawnOgroWave(3); // Só uma vez com 3 ogros

    this.transicaoIniciada = false;
    this.barraLoading = this.add.graphics().setDepth(10).setVisible(false);
    this.telaPreta = this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setDepth(9).setVisible(false);
  }

  atualizarCoracoes() {
    const coracoesVisiveis = Math.ceil(this.vida / 20);
    this.coracoes.forEach((c, i) => {
      c.setVisible(i < coracoesVisiveis);
    });
  }

  spawnOgroWave(qtd) {
    const { width, height } = this.sys.game.canvas;

    for (let i = 0; i < qtd && this.spawnIndex < this.spawnOffsets.length; i++) {
      const [dx, dy] = this.spawnOffsets[this.spawnIndex];
      const ogro = this.physics.add.image(width / 2 + dx, height / 2 + dy, 'vilao1').setScale(0.21);
      ogro.vida = 50;
      ogro.setImmovable(true);
      ogro.barraVida = this.add.graphics();
      ogro.lastAttackTime = 0;

      this.ogros.push(ogro);
      this.spawnIndex++;

     this.physics.add.overlap(this.lina, ogro, () => {
      const distancia = Phaser.Math.Distance.Between(this.lina.x, this.lina.y, ogro.x, ogro.y);
      const now = this.time.now;

    if (distancia < 80 && now - ogro.lastAttackTime > 1000 && this.vida > 0) {
      this.vida -= 15;
      this.atualizarCoracoes();
      this.lina.setTint(0xff0000);
      this.time.delayedCall(200, () => this.lina.clearTint());
      ogro.lastAttackTime = now;

    if (this.vida <= 0) {
      this.scene.restart();
    }
  }
});

    }
  }

  iniciarTransicao() {
    this.transicaoIniciada = true;
    this.telaPreta.setVisible(true);
    this.barraLoading.setVisible(true);

    let progresso = 0;

    this.time.addEvent({
      delay: 20,
      repeat: 50,
      callback: () => {
        progresso += 2;
        this.barraLoading.clear();
        this.barraLoading.fillStyle(0xffffff, 1);
        this.barraLoading.fillRect(this.scale.width / 2 - 100, this.scale.height / 2, progresso * 2, 20);
        if (progresso >= 100) {
          this.scene.start('Fase4');
        }
      }
    });
  }

  update() {
    const speed = 2;
    const { cima, baixo, esquerda, direita, atacar, avancar } = this.teclas;

    if (cima.isDown) this.lina.y -= speed;
    if (baixo.isDown) this.lina.y += speed;
    if (esquerda.isDown) this.lina.x -= speed;
    if (direita.isDown) this.lina.x += speed;

    if (Phaser.Input.Keyboard.JustDown(atacar)) {
      this.lina.setScale(0.15).setAngle(-15);
      this.time.delayedCall(150, () => {
        this.lina.setScale(0.13).setAngle(0);
      });

      this.ogros.forEach(ogro => {
        const distancia = Phaser.Math.Distance.BetweenPoints(this.lina, ogro);
        if (distancia < 80 && ogro.vida > 0) {
          ogro.vida -= 5;
          if (ogro.vida <= 0) {
            ogro.destroy();
            ogro.barraVida.clear();
          }
        }
      });
    }

    this.ogros.forEach(ogro => {
      if (ogro.active) {
        this.physics.moveToObject(ogro, this.lina, 30);
        const barraX = ogro.x - 30;
        const barraY = ogro.y - ogro.displayHeight / 2 - 10;
        const largura = 60;
        const altura = 8;
        const vida = Math.max(ogro.vida, 0);
        const proporcao = vida / 50;

        ogro.barraVida.clear();
        ogro.barraVida.fillStyle(0x000000);
        ogro.barraVida.fillRect(barraX, barraY, largura, altura);
        ogro.barraVida.fillStyle(0xff0000);
        ogro.barraVida.fillRect(barraX + 1, barraY + 1, (largura - 2) * proporcao, altura - 2);
        ogro.barraVida.setDepth(2);
      }
    });

    if (Phaser.Input.Keyboard.JustDown(avancar)) {
      this.scene.start('Fase4');
    }

    if (!this.transicaoIniciada && this.ogros.length >= 3 && this.ogros.every(o => !o.active)) {
      this.iniciarTransicao();
    }
  }
}

export default Fase3;