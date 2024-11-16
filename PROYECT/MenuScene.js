class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.bk=this.add.image(0,0, "bg");
        // Texto del título del menú
        const titleText = this.add.text(400, 150, 'Menú Principal', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Botón de "Iniciar Juego"
        const startButton = this.add.text(400, 300, 'Iniciar Juego', {
            fontSize: '24px',
            fill: '#0f0'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => { this.scene.start('GameScene'); });
    }
}
