class FinalOnlineScene extends Phaser.Scene {
    loseBackground; // Fondo de la escena de pérdida
    retryButton; // Botón de volver a jugar
    exitButton; // Botón de salida
    gameScene = new GameScene();
    loser;
	loserS;
    winner; // Jugador ganador
    rankingsFile = '/api/rankings'; // Ruta de la API de rankings
	username;
	  
	rankings;
	
    constructor() {
        super({ key: 'FinalOnlineScene' });
    }

	init(data) { 
				this.username = data.username;
				this.loser = data.loser; 
				this.loserS = data.loserS;
	}
		
    create(data) {
		
         // Recibes el parámetro loser desde GameScene
        //this.winner = data.winner;  // Recibes el parámetro winner desde GameScene
        this._createBackground(); // Crear fondo
        this._createRetryButton(); // Crear botón de inicio
        this._createExitButton(); // Crear botón de salida
		this._showWinner();
		//this._showLoserText();
        this._addButtonAnimations(); // Agregar animaciones a los botones
		

        // Actualizar el archivo de rankings
		//this._updateRankings();
    }

    _createBackground() {
		this.loseBackground = this.add.image(0, 0, 'DrawBackground') // Empate
		                .setOrigin(0)
		                .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
		/*
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
		*/
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
	
	_showWinner(){
		    // Crear el mensaje del perdedor
			const message = `El perdedor es: ${String(this.loserS).toUpperCase()}`; // Mensaje con el nombre del usuario en mayúsculas

		    // Crear el texto centrado en pantalla
		    this.usernameText = this.add.text(0, 0, message, {
		        fontFamily: 'Verdana, Geneva, sans-serif', // Fuente moderna
		        fontSize: '30px', // Tamaño del texto más grande
		        fontStyle: 'bold', // Negrita
		        color: '#FFFFFF', // Texto blanco
		        align: 'center' // Alineación
		    });

		    // Obtener el tamaño del texto
		    const textWidth = this.usernameText.width;
		    const textHeight = this.usernameText.height;

		    // Calcular las coordenadas para centrar el texto en la pantalla
		    const centerX = this.cameras.main.width / 2 - textWidth / 2;
		    const centerY = this.cameras.main.height / 2 - textHeight / 2;

		    // Ajustar la posición del texto
		    this.usernameText.setPosition(centerX, centerY);

		    // Crear un fondo redondeado detrás del texto
		    const background = this.add.graphics();
		    background
		        .fillStyle(0x000000, 0.5) // Fondo negro translúcido
		        .fillRoundedRect(centerX - 10, centerY - 10, textWidth + 20, textHeight + 20, 10); // Ajustar al tamaño del texto (+ márgenes)

		    // Asegurar que el texto esté por encima del fondo
		    this.usernameText.setDepth(1);
		}

		_showLoserText() {
		    const loserText = this.add.text(
		        this.sys.game.config.width / 2, // Centro de la pantalla (ancho)
		        this.sys.game.config.height / 2, // Centro de la pantalla (alto)
		        `Has perdido: ${this.loser}`, // Texto que muestra el perdedor
		        {
		            font: '40px Arial', // Configuración de fuente
		            fill: '#FF0000', // Color rojo para resaltar
		            align: 'center', // Alineación centrada
		        }
		    );

		    // Centrar el texto en pantalla
		    loserText.setOrigin(0.5, 0.5);
		}


	/*
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
	*/

}
