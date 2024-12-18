class ChatScene extends Phaser.Scene {
   	username;
	mainBackground;
    constructor() {
        super({ key: 'ChatScene' });
    }

	init(data) {
	        this.username = data.username;
	    }
		
    // Metodo que llamamos cuando creamos la escena
    create() {
		this._createBackground(); // Crear fondo
		this._createStartButton();
    }
	
	// Crear el fondo de la escena
	_createBackground() {
	    // Verificar si la música ya está activa
		this.mainBackground = this.add.image(0, 0, 'MainMenuBackground')
		            .setOrigin(0) // Establece el origen en la esquina superior izquierda
		            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
		}
		
		// Crear el botón de "Start Game"
		    _createStartButton() {
		        this.startButton = this.add.image(640, 560, 'Colider64')
		            .setScale(1.5)
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
				this.scene.start('MenuOnlineScene', { "username": this.username });
				//this.backgroundMusic.stop();        
		    }
}