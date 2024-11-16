class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Agregar la imagen de fondo y ajustarla al tamaño del canvas
        const loseBackgroung = this.add.image(0, 0, 'LoseBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas

        // Crear el botón de "Start Game"
        const startButton = this.add.image(640, 500, 'RetryButtonGrande')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => {
                // Cambiar a la escena del juego
                this.scene.start('GameScene');
            });

        const startText = this.add.text(640, 400, 'Start Game', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        // Crear el botón de "Exit"
        const exitButton = this.add.image(640, 500, 'pato')
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => {
                // Salir del juego (esto depende del entorno; no siempre funciona en navegadores)
                console.log("Salir del juego");
            });

        const exitText = this.add.text(640, 500, 'Exit', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        // Opcional: Animaciones o efectos al pasar el ratón sobre los botones
        [startButton, exitButton].forEach(button => {
            button.on('pointerover', () => button.setScale(0.21)); // Aumentar el tamaño
            button.on('pointerout', () => button.setScale(0.2)); // Volver al tamaño original
        });
    }
}
