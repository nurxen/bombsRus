class MenuScene extends Phaser.Scene {
    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startText; // Texto del botón de inicio
    settingsButton; // Botón de salida
    settingsText; // Texto del botón de salida

    constructor() {
        super({ key: 'MenuScene' });
    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createStartButton(); // Crear botón de inicio
        this._createSettingsButton(); // Crear botón de ajustes
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados
    
    // Crear el fondo de la escena
    _createBackground() {
        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Start Game"
    _createStartButton() {
        this.startButton = this.add.image(440, 500, 'StartButton')
            .setScale(0.5)
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

    // Crear el botón de "Settings"
    _createSettingsButton() {
        this.settingsButton = this.add.image(740, 500, 'HelpButton')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._settingsScene()); // Llamar a la función para salir del juego

        this.settingsText = this.add.text(640, 500, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que maneja la ajustes del juego
    _settingsScene() {
        this.scene.start('SettingsScene'); // Cambiar a la escena del juego
        console.log("Ajustes"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de start
        this.startButton.on('pointerover', () => this._onStartButtonHover());
        this.startButton.on('pointerout', () => this._onStartButtonOut());

        // Agregar eventos para el botón de ajustes
        this.settingsButton.on('pointerover', () => this._onSettingsButtonHover());
        this.settingsButton.on('pointerout', () => this._onSettingsButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Start"
    _onStartButtonHover() {
        this.startButton.setScale(0.55); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Start"
    _onStartButtonOut() {
        this.startButton.setScale(0.5); // Volver a la escala original
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onSettingsButtonHover() {
        this.settingsButton.setScale(0.55); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onSettingsButtonOut() {
        this.settingsButton.setScale(0.5); // Volver a la escala original
    }
}