class PauseOnlineScene extends Phaser.Scene {
	
	// Variables públicas
	    pauseBackground; // Fondo de la escena de pérdida
	    retryButton; // Botón de volver a jugar
	    exitButton; // Botón de salida
		backButton;
	    gameScene = new GameScene();
		username;
		remotePlayerResumed = false;
		localPlayerResumed = false;
		
	    constructor() {
	        super({ key: 'PauseOnlineScene' });
	        
	    }
		
		init(data) {
			this.username = data.username;
		}

	    // Metodo que llamamos cuando creamos la escena
	    create(data) {
	        this.loser = data.loser;  // Recibes el parámetro loser desde GameScene
	        this._createBackground(); // Crear fondo
	        this._createExitButton(); // Crear botón de salida
			this._createBackButton();
	        this._addButtonAnimations(); // Agregar animaciones a los botones
			
			wsMessageCallbacks.push((msg) => this.processWSMessage(msg.data))
	    }
		
		update(){
			this._checkConexion();
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
			        this.exitButton = this.add.image(this.sys.game.config.width-65, 65, 'X')
			            .setScale(0.2)
			            .setOrigin(0.5, 0.5)
			            .setInteractive() // Hacer el botón interactivo
			            .on('pointerdown', () => this._resume()); // Llamar a la función para iniciar el juego

			        this.startText = this.add.text(640, 600, '', {
			            font: '32px Arial',
			            fill: '#fff'
			        }).setOrigin(0.5, 0.5);
			    }
				
				_resume(){
					this.localPlayerResumed = true;
					connection.send(JSON.stringify({isPauseInput: true, resume: true}));
					this._startGame();

				}	

			    // Función que inicia el juego
			    _startGame() {
					this.remotePlayerResumed = false;
					this.localPlayerResumed = false;
					this.scene.resume('OnlineGameScene', {"username" : this.username});
					this.scene.sleep('PauseOnlineScene', {"username" : this.username}); // Cambiar a la escena del juego
			        //this.backgroundMusic.stop();
			    }
				
				_createBackButton() {
				        this.backButton = this.add.image(640, 450, 'MainMenuButton')
				            .setScale(0.2)
				            .setOrigin(0.5, 0.5)
				            .setInteractive()
				            .on('pointerdown', () => this._back());
				    }

				    _back() {
						this.scene.stop('OnlineGameScene', {"username" : this.username});
						this.scene.start('MenuOnlineScene', {"username" : this.username});
						
						if(connection)
						        {
						            connection.onclose = null;
						            connection.close();
						            connection = null;
						        }
					}

				// Agregar animaciones o efectos a los botones
				    _addButtonAnimations() {
				        // Agregar eventos para el botón de start
				        this.exitButton.on('pointerover', () => this._onExitButtonHover(this.exitButton));
				        this.exitButton.on('pointerout', () => this._onExitButtonOut(this.exitButton));
						
						// Agregar eventos para el botón de start
						this.backButton.on('pointerover', () => this._onExitButtonHover(this.backButton));
						this.backButton.on('pointerout', () => this._onExitButtonOut(this.backButton));
				    }

				    // Animación de cuando el puntero pasa por encima del botón "Start"
				    _onExitButtonHover(button) {
				        button.setScale(0.22); // Cambiar a una escala mayor
				    }

				    // Animación de cuando el puntero sale del botón "Start"
				    _onExitButtonOut(button) {
				        button.setScale(0.2); // Volver a la escala original
				    }
					
					_checkConexion(){
						if(connection == null) {
							this.lostConnection();
						}
					}
					
					lostConnection()
					{
					    this.scene.launch("ConnectionLostScene", {"username" : this.username});
					    this.scene.stop("OnlineGameScene", {"username" : this.username});
					    this.scene.sleep("OnlinePauseScene", {"username" : this.username});
					}
					
					processWSMessage(msg)
					   {
					       msg = JSON.parse(msg);
					       
					       if(msg.fromPlayer && msg.isPauseInput && msg.resume)
					       {
					           console.log("mensaje recibido de volver a jugar")
					           this._startGame();
					       }
					   }
}