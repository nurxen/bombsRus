class SettingsScene extends Phaser.Scene {
    // Variables públicas
    settingsBackground; // Fondo de la escena de pérdida
    exitButton; // Botón de salida
    settingsText; // Texto del botón de salida
	username;

    constructor() {
        super({ key: 'SettingsScene' });
    }
	
	init(data) {
		        this.username = data.username;
		    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createSettingsText(); // Crear botón de salida
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados

    // Crear el fondo de la escena
    _createBackground() {
        this.settingsBackground = this.add.image(0, 0, 'SettingsBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Settings"
    _createExitButton() {
        this.exitButton = this.add.image(1125, 650, 'MainMenuButton')
            .setScale(0.15)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._menuScene()); // Llamar a la función para salir del juego
    }

    _createSettingsText() {
        // Primera columna: Controles
        this.controlsText = this.add.text(350, 390, '', {
            font: '26px Arial',
            fill: '#ffffff',
            align: 'left', // Alineado a la izquierda
            lineSpacing: 10
        }).setOrigin(0.5, 0.5);

        // Segunda columna: Créditos
        this.creditsText = this.add.text(900, 390, '', {
            font: '26px Arial',
            fill: '#ffffff',
            align: 'left', // Alineado a la izquierda
            lineSpacing: 10
        }).setOrigin(0.5, 0.5);
    }
    
    // Función que maneja la ajustes del juego
    _menuScene() {
        this.scene.start('MenuScene', {"username" : this.username}); // Cambiar a la escena del juego
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de ajustes
        this.exitButton.on('pointerover', () => this._onSettingsButtonHover());
        this.exitButton.on('pointerout', () => this._onSettingsButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onSettingsButtonHover() {
        this.exitButton.setScale(0.2); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onSettingsButtonOut() {
        this.exitButton.setScale(0.15); // Volver a la escala original
    }
}