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
		
		let cuddles = this.add.image(1216 + -(1.3*3) * 40, 70, "CuddlesIcon").setScale(0.8);
		let puffy = this.add.image(35 + (1.3*3) * 40, 70, "PuffyIcon").setScale(0.8);
		
		let finalText;
		let finalText2;
        // Cambiar el fondo dependiendo de quién haya perdido
        if (this.loser === 1) { // Gana el jugador 2
				finalText = matchData.username + " looses";
				finalText2 = matchData.otherUsername + " wins";
        } else if (this.loser === 2) { // Gana el jugador 1
			finalText = matchData.username + " wins";
			finalText2 = matchData.otherUsername + " looses";
        } else if (this.loser === 3) { // Empate
				finalText = "Draw";
        }
		
		// Agregar el texto del ranking encima del overlay
        this.text = this.add.text(35 + (1.3*3) * 40 + 20, 70, finalText, 
            this.sys.game.config.width / 2,
            220, // Posición Y con padding
            {
				fontFamily: 'Verdana, Geneva, sans-serif', // Fuente moderna
                fontSize: '30px', // Tamaño del texto más grande
                fontStyle: 'bold', // Negrita
                color: '#FFFFFF', // Texto blanco
                align: 'center' // Alineación
            }
        )
		
		// Agregar el texto del ranking encima del overlay
	    this.text = this.add.text(1216 + -(1.3*3) * 40 - 20, 70, finalText2, 
	        this.sys.game.config.width / 2,
	        220, // Posición Y con padding
	        {
				fontFamily: 'Verdana, Geneva, sans-serif', // Fuente moderna
	            fontSize: '30px', // Tamaño del texto más grande
	            fontStyle: 'bold', // Negrita
	            color: '#FFFFFF', // Texto blanco
	            align: 'center' // Alineación
	        }
	    )
    	}

    _createRetryButton() {
        this.retryButton = this.add.image(640, 460, 'RetryButton')
            .setScale(0.2)
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
            button.on('pointerover', () => this._onButtonHover(button));
            button.on('pointerout', () => this._onButtonOut(button));
        });
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
	            150, 
	            rankingText, 
	            { font: '32px Arial', fill: '#000000', align: 'center' }
	        );
	        this.rankingsText.setOrigin(0.5, 0);  // Centrar el texto
	    }).fail((jqXHR, textStatus, errorThrown) => {
	        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);  // Manejar errores de la solicitud
	    });
	}

}
