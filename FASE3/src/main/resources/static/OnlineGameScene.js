// noinspection SpellCheckingInspection
class OnlineGameScene extends Phaser.Scene {
	// Variables públicas
	playersInput = {
		wasdKeys: 0,
		arrowKeys: 0,
		bombKey1: 0,
		bombKey2: 0,
	};
	ground;
	player1; // Instancia del jugador 1
	player2; // Instancia del jugador 2
	bombas;
	position = new Phaser.Math.Vector2(64, 70); // Posición inicial del jugador 1
	position2 = new Phaser.Math.Vector2(1300, 1000); // Posición inicial del jugador 2
	player1Lifes = []; // Array de vidas del jugador 1
	player2Lifes = []; // Array de vidas del jugador 2

	// Variables privadas
	_bk; // Fondo de la escena
	_presentAnimation; // Sprite para la animación de los regalos
	_frames; // Frames de la animación
	_pauseButton = null; // El botón de pausa
	_pauseText = null;   // El texto que indica el estado de pausa
	puffy;
	cuddle;
	username;
	text;
	
	// Online
	localUser;
	outerUser;

	constructor() {
		super({ key: 'OnlineGameScene' });
	}

	init(data) {
		this.username = data.username;
	}

	// Preload: Cargar todos los recursos
	preload() {
		console.log("Loading OnlineGameScene...");
		this._loadAssets();
	}

	create() {

		//this.pauseKeyIsPressed = false;
		//this.remotePausePanel = this.add.image(0, 0, "remotePause").setOrigin(0, 0).setVisible(false);

		wsMessageCallbacks.push((msg) => this.processWSMessage(msg.data));
		connection.onclose = (msg) => this.closeWS(msg);

		this._setupInputs(); // Configurar las teclas de entrada
		this._createBackground(); // Crear fondo
		this._createLifes(); // Crear fondo
		this._initPlayers(); // Inicializar jugadores
		this._setupBombas(); // Configurar las bombas
		this._setupGround(); // Crear el escenario
		this._createPresentExplosionAnimation(); // Crear la animación del regalo
		this._createConejoAnimation(); // Crear la animación del regalo
		this._createOsoAnimation(); // Crear la animación del regalo
		this._createPresentAnimationSprite(); // Crear el sprite para la animación
		this._setupCollisions(); // Configurar colisiones
		this._createPauseButton(); // Crear botón de salida
		this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.1, loop: true });
		this.backgroundMusic.play();
	}

	// Update: Actualizar cada cuadro
	update(time, delta) {
		this._processInput(); // Procesar entradas de los jugadores
		this.player1.update(time, delta); // Actualizar al jugador 1
		this.player2.update(time, delta); // Actualizar al jugador 2
		this._checkGameOver(); // Verificar si el juego ha terminado
	}

	// ===========================
	// Métodos Públicos
	// ===========================

	// Obtiene el jugador perdedor
	getLoser() {

    }
	
	/*getLoserString() {

        // Verificar si el jugador 1 ha perdido
        if (this.player1.isLoser() && this.player2.isLoser()) {
            return 3; // Devuelve 3 si hay empate
        } else if (this.player2.isLoser()) {
            return this.player2.getUsername(); // Devuelve 2 si el jugador 2 ha perdido
        } else if (this.player1.isLoser()) {
            return this.player1.getUsername();
        }

    }*/
    
    // Metodo para comprobar la colisión con los jugadores después de la animación
    checkCollisionWithPlayers(explosionImage) {
        // Verificar si el regalo ha colisionado con los jugadores
        if (this.physics.overlap(explosionImage, this.player1.gameObject)) {
            this._playerHit(this.player1); // El jugador 1 ha sido golpeado
        }
        
        if (this.physics.overlap(explosionImage, this.player2.gameObject)) {
            this._playerHit(this.player2); // El jugador 2 ha sido golpeado
        }
    }

	}
	
	getLoserString() {
		empate = "Empate";
		// Verificar si el jugador 1 ha perdido
		if (this.player1.isLoser() && this.player2.isLoser()) {
			return empate; // Devuelve 3 si hay empate
		} else if (this.player2.isLoser()) {
			return player2.getUsername(); // Devuelve 2 si el jugador 2 ha perdido
		} else if (this.player1.isLoser()) {
			return player1.getUsername();
		}

	}

	// Metodo para comprobar la colisión con los jugadores después de la animación
	checkCollisionWithPlayers(explosionImage) {
		// Verificar si el regalo ha colisionado con los jugadores
		if (this.physics.overlap(explosionImage, this.player1.gameObject)) {
			this._playerHit(this.player1); // El jugador 1 ha sido golpeado
		}

		if (this.physics.overlap(explosionImage, this.player2.gameObject)) {
			this._playerHit(this.player2); // El jugador 2 ha sido golpeado
		}
	}

	// ===========================
	// Métodos Privados
	// ===========================

	// Cargar los recursos necesarios
	_loadAssets() {
		this.load.spritesheet("regaloSprite", "./assets/ASSTES/spritesheet.png", {
			frameWidth: 192,
			frameHeight: 192,
		});

		this.load.spritesheet("conejoSprite", "./assets/ASSTES/walkConejo.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("conejoSpriteFrente", "./assets/ASSTES/walkConejoFrente.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("conejoSpriteAtras", "./assets/ASSTES/walkConejoAtras.png", {
			frameWidth: 64,
			frameHeight: 64,
		});
		this.load.spritesheet("osoSpriteAtras", "./assets/ASSTES/walkOsoAtras.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("osoSpriteDelante", "./assets/ASSTES/walkOsoDelante.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("osoSpriteDerecha", "./assets/ASSTES/walkOsoDerecha.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("conejo", "./assets/ASSTES/idleConejo.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("oso", "./assets/ASSTES/idleOso.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

	}

	// Configurar las entradas del teclado
	_setupInputs() {
		this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
		this.playersInput.bombKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		//this.playerInput.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	}

	// Crear el fondo
	_createBackground() {
		this._bk = this.add
			.image(0, 0, "GameBackground")
			.setOrigin(0)
			.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
	}

	// Crear las vidas de los jugadores
	_createLifes() {
		// Vidas del jugador 1
		for (let i = 0; i < 3; i += 1.25) {
			const life = this.add.image(35 + i * 40, 30, "Life").setScale(0.8);
			this.player1Lifes.push(life);

			if (i < 4) {
				this.puffy = this.add.image(35 + (1.3 * 3) * 40, 30, "PuffyIcon").setScale(0.8);
			}
        }
		
		let finalText = matchData.username;
		// Agregar el texto del ranking encima del overlay
        this.text = this.add.text(35 + (1.3*3) * 40 + 40, 30, finalText, 
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



		// Vidas del jugador 2
		for (let i = 0; i < 3; i += 1.25) {
			const life = this.add.image(1216 - i * 40, 730, "Life").setScale(0.8);
			this.player2Lifes.push(life);

			if (i < 4) {
				this.cuddles = this.add.image(1216 + -(1.3 * 3) * 40, 730, "CuddlesIcon").setScale(0.8);
			}
        }
		
		let finalText2 = matchData.otherUsername;
		// Agregar el texto del ranking encima del overlay
        this.text = this.add.text(1216 + -(1.3*3) * 40 - 100, 730, finalText2, 
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
    
    // Inicializar los jugadores
    _initPlayers() {
        this.player1 = new Player(this, 1, this.position, 1);
        this.player2 = new Player(this, 2, this.position2, -1);
		
		this.localPlayer = matchData.isPlayer1 ? this.player1 : this.player2;
		this.remotePlayer = !matchData.isPlayer1 ? this.player1 : this.player2;

		console.log(this.player1); // Añadir para depurar
		console.log(this.player2); // Añadir para depurar
	}

	// Configurar las bombas
	_setupBombas() {
		this.bombas = this.physics.add.group({
			classType: Bomba,
			runChildUpdate: true,
			allowGravity: false,
		});
	}

	// Crear el escenario
	_setupGround() {

		this.ground = this.physics.add.staticGroup();

		// Lista de decoraciones
		const decorations = [
			"LegoDecoration",
			"BallDecoration",
			"CarDecoration",
			"CubeDecoration",
			"Towerdecoration",
			"PinkDuckDecoration",
			"YellowDuckDecoration"
		];

		this.ground = this.physics.add.staticGroup();

		// Añadir decoraciones y bordes
		this._addDecorations(decorations);
		this._addBorders();
	}

	_addDecorations(decorations) {
		// Función para elegir un asset aleatorio
		const getRandomDecoration = () => decorations[Math.floor(Math.random() * decorations.length)];

		// FILA 1
		this.ground.create(226, 244, getRandomDecoration());
		this.ground.create(418, 244, getRandomDecoration());
		this.ground.create(866, 244, getRandomDecoration());
		this.ground.create(1056, 244, getRandomDecoration());

		// FILA 2
		this.ground.create(226, 522, getRandomDecoration());
		this.ground.create(418, 522, getRandomDecoration());
		this.ground.create(866, 522, getRandomDecoration());
		this.ground.create(1056, 522, getRandomDecoration());

		// COLUMNA CENTRAL
		this.ground.create(609, 174, getRandomDecoration());
		this.ground.create(675, 174, getRandomDecoration());
		this.ground.create(609, 382, getRandomDecoration());
		this.ground.create(675, 382, getRandomDecoration());
		this.ground.create(609, 592, getRandomDecoration());
		this.ground.create(675, 592, getRandomDecoration());
	}

	_addBorders() {

		// Borde izquierdo
		for (let i = 70; i <= 700; i += 70) {
			this.ground.create(32, i, "Colider64");
			this.ground.create(1248, i, "Colider64");
		}
		// Borde superior e inferior
		for (let i = 70; i <= 1190; i += 70) {
			this.ground.create(i, 34, "Colider64");
			this.ground.create(i, 732, "Colider64");
		}
	}

	// Configurar las colisiones
	_setupCollisions() {
		// Añadir colisiones entre la bomba y el "ground"
		this.physics.add.collider(this.bombas, this.ground, (bomba, ground) => {
			bomba._onCollision();
		});
		this.physics.add.collider(this.player1.body, this.ground);
		this.physics.add.collider(this.player2.body, this.ground);
		this.physics.add.collider(this.bombas, this.ground);
		this.physics.add.overlap(this.regalo, this.player1.gameObject, () => this._playerHit(this.player1), null, this);
		this.physics.add.overlap(this.regalo, this.player2.gameObject, () => this._playerHit(this.player2), null, this);
	}

	// Crear la animación de explosión del regalo
	_createPresentExplosionAnimation() {

		// Crear el sprite del regalo y configurarlo fuera de la pantalla inicialmente
		this.regalo = this.physics.add.sprite(-100, -100, "regaloColiderPresentExplosion").setScale(1);

		this._frames = []; // Aseguramos que _frames esté vacío antes de llenarlo
		for (let i = 1; i <= 26; i++) {
			this._frames.push({ key: "PresentExplosion" + i });
		}

		this.anims.create({
			key: "regaloSprite_anim",
			frames: this.anims.generateFrameNumbers("regaloSprite", { start: 0, end: 25 }),
			frameRate: 30,
			repeat: 0 // No se repite
		})

	}
	_createConejoAnimation() {
		this.anims.create({
			key: "conejo_anim_derecha",
			frames: this.anims.generateFrameNumbers("conejoSprite", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});
		this.anims.create({
			key: "conejo_anim_frente",
			frames: this.anims.generateFrameNumbers("conejoSpriteFrente", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});

		this.anims.create({
			key: "conejo_anim_atras",
			frames: this.anims.generateFrameNumbers("conejoSpriteAtras", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});

		this.anims.create({
			key: "conejo_idle",
			frames: this.anims.generateFrameNumbers("conejo", { start: 0, end: 0 }), // Ajusta los frames según tu spritesheet
			frameRate: 8, // Velocidad de animación
			repeat: -1,   // Repetir indefinidamente
		});

	}

	_createOsoAnimation() {
		this.anims.create({
			key: "oso_anim_derecha",
			frames: this.anims.generateFrameNumbers("osoSpriteDerecha", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});
		this.anims.create({
			key: "oso_anim_frente",
			frames: this.anims.generateFrameNumbers("osoSpriteDelante", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});

		this.anims.create({
			key: "oso_anim_atras",
			frames: this.anims.generateFrameNumbers("osoSpriteAtras", { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1, // Asegúrate de usar -1 si deseas que la animación se repita indefinidamente
		});

		this.anims.create({
			key: "oso_idle",
			frames: this.anims.generateFrameNumbers("oso", { start: 0, end: 0 }), // Ajusta los frames según tu spritesheet
			frameRate: 8, // Velocidad de animación
			repeat: -1,   // Repetir indefinidamente
		});


	}


	// Crear el sprite de la animación
	_createPresentAnimationSprite() {
		this._presentAnimation = this.add.sprite(1000, 1000, "PresentExplosion1") // Posición inicial del sprite
			.setScale(1) // Escala del sprite
			.setOrigin(0, 0); // Centro del sprite como origen
	}

	// Procesar las entradas del jugador
	_processInput() {
		// Movimiento del jugador 1
		if (this.playersInput.wasdKeys.A.isDown) {
			this.localPlayer.xInput = -1;
		} else if (this.playersInput.wasdKeys.D.isDown) {
			this.localPlayer.xInput = 1;
		} else if (this.playersInput.wasdKeys.W.isDown) {
			this.localPlayer.yInput = -1;
		} else if (this.playersInput.wasdKeys.S.isDown) {
			this.localPlayer.yInput = 1;
		}


		// Si el jugador presiona la tecla para colocar una bomba
		if (this.playersInput.bombKey1.isDown) {
			this.localPlayer.dispararInput = 1;
		}

		this.sendMessageToOpponent
			({
				isInput: true,
				xInput: this.localPlayer.xInput,
				yInput: this.localPlayer.yInput,
				dispararInput: this.localPlayer.dispararInput,
			});

	}

	_processOpponentInput(remotePlayerInput) {

		// Recibimos los inputs del jugador remoto
		if (!remotePlayerInput) return;

		this.remotePlayer.xInput = remotePlayerInput.xInput;
		this.remotePlayer.yInput = remotePlayerInput.yInput;
		this.remotePlayer.dispararInput = remotePlayerInput.dispararInput;
	}

	// Metodo que se ejecuta cuando un jugador recibe daño
	_playerHit(player) {
		player.isHit(); // Reduce la vida del jugador
		this._updatePlayerLives(player); // Actualiza la UI de las vidas
		console.log('player hit');
	}

	// Actualizar las vidas del jugador
	_updatePlayerLives(player) {
		let lifesArray;
		if (player.id === 1) {
			lifesArray = this.player1Lifes;
		} else {
			lifesArray = this.player2Lifes;
		}

		if (lifesArray.length > 0) {
			lifesArray.pop().destroy();
		}
	}

	// Método corregido para pasar el perdedor a la escena FinalScene
	_checkGameOver() {
		if (this.player1.isLoser() || this.player2.isLoser()) {
			const loserS = this.getLoserString();  // Obtienes el perdedor
			this.backgroundMusic.stop();


    // Método corregido para pasar el perdedor a la escena FinalScene
    _checkGameOver() {
        if (this.player1.isLoser() || this.player2.isLoser()) {
            const loser = this.getLoser();  // Obtienes el perdedor
			// const loserString = this.getLoserString();  // Obtienes el perdedor
            this.backgroundMusic.stop();
			
			
			wsMessageCallbacks = [];
			connection.onclose = (m) => console.log("sesion cerrada por fin de partida.");
			connection.send("!" + JSON.stringify({gameOver: true}));
			
			//this.scene.start('FinalOnlineScene', { loser: loser, "username" : this.username, loserString: loserString});
			this.scene.start('FinalOnlineScene', { loser: loser, "username" : this.username});
		}	
            
    }
	
	// Crear el botón de "Pause"
	_createPauseButton() {
		this.pauseButton = this.add.image(1250, 30, 'PauseButton')
			.setScale(0.15)
			.setOrigin(0.5, 0.5)
			.setInteractive() // Hacer el botón interactivo
			.on('pointerdown', () => this._togglePause()); // Llamar a la función para pausar o reanudar el juego

		this.pauseText = this.add.text(640, 600, '', {
			font: '32px Arial',
			fill: '#fff'
		}).setOrigin(0.5, 0.5);
	}

	// Función que alterna el estado de pausa
	_togglePause() {

		this._processPauseToggle();

		this.sendMessageToOpponent
			({
				isPauseInput: true, pause: true
			});

	}
	
	_processPauseToggle(){
		
		this.scene.pause("OnlineGameScene", {"username" : this.username});

		// Evita que se vuelva a crear el objeto del menú si ya existe
		if(!this.scene.get("PauseOnlineScene", {"username" : this.username}).loaded)
		{
		    this.scene.get("PauseOnlineScene", {"username" : this.username}).loaded = true;
		    this.scene.launch("PauseOnlineScene", {"username" : this.username}); // pone el menu de pausa por encima
		}
		else {
			this.scene.wake("PauseOnlineScene"); // reactiva el menú de pausa (que ya estaba por encima)
		}
	}

	// Agregar animaciones o efectos al botón de pausa
	_addButtonAnimations() {
		// Agregar eventos para el botón de pausa
		this._pauseButton.on('pointerover', () => this._onPauseButtonHover());
		this._pauseButton.on('pointerout', () => this._onPauseButtonOut());
	}

	// Animación de cuando el puntero pasa por encima del botón "Pause"
	_onPauseButtonHover() {
		this._pauseButton.setScale(1.05); // Cambiar a una escala mayor
	}

	// Animación de cuando el puntero sale del botón "Pause"
	_onPauseButtonOut() {
		this._pauseButton.setScale(1.0); // Volver a la escala original
	}

	sendMessageToOpponent(msg) {
		if (connection == null || connection.readyState == null || connection.readyState >= 2) {
			//error web socket cerrado tal
			return;
		}

		connection.send(JSON.stringify(msg));
	}

	processWSMessage(msg) {
		msg = JSON.parse(msg);

		if (msg.fromPlayer) {
			if (msg.isInput) {
				this._processOpponentInput(msg);
			}

			if (msg.isPauseInput && msg.pause) {
				this._processPauseToggle();
			}

			return;
		}

		if (msg.onMatch) {
			if (msg.error) console.log(msg.error);
		}
	}

        this.scene.launch("ConnectionLostScene", {"username" : this.username});
        this.enableInput(false);
        this.scene.stop("OnlineGameScene", {"username" : this.username});
        this.scene.sleep("OnlinePauseScene", {"username" : this.username});
    }

}
