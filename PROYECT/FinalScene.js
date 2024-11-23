class FinalScene extends Phaser.Scene {
    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    retryButton; // Botón de volver a jugar
    exitButton; // Botón de salida
    winnerPlayer = 0; // Guarda ell jugador ganador

    constructor(winnerPlayer) {
        super({ key: 'FinalScene' });
        this.winnerPlayer = winnerPlayer;
        
    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createRetryButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados

    // Crear el fondo de la escena
    _createBackground() {
        if (winnerPlayer == 1){
        this.loseBackground = this.add.image(0, 0, 'LoseBackground')
            
        } else {
            this.loseBackground = this.add.image(0, 0, 'LoseBackground')
        }
        this.setOrigin(0) // Establece el origen en la esquina superior izquierda
        .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Retry"
    _createRetryButton() {
        this.retryButton = this.add.image(640, 400, 'RetryButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startGame()); // Llamar a la función para iniciar el juego
    }

    // Función que inicia el juego
    _startGame() {
        this.scene.start('GameScene'); // Cambiar a la escena del juego
    }

    // Crear el botón de "Exit"
    _createExitButton() {
        this.exitButton = this.add.image(640, 500, 'MainMenuButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._exitGame()); // Llamar a la función para salir del juego
    }

    // Función que maneja la salida del juego
    _exitGame() {
        this.scene.start('MenuScene');
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        [this.retryButton, this.exitButton].forEach(button => {
            button.on('pointerover', () => this._onButtonHover(button)); // Aumentar el tamaño
            button.on('pointerout', () => this._onButtonOut(button)); // Volver al tamaño original
        });
    }

    // Animación de cuando el puntero pasa por encima de un botón
    _onButtonHover(button) {
        button.setScale(0.21); // Aumentar el tamaño del botón
    }

    // Animación de cuando el puntero sale de un botón
    _onButtonOut(button) {
        button.setScale(0.2); // Volver al tamaño original del botón
    }
}