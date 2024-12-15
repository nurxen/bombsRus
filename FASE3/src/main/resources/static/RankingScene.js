class RankingScene extends Phaser.Scene {
    // Variables públicas
    settingsBackground; // Fondo de la escena de pérdida
    exitButton; // Botón de salida
    settingsText; // Texto del botón de salida
	username;
	usernameText;

    constructor() {
        super({ key: 'RankingScene' });
    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createExitButton(); // Crear botón de salida
		this._createUsernameText(); 
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

	init(data) { 
					this.username = data.username;
				}
    // Métodos privados

    // Crear el fondo de la escena
    _createBackground() {
        this.settingsBackground = this.add.image(0, 0, 'RankingBackground')
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
	
	// Crear y mostrar el texto del username en la esquina superior izquierda
		_createUsernameText() {
		    // Crear el texto del username primero, para obtener sus dimensiones
		    this.usernameText = this.add.text(30, 30, `👤 ${this.username.toUpperCase()}`, {
		        fontFamily: 'Verdana, Geneva, sans-serif', // Fuente moderna
		        fontSize: '26px', // Tamaño del texto
		        fontStyle: 'bold', // Negrita
		        color: '#FFFFFF', // Texto blanco
		        align: 'center' // Alineación
		    }); // Esquina superior izquierda

		    // Obtener el tamaño del texto
		    const textWidth = this.usernameText.width;
		    const textHeight = this.usernameText.height;

		    // Crear un fondo redondeado detrás del texto usando gráficos
		    const background = this.add.graphics();
		    background
		        .fillStyle(0x000000, 0.5) // Fondo negro translúcido
		        .fillRoundedRect(20, 20, textWidth + 20, textHeight + 20, 10); // Ajustar al tamaño del texto (+ márgenes)

		    // Asegurar que el texto esté por encima del fondo
		    this.usernameText.setDepth(1);
		}
    
    // Función que maneja la ajustes del juego
    _menuScene() {
        this.scene.start('MenuOnlineScene'); // Cambiar a la escena del juego
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de ajustes
        this.exitButton.on('pointerover', () => this._onButtonHover());
        this.exitButton.on('pointerout', () => this._onButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onButtonHover() {
        this.exitButton.setScale(0.2); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onButtonOut() {
        this.exitButton.setScale(0.15); // Volver a la escala original
    }
}