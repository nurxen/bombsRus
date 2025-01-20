class FinalOnlineScene extends Phaser.Scene {
    loseBackground; // Fondo de la escena de pérdida
    retryButton; // Botón de volver a jugar
    exitButton; // Botón de salida
    gameScene = new GameScene();
    loser; // Jugador perdedor
    winner; // Jugador ganador
    rankingsFile = '/api/rankings'; // Ruta de la API de rankings
	username;
	rankings;
	text;
	loserString;
	
    constructor() {
        super({ key: 'FinalOnlineScene' });
    }

	init(data) { 
		this.username = data.username;
		this.loser = data.loser; 
		//this.loserString = data.loserString;
	}
		
    create(data) {
		
        this._createBackground(); // Crear fondo
        this._createRetryButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones

        // Actualizar el archivo de rankings
		this._updateRankings();
    }

	_createBackground() {
	    this.loseBackground = this.add.image(0, 0, 'FinalBackground')
	        .setOrigin(0)
	        .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

	    // Ajustar posiciones para que queden paralelas
	    const screenWidth = this.sys.game.config.width;
	    const screenHeight = this.sys.game.config.height;
	    const firstThirdHeight = screenHeight / 12;

	    // Posiciones calculadas para las imágenes
	    let cuddlesX = screenWidth * 0.40; // Primer cuarto del ancho
	    let puffyX = screenWidth * 0.60;  // Tres cuartos del ancho
	    let textY = firstThirdHeight + 50; // Justo debajo de las imágenes
		
	    // Agregar imágenes
	    let puffy = this.add.image(cuddlesX, firstThirdHeight, "PuffyIcon").setScale(0.8);
	    let cuddles = this.add.image(puffyX, firstThirdHeight, "CuddlesIcon").setScale(0.8);

	    let finalText;
	    let finalText2;
		
		// Determinar el texto basado en el perdedor
		if (this.loser === 1) { // Pierde el jugador 1, gana el jugador 2
		    if (matchData.isPlayer1) { 
		        // Si el usuario es el jugador 1 (perdedor)
		        finalText = `${matchData.username} loses`;
		        finalText2 = `${matchData.otherUsername} wins`;
		    } else { 
		        // Si el usuario es el jugador 2 (ganador)
		        finalText = `${matchData.otherUsername} loses`;
		        finalText2 = `${matchData.username} wins`;
		    }
		} else if (this.loser === 2) { // Pierde el jugador 2, gana el jugador 1
		    if (matchData.isPlayer1) {
		        // Si el usuario es el jugador 1 (ganador)
		        finalText = `${matchData.username} wins`;
		        finalText2 = `${matchData.otherUsername} loses`;
		    } else { 
		        // Si el usuario es el jugador 2 (perdedor)
		        finalText = `${matchData.otherUsername} wins`;
		        finalText2 = `${matchData.username} loses`;
		    }
		} else if (this.loser === 3) { // Empate
		    finalText = "Draw";
		    finalText2 = "Draw";
		}

	    // Agregar textos debajo de cada imagen
	    this.add.text(cuddlesX, textY, finalText, {
	        fontFamily: 'Verdana, Geneva, sans-serif',
	        fontSize: '36px', // Tamaño de texto más grande
	        fontStyle: 'bold',
	        color: '#FFFFFF',
	        align: 'center'
	    }).setOrigin(0.5); // Centrar texto horizontalmente en la posición X

	    this.add.text(puffyX, textY, finalText2, {
	        fontFamily: 'Verdana, Geneva, sans-serif',
	        fontSize: '36px', // Tamaño de texto más grande
	        fontStyle: 'bold',
	        color: '#FFFFFF',
	        align: 'center'
	    }).setOrigin(0.5); // Centrar texto horizontalmente en la posición X
	}


    _createRetryButton() {
        this.retryButton = this.add.image(640, 460, 'RetryButton')
            .setScale(0.8)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._startGame());
    }

    _startGame() {
        this.scene.start('Connecting', {"username" : this.username});
    }

    _createExitButton() {
        this.exitButton = this.add.image(640, 610, 'MainMenuButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._exitGame());
    }

    _exitGame() {
        this.scene.start('MenuOnlineScene', {"username" : this.username});
    }

    _addButtonAnimations() {
        [this.retryButton, this.exitButton].forEach(button => {
            button.on('pointerover', () => this._onButtonHoverRetry(button));
            button.on('pointerout', () => this._onButtonOutRetry(button));
        });
		
		[this.exitButton].forEach(button => {
		    button.on('pointerover', () => this._onButtonHover(button));
		    button.on('pointerout', () => this._onButtonOut(button));
		});
    }

    _onButtonHoverRetry(button) {
        button.setScale(0.82);
    }

    _onButtonOutRetry(button) {
        button.setScale(0.8);
    }
	
	_onButtonHover(button) {
	    button.setScale(0.21);
	}

	_onButtonOut(button) {
	    button.setScale(0.2);
	}

    // Método que actualiza el archivo de rankings
    async _updateRankings() {
		
        try {
			$.ajax({
			    method: "POST",
			    url: "/api/rankings?usuario=" + encodeURIComponent(this.username),
			    headers: {
			        "Content-type": "application/json"
			    }
			});
			
			// Esperar un pequeño tiempo antes de hacer el GET
			        setTimeout(() => {
			            this._showRankings();
			        }, 150); // 500 ms de espera
        } catch (error) {
            console.error('Error updating rankings:', error);
        }
    }

	_showRankings() {
		
		this.add.text(this.sys.game.config.width / 2, 170, "Ranking", {
			        fontFamily: 'Verdana, Geneva, sans-serif',
			        fontSize: '36px', // Tamaño de texto más grande
			        fontStyle: 'bold',
			        color: '#FFFFFF',
			        align: 'center'
			    }).setOrigin(0.5); // Centrar texto horizontalmente en la posición X
				
	    $.ajax({
	        method: "GET",
	        url: `/api/rankings?usuario=${encodeURIComponent(this.username)}`,
	        headers: {
	            "Content-type": "application/json"
	        }
	    }).done((data, textStatus, jqXHR) => {
	        this.rankings = data;  // Asignar los datos al objeto 'rankings'
			
	        // Mostrar el ranking en pantalla
	        let rankingText = this.rankings;  // Asignamos los datos recibidos a la variable 'rankingText'
	        this.rankingsText = this.add.text(
	            this.sys.game.config.width / 2, 
	            190, 
	            rankingText, 
	            { font: '32px Verdana', color: '#FFFFFF', align: 'center' }
	        );
	        this.rankingsText.setOrigin(0.5, 0);  // Centrar el texto
	    }).fail((jqXHR, textStatus, errorThrown) => {
	        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);  // Manejar errores de la solicitud
	    });
	}

}
