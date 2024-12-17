class MenuScene extends Phaser.Scene {
    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startText; // Texto del botón de inicio
    settingsButton; // Botón de salida
    settingsText; // Texto del botón de salida
	usernameText;
	username;

    constructor() {
        super({ key: 'MenuScene' });
    }

    // Metodo que llamamos cuando creamos la escena
    create() {
        this._createBackground(); // Crear fondo
        this._createStartButton(); // Crear botón de inicio
        this._createSettingsButton(); // Crear botón de ajustes
        this._createOptionsButton(); // Crear botón de opciones
		this._createBackButton(); // Crear botón de volver atrás
		this._createUsernameText(); // Crear botón de volver atrás
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados
	init(data) {
		        this.username = data.username;
		    }
    
    // Crear el fondo de la escena
    _createBackground() {
        // Verificar si la música ya está activa
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 3, loop: true });
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
        this.scene.start('GameScene', {"username" : this.username}); // Cambiar a la escena del juego
		//this.backgroundMusic.stop();        
    }
	
	// Crear el botón de "Back"
		    _createBackButton() {
		        this.BackButton = this.add.image(1175, 725, 'MainMenuButton')
		            .setScale(0.13)
		            .setOrigin(0.5, 0.5)
		            .setInteractive() // Hacer el botón interactivo
		            .on('pointerdown', () => this._back()); // Llamar a la función para iniciar el juego

		        this.backText = this.add.text(640, 600, '', {
		            font: '32px Arial',
		            fill: '#fff'
		        }).setOrigin(0.5, 0.5);
		    }

		    // Función que te devuelve al menu de registro
		    _back() {
		        this.scene.start('RegisterScene', {"username" : this.username}); // Cambiar a la escena de registro
		        //this.backgroundMusic.stop();
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
        this.scene.start('SettingsScene', {"username" : this.username}); // Cambiar a la escena del juego
        console.log("Ajustes"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
        
    }
	
	// Crear y mostrar el texto del username en la esquina superior izquierda
		_createUsernameText() {
		    // Crear el texto del username primero, para obtener sus dimensiones
		    this.usernameText = this.add.text(30, 30, `👤 INVITADO`, {
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
        this.scene.start('OptionsScene', {"username" : this.username}); // Cambiar a la escena del juego
        console.log("Opciones"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
    }
	
	

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de start
        this.startButton.on('pointerover', () => this._onButtonHover(this.startButton));
        this.startButton.on('pointerout', () => this._onButtonOut(this.startButton));

        // Agregar eventos para el botón de ajustes
        this.settingsButton.on('pointerover', () => this._onButtonHover(this.settingsButton));
        this.settingsButton.on('pointerout', () => this._onButtonOut(this.settingsButton));

        // Agregar eventos para el botón de ajustes
        this.optionsButton.on('pointerover', () => this._onButtonHover(this.optionsButton));
        this.optionsButton.on('pointerout', () => this._onButtonOut(this.optionsButton));
		
		this.BackButton.on('pointerover', () => this._onButtonHoverBack(this.BackButton));
		this.BackButton.on('pointerout', () => this._onButtonOutBack(this.BackButton));
    }

    // Animación de cuando el puntero pasa por encima del botón "Start"
    _onButtonHover(button) {
        button.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Start"
    _onButtonOut(button) {
        button.setScale(1.0); // Volver a la escala original
    }
	
	// Animación de cuando el puntero pasa por encima del botón "Start"
	_onButtonHoverBack(button) {
	    button.setScale(0.14); // Cambiar a una escala mayor
	}

	// Animación de cuando el puntero sale del botón "Start"
	_onButtonOutBack(button) {
	    button.setScale(0.13); // Volver a la escala original
	}
}