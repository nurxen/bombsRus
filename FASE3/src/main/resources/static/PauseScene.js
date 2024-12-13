class PauseScene extends Phaser.Scene {
	
	// Variables públicas
	    pauseBackground; // Fondo de la escena de pérdida
	    retryButton; // Botón de volver a jugar
	    exitButton; // Botón de salida
	    gameScene = new GameScene();
	    constructor() {
	        super({ key: 'PauseScene' });
	        
	    }

	    // Metodo que llamamos cuando creamos la escena
	    create(data) {
	        this.loser = data.loser;  // Recibes el parámetro loser desde GameScene
	        this._createBackground(); // Crear fondo
	        this._createExitButton(); // Crear botón de salida
	        this._addButtonAnimations(); // Agregar animaciones a los botones
	    }

	    // Métodos privados
			// Crear el fondo de la escena
		    _createBackground() {
		        // Verificar si la música ya está activa
		        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
		            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 3, loop: true });
		            this.backgroundMusic.play();
		        }

		        this.paseBackground = this.add.image(0, 0, 'PauseBackground')
		            .setOrigin(0) // Establece el origen en la esquina superior izquierda
		            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
		    }
			
			// Crear el botón de "Start Game"
			    _createExitButton() {
			        this.exitButton = this.add.image(1125, 650, 'ExitButton')
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
			        this.scene.resume('GameScene'); // Cambiar a la escena del juego
					this.scene.sleep('PauseScene'); // Cambiar a la escena del juego
			        //this.backgroundMusic.stop();
			    }

				// Agregar animaciones o efectos a los botones
				    _addButtonAnimations() {
				        // Agregar eventos para el botón de start
				        this.exitButton.on('pointerover', () => this._onExitButtonHover());
				        this.exitButton.on('pointerout', () => this._onExitButtonOut());
				    }

				    // Animación de cuando el puntero pasa por encima del botón "Start"
				    _onExitButtonHover() {
				        this.exitButton.setScale(1.05); // Cambiar a una escala mayor
				    }

				    // Animación de cuando el puntero sale del botón "Start"
				    _onExitButtonOut() {
				        this.exitButton.setScale(1.0); // Volver a la escala original
				    }
}