class FinalScene extends Phaser.Scene {
    loseBackground;
    retryButton;
    exitButton;
    gameScene = new GameScene();
    loser;
    playerOneWins = 0; // Contador de victorias para el jugador 1
    playerTwoWins = 0; // Contador de victorias para el jugador 2
	username;

    constructor() {
        super({ key: 'FinalScene' });
    }

    init(data) { 
        this.loser = data.loser; 
    }
        
    create(data) {
        
        // Recibes el parámetro loser desde GameScene
        this._createBackground(); // Crear fondo
        this._createRetryButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones

        // Actualizar los contadores de victorias
        this._updateVictoryCount();

        // Mostrar el ranking en pantalla
        this._showRankings();

        this.isGameOver = true; // Marcar que el juego ha terminado
    }

    _createBackground() {
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
        // Evitar bucles infinitos, solo lanzamos la escena si es necesario
            this.scene.start('GameScene', {"username" : this.username});
            this.scene.stop(); // Detenemos la escena actual para evitar el bucle infinito
    }

    _createExitButton() {
        this.exitButton = this.add.image(640, 610, 'MainMenuButton')
            .setScale(0.2)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._exitGame());
    }

    _exitGame() {
        this.scene.start('MenuScene', {"username" : this.username});
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

    _updateVictoryCount() {
        if (this.loser === 1) {
            // Jugador 2 gana
            this.playerTwoWins++;
        } else if (this.loser === 2) {
            // Jugador 1 gana
            this.playerOneWins++;
        }
    }

    _showRankings() {
        // Crear el texto del ranking
        const rankingText = `RANKING:\nCONEJO: ${this.playerOneWins} VICTORIAS\nOSO: ${this.playerTwoWins} VICTORIAS`;

        // Mostrar el ranking en pantalla
        this.rankingsText = this.add.text(
            this.sys.game.config.width / 2, 
            150, 
            rankingText, 
            { font: '32px Arial', fill: '#ffffff', align: 'center' }
        );
        this.rankingsText.setOrigin(0.5, 0);  // Centrar el texto
    }
}
