// noinspection SpellCheckingInspection
class GameScene extends Phaser.Scene {
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
    position = new Phaser.Math.Vector2(1300, 800); // Posición inicial del jugador 1
    position2 = new Phaser.Math.Vector2(1300, 1000); // Posición inicial del jugador 2
    player1Lifes = []; // Array de vidas del jugador 1
    player2Lifes = []; // Array de vidas del jugador 2

    // Variables privadas
    _bk; // Fondo de la escena
    _presentAnimation; // Sprite para la animación de los regalos
    _frames; // Frames de la animación

    constructor() {
        super({ key: 'GameScene' });
    }

    // Preload: Cargar todos los recursos
    preload() {
        console.log("Cargando GameScene...");
        this._loadAssets();
    }

    create() {
        this._setupInputs(); // Configurar las teclas de entrada
        this._createBackground(); // Crear fondo
        this._createLifes(); // Crear fondo
        this._initPlayers(); // Inicializar jugadores
        this._setupBombas(); // Configurar las bombas
        this._setupGround(); // Crear el escenario
        this._createPresentExplosionAnimation(); // Crear la animación del regalo
        this._createPresentAnimationSprite(); // Crear el sprite para la animación
        this._setupCollisions(); // Configurar colisiones
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
    getLoser() {
        return this.player1.isLoser() ? 1 : 2;
    }

    endGame() {
        this.scene.start('FinalScene'); // Cambiar a la escena final
    }

    // Metodo para comprobar la colisión con los jugadores después de la animación
    checkCollisionWithPlayers(explosionImage) {
        // Verificar si el regalo ha colisionado con los jugadores
        if (this.physics.overlap(explosionImage, this.player1.gameObject)) {
            this._playerHit(this.player1); // El jugador 1 ha sido golpeado
        } else if (this.physics.overlap(explosionImage, this.player2.gameObject)) {
            this._playerHit(this.player2); // El jugador 2 ha sido golpeado
        }
    }

    // ===========================
    // Métodos Privados
    // ===========================
    
    // Cargar los recursos necesarios
    _loadAssets() {
        this.load.spritesheet("regaloSprite", "assets/ASSTES/spritesheet.png", {
            frameWidth: 192,
            frameHeight: 192,
        });
    }

    // Configurar las entradas del teclado
    _setupInputs() {
        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.bombKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();
        this.playersInput.bombKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
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
        for (let i = 0; i < 3; i+=1.25) {
            const life = this.add.image(35 + i * 40, 30, "Life").setScale(0.2);
            this.player1Lifes.push(life);
        }

        // Vidas del jugador 2
        for (let i = 0; i < 3; i+=1.25) {
            const life = this.add.image(1216 - i * 40, 730, "Life").setScale(0.2);
            this.player2Lifes.push(life);
        }
    }
    
    // Inicializar los jugadores
    _initPlayers() {
        this.player1 = new Player(this, 1, this.position, 1);
        this.player2 = new Player(this, 2, this.position2, -1);
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
            frames:this.anims.generateFrameNumbers("regaloSprite" ,{start:0 , end: 25}),
            frameRate: 30,
            repeat: 0 // No se repite
        })
    }

    // Crear el sprite de la animación
    _createPresentAnimationSprite() {
        this._presentAnimation = this.add.sprite(1000, 1000, "PresentExplosion1") // Posición inicial del sprite
            .setScale(1) // Escala del sprite
            .setOrigin(0,0); // Centro del sprite como origen
    }

    // Procesar las entradas del jugador
    _processInput() {
        // Movimiento del jugador 1
        if (this.playersInput.wasdKeys.A.isDown) {
            this.player1.xInput = -1;
        } else if (this.playersInput.wasdKeys.D.isDown) {
            this.player1.xInput = 1;
        } else if (this.playersInput.wasdKeys.W.isDown) {
            this.player1.yInput = -1;
        } else if (this.playersInput.wasdKeys.S.isDown) {
            this.player1.yInput = 1;
        }

        // Movimiento del jugador 2
        if (this.playersInput.arrowKeys.left.isDown) {
            this.player2.xInput = -1;
        } else if (this.playersInput.arrowKeys.right.isDown) {
            this.player2.xInput = 1;
        } else if (this.playersInput.arrowKeys.up.isDown) {
            this.player2.yInput = -1;
        } else if (this.playersInput.arrowKeys.down.isDown) {
            this.player2.yInput = 1;
        }

        // Si el jugador presiona la tecla para colocar una bomba
        if (this.playersInput.bombKey1.isDown) {
            this.player1.dispararInput = 1;
        }

        // Si el jugador presiona la tecla para colocar una bomba
        if (this.playersInput.bombKey2.isDown) {
            this.player2.dispararInput = 1;
        }

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
        } else {
            this.endGame();
        }
    }

    // Comprobar si el juego ha terminado
    _checkGameOver() {
        if (this.player1.isLoser() || this.player2.isLoser()) {
            this.scene.start('FinalScene');
        }
    }
}
