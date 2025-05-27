import Phaser from 'phaser';

class Creditos extends Phaser.Scene {
  constructor() {
    super('Creditos');
  }

  preload() {
    this.load.image('creditos_final', 'assets/creditos_final.png');
  }

  create() {
    this.add.image(400, 300, 'creditos_final').setScale(0.8);

    const texto = this.add.text(400, 500, `Parabéns, herói(a)!\nVocê salvou a ilha da escuridão eterna!

Este jogo foi criado com coragem, café e criatividade por:

Eduarda Pereira de Moraes
Gabrielly Rossi Araujo
Johan Gabriel da Silva dos Santos
Jose Armando Ventura
Mariana Moreira Lima
Pietra Rolim Mendes`, {
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    // Faz os créditos subirem como no cinema
    this.tweens.add({
      targets: texto,
      y: -200,
      duration: 10000,
      ease: 'Linear'
    });
  }
}

export default Creditos;
