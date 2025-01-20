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
		this._showRankings();
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
        this.exitButton = this.add.image(1125, 650, 'ExitButton')
            .setScale(0.23)
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
		
		_showRankings() {
		    $.ajax({
		        method: "GET",
		        url: `/api/rankings?usuario=${encodeURIComponent(this.username)}`,
		        headers: { "Content-type": "application/json" }
		    }).done((data) => {
		        // Crear un fondo translúcido detrás del texto
		        const overlay = this.add.graphics()
		            .fillStyle(0x000000, 0.7)
		            .fillRoundedRect(
		                this.sys.game.config.width / 2 - 300, // Posición X centrada (600px ancho / 2)
		                200, // Posición Y
		                600, // Ancho
		                300, // Alto
		                15 // Bordes redondeados
		            );

		        // Agregar el texto del ranking encima del overlay
		        const rankingsText = this.add.text(
		            this.sys.game.config.width / 2,
		            220, // Posición Y con padding
		            data, // Mostrar los datos recibidos directamente
		            {
		                fontFamily: 'Arial Rounded MT Bold, Comic Sans MS, sans-serif', // Fuentes redondeadas
		                fontSize: '36px', // Tamaño del texto más grande
		                fontStyle: 'bold', // Negrita adicional
		                color: '#ffffff', // Color blanco
		                align: 'center',
		                wordWrap: { width: 560 } // Ajustar ancho de envoltura
		            }
		        ).setOrigin(0.5, 0).setAlpha(0); // Centrar texto y empezar invisible

		        // Fade-in del fondo y texto
		        this.tweens.add({
		            targets: [overlay, rankingsText],
		            alpha: 1,
		            duration: 1000
		        });
		    }).fail((jqXHR, textStatus, errorThrown) => {
		        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
		    });
		}



    
    // Función que maneja la ajustes del juego
    _menuScene() {
        this.scene.start('MenuOnlineScene', {"username" : this.username}); // Cambiar a la escena del juego
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de ajustes
        this.exitButton.on('pointerover', () => this._onButtonHover());
        this.exitButton.on('pointerout', () => this._onButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onButtonHover() {
        this.exitButton.setScale(0.24); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onButtonOut() {
        this.exitButton.setScale(0.23); // Volver a la escala original
    }
}