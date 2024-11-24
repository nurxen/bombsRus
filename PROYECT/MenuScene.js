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
        this._createOptionsButton(); // Crear botón de opciones
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados
    
    // Crear el fondo de la escena
    _createBackground() {
        // Verificar si la música ya está activa
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 5, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }


    // Crear el botón de "Start Game"
    _createStartButton() {
        this.startButton = this.add.image(640, 600, 'StartButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startGame()); // Llamar a la función para iniciar el juego

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que inicia el juego
    _startGame() {
        this.scene.start('GameScene'); // Cambiar a la escena del juego
        this.backgroundMusic.stop();
    }

    // Crear el botón de "Settings"
    _createSettingsButton() {
        this.settingsButton = this.add.image(240, 500, 'HelpButton')
            .setScale(1.0)
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

    // Crear el botón de "Settings"
    _createOptionsButton() {
        this.optionsButton = this.add.image(1040, 500, 'OptionsButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._optionsScene()); // Llamar a la función para salir del juego

        this.settingsText = this.add.text(640, 500, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }
    
    // Función que maneja la ajustes del juego
    _optionsScene() {
        this.scene.start('OptionsScene'); // Cambiar a la escena del juego
        console.log("Opciones"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de start
        this.startButton.on('pointerover', () => this._onStartButtonHover());
        this.startButton.on('pointerout', () => this._onStartButtonOut());

        // Agregar eventos para el botón de ajustes
        this.settingsButton.on('pointerover', () => this._onSettingsButtonHover());
        this.settingsButton.on('pointerout', () => this._onSettingsButtonOut());

        // Agregar eventos para el botón de ajustes
        this.optionsButton.on('pointerover', () => this._onOptionsButtonHover());
        this.optionsButton.on('pointerout', () => this._onOptionsButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Start"
    _onStartButtonHover() {
        this.startButton.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Start"
    _onStartButtonOut() {
        this.startButton.setScale(1.0); // Volver a la escala original
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onSettingsButtonHover() {
        this.settingsButton.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onSettingsButtonOut() {
        this.settingsButton.setScale(1.0); // Volver a la escala original
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onOptionsButtonHover() {
        this.optionsButton.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onOptionsButtonOut() {
        this.optionsButton.setScale(1.0); // Volver a la escala original
    }
}