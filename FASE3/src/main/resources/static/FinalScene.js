class FinalScene extends Phaser.Scene {
    loseBackground; // Fondo de la escena de pérdida
    retryButton; // Botón de volver a jugar
    exitButton; // Botón de salida
    gameScene = new GameScene();
    loser; // Jugador perdedor
    winner; // Jugador ganador
    rankingsFile = '/api/rankings'; // Ruta de la API de rankings
	username;
	rankings;
	
    constructor() {
        super({ key: 'FinalScene' });
    }

	init(data) { 
				this.username = data.username;
				this.loser = data.loser; 
	}
		
    create(data) {
		
         // Recibes el parámetro loser desde GameScene
        //this.winner = data.winner;  // Recibes el parámetro winner desde GameScene
        this._createBackground(); // Crear fondo
        this._createRetryButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones

        // Actualizar el archivo de rankings
		this._updateRankings();
		
		
    }

    _createBackground() {
        // Cambiar el fondo dependiendo de quién haya perdido
        if (this.loser === 1) {
            this.loseBackground = this.add.image(0, 0, 'WinPlayerTwoBackground') // Gana el jugador 2
                .setOrigin(0)
                .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        } else if (this.loser === 2) {
            this.loseBackground = this.add.image(0, 0, 'WinPlayerOneBackground') // Gana el jugador 1
                .setOrigin(0)
                .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        } else if (this.loser === 3) {
            this.loseBackground = this.add.image(0, 0, 'DrawBackground') // Empate
                .setOrigin(0)
                .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        }
    }

    _createRetryButton() {
        this.retryButton = this.add.image(640, 460, 'RetryButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._startGame());
    }

    _startGame() {
        this.scene.start('GameScene');
    }

    _createExitButton() {
        this.exitButton = this.add.image(640, 610, 'MainMenuButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._exitGame());
    }

    _exitGame() {
        this.scene.start('MenuScene');
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
			
				
			console.log(this.username);
			
			$.ajax({
			    method: "POST",
			    url: "http://localhost:8080/api/rankings?usuario=" + encodeURIComponent(this.username),
			    headers: {
			        "Content-type": "application/json"
			    }
			});
			
			// Mostrar el ranking en el fondo
			this._showRankings();
        } catch (error) {
            console.error('Error updating rankings:', error);
        }
    }

	_showRankings() {
	    $.ajax({
	        method: "GET",
	        url: `http://localhost:8080/api/rankings?usuario=${encodeURIComponent(this.username)}`,
	        headers: {
	            "Content-type": "application/json"
	        }
	    }).done((data, textStatus, jqXHR) => {
	        console.log(data);  // Verificar los datos recibidos
	        this.rankings = data;  // Asignar los datos al objeto 'rankings'

	        console.log(this.rankings);  // Verificar los datos en 'rankings'
			
	        // Mostrar el ranking en pantalla
	        let rankingText = this.rankings;  // Asignamos los datos recibidos a la variable 'rankingText'
	        this.rankingsText = this.add.text(
	            this.sys.game.config.width / 2, 
	            150, 
	            rankingText, 
	            { font: '32px Arial', fill: '#ffffff', align: 'center' }
	        );
	        this.rankingsText.setOrigin(0.5, 0);  // Centrar el texto
	    }).fail((jqXHR, textStatus, errorThrown) => {
	        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);  // Manejar errores de la solicitud
	    });
	}

}
