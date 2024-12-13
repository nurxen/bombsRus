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

    create(data) {
		
        this.loser = data.loser;  // Recibes el parámetro loser desde GameScene
        this.winner = data.winner;  // Recibes el parámetro winner desde GameScene
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
		
		//this.username = localStorage.getItem('currentUser');
		this.username = 'aa';
		
        try {
			
			$.ajax({
				method: "POST",
				url: "http://127.0.0.1:8080/api/usuario",
				data: JSON.stringify(this.username),
				headers: 
				{
				 "Content-type":"application/json"
				}
			})
			
			$.ajax({
				method: "GET",
				url: "http://127.0.0.1:8080/api/usuario",
				headers: 
				{
					"Content-type":"application/json"
				}
			}).done((data, textStatus, jqXHR) => 
			    {
			       console.log(textStatus+" "+ jqXHR.status);
			       console.log(data);
			       console.log(jqXHR.statusCode())

			       // Borra los datos globales
			       this.rankings = data;

			 })

            // Actualizar las victorias de los jugadores
            if (this.winner === 1) {
                this.rankings.playerOneWins += 1;
            } else if (this.winner === 2) {
                this.rankings.playerTwoWins += 1;
            }

            // Mostrar el ranking en el fondo
            this._showRankings(this.rankings);
        } catch (error) {
            console.error('Error updating rankings:', error);
        }
    }

    _showRankings(rankings) {
        if (this.rankingsText) {
            this.rankingsText.destroy();
        }

        let rankingText = `Player 1 Wins: ${rankings}\nPlayer 2 Wins: ${rankings.playerTwoWins}`;
        this.rankingsText = this.add.text(
            this.sys.game.config.width / 2, 
            50, 
            rankingText, 
            { font: '32px Arial', fill: '#ffffff', align: 'center' }
        );
        this.rankingsText.setOrigin(0.5, 0);
    }
}
