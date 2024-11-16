class MenuScene extends Phaser.Scene {
    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startText; // Texto del botón de inicio
    exitButton; // Botón de salida
    exitText; // Texto del botón de salida

    constructor() {
        super({ key: 'MenuScene' });
    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createStartButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados
    
    // Crear el fondo de la escena
    _createBackground() {
        this.loseBackground = this.add.image(0, 0, 'LoseBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Start Game"
    _createStartButton() {
        this.startButton = this.add.image(640, 400, 'RetryButtonGrande')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startGame()); // Llamar a la función para iniciar el juego

        this.startText = this.add.text(640, 400, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que inicia el juego
    _startGame() {
        this.scene.start('GameScene'); // Cambiar a la escena del juego
    }

    // Crear el botón de "Exit"
    _createExitButton() {
        this.exitButton = this.add.image(640, 500, 'RetryButtonGrande')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._exitGame()); // Llamar a la función para salir del juego

        this.exitText = this.add.text(640, 500, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que maneja la salida del juego
    _exitGame() {
        console.log("Salir del juego"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        [this.startButton, this.exitButton].forEach(button => {
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
