import Phaser from 'phaser';

class Fase1 extends Phaser.Scene {
  constructor() {
    super('Fase1');
  }

  preload() {
    this.load.image('lina', '/assets/lina.png');
    this.load.image('npc_inicio', '/assets/npc_inicio.png');
    this.load.image('vilao1', '/assets/vilao1.png');
    this.load.image('mapa_vilarejo', '/assets/mapa_vilarejo.png');
    this.load.image('coracoes', '/assets/hud_coracoes.png'); // 1 coração por imagem
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Fundo e título
    this.add.image(width / 2, height / 2, 'mapa_vilarejo').setDepth(-2).setDisplaySize(width, height);
    this.add.text(width / 2, 30, 'Bem-vindo à Fase 1', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(2);

    // Lina
    this.lina = this.physics.add.image(width / 2, height / 2, 'lina').setScale(0.13);
    this.lina.setCollideWorldBounds(true);
    this.vida = 100; // Vida total

    // Corações HUD
    this.coracoes = [];
    const totalCoracoes = 5;
    for (let i = 0; i < totalCoracoes; i++) {
  const coracao = this.add.image(0.5 + i * 60, 0.5, 'coracoes') // espaçamento ampliado
        .setScale(0.08)       // menor
      .setScrollFactor(0)   // fixo na câmera
      .setDepth(2)
      .setOrigin(0, 0); 
      this.coracoes.push(coracao);
    }

    // Teclas
    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      atacar: 'SPACE',
      avancar: 'ENTER',
    });

    // Ogros
    this.ogros = [];
    this.spawnIndex = 0;
    this.spawnOffsets = [
      [200, -100], [-200, -100],
      [200, 100], [-200, 100],
      [150, -150], [-150, 150]
    ];

    this.spawnOgroWave(2);
    this.time.addEvent({ delay: 7000, callback: () => this.spawnOgroWave(2) });
    this.time.addEvent({ delay: 14000, callback: () => this.spawnOgroWave(2) });

    // NPC
    this.add.image(90, height - 180, 'npc_inicio').setScale(0.18).setDepth(1);
    this.add.text(160, height - 210,
      'Olá, Lina!\nUse W A S D para se mover.\nESPAÇO para atacar.\nENTER para avançar.',
      {
        fontSize: '16px',
        color: '#ffffff',
        wordWrap: { width: 350 },
      }
    ).setDepth(2);
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
      const ogro = this.physics.add.image(width / 2 + dx, height / 2 + dy, 'vilao1').setScale(0.11);
      ogro.vida = 25;
      ogro.setImmovable(true);
      ogro.barraVida = this.add.graphics();
      ogro.lastAttackTime = 0;

      this.ogros.push(ogro);
      this.spawnIndex++;

      this.physics.add.collider(this.lina, ogro, () => {
        const now = this.time.now;
        if (now - ogro.lastAttackTime > 1000 && this.vida > 0) {
          this.vida -= 5; // Ogro causa 5 de dano
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

  update() {
    const speed = 2;
    const { cima, baixo, esquerda, direita, atacar, avancar } = this.teclas;

    // Movimento
    if (cima.isDown) this.lina.y -= speed;
    if (baixo.isDown) this.lina.y += speed;
    if (esquerda.isDown) this.lina.x -= speed;
    if (direita.isDown) this.lina.x += speed;

    // Ataque
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

    // Atualização da barra de vida dos ogros
    this.ogros.forEach(ogro => {
      if (ogro.active) {
        this.physics.moveToObject(ogro, this.lina, 30);
        const barraX = ogro.x - 30;
        const barraY = ogro.y - ogro.displayHeight / 2 - 10;
        const largura = 60;
        const altura = 8;
        const vida = Math.max(ogro.vida, 0);
        const proporcao = vida / 25;

        ogro.barraVida.clear();
        ogro.barraVida.fillStyle(0x000000);
        ogro.barraVida.fillRect(barraX, barraY, largura, altura);
        ogro.barraVida.fillStyle(0xff0000);
        ogro.barraVida.fillRect(barraX + 1, barraY + 1, (largura - 2) * proporcao, altura - 2);
        ogro.barraVida.setDepth(2);
      }
    });

    if (Phaser.Input.Keyboard.JustDown(avancar)) {
      this.scene.start('Fase2');
    }
  }
}

export default Fase1;
