// noinspection SpellCheckingInspection
class GameScene extends Phaser.Scene {
    //commit
    // Variables públicas
    playersInput = {
        wasdKeys: 0,
        arrowKeys: 0,
        bombKey1: 0,
        bombKey2: 0,
    }
    ground;
    player1; // El jugador 1 instancia la clase Player
    player2; // El jugador 1 instancia la clase Player
    bombas;
    position = new Phaser.Math.Vector2(1000, 500); // Posición inicial del jugador
    position2 = new Phaser.Math.Vector2(1000, 600); // Posición inicial del jugador
    player1Lifes = []; // Array para las vidas del jugador 1
    player2Lifes = []; // Array para las vidas del jugador 2

    _animInput=0;

    constructor() {
        super({ key: 'GameScene' });
    }

    // Variables privadas
    _bk; // Fondo de la escena
    _p1; // Imagen del jugador (pato)
    _presentAnimation; // Animación de los regalos
    _frames; // Frames de la animación
    _framesRate = 10; // Velocidad de la animación
    
    
    preload() {
        console.log("carga GameScene");
        this._loadAssets(); // Cargar assets para la animación

    }

    create() {
        this._setupInputs(); // Configurar las teclas de entrada
        this._createBackground(); // Crear fondo
        this._createLifes(); // Crear fondo
        this._initPlayer1(); // Inicializar jugador 1
        this._initPlayer2(); // Inicializar jugador 2
        
        this._createPresentExplosionAnimation(); // Crear la animación del regalo
        this._createPresentAnimationSprite(); // Crear el sprite para la animación

        this.bombas = this.physics.add.group({
            classType: Bomba,
            runChildUpdate: true, // Llama a `update` automáticamente para cada bomba
                allowGravity: false,
        });

        this.anims.create({
            key: "regaloSprite_anim",
            frames:this.anims.generateFrameNumbers("regaloSprite" ,{start:0 , end: 25}),
            frameRate: 30,
            repeat: 0 // No se repite
        })
        
        ///////////////////////////////////////////////////
        //MONTAR ESCENARIO
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
        ////////////////////////////////////////////////////


        
        
        
        
        ////////////////////////////////////////////////////
        // Crear el sprite del regalo y configurarlo fuera de la pantalla inicialmente
        this.regalo = this.physics.add.sprite(-100, -100, "PresentExplosion26").setScale(1);


        // Detectar el final de la animación del regalo
        this.regalo.on("animationcomplete", () => {
            // Detectar colisión con los jugadores al final de la animación
            this._checkCollisionWithPlayers();
        });

        ////////////////////////////////////////////////////

        this._setupCollisions(); // Configurar colisiones
        
    }

    update(time, delta) {
        this._processInput(); // Procesar las entradas del jugador
        this.player1.update(time, delta); // Actualizar jugador 1
        this.player2.update(time, delta); // Actualizar jugador 2

        // Fin del juego si un jugador pierde todas sus vidas
        this._checkGameOver();
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
    }
    
    // Métodos privados

    // Configura las teclas de entrada
    _setupInputs() {
        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.bombKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();
        this.playersInput.bombKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    // Crear fondo y elementos base
    _createBackground() {
        this._bk = this.add.image(0, 0, "GameBackground")
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }

    // Crear y posicionar las vidas de los jugadores
    _createLifes() {
        // Crear las vidas del jugador 1
        for (let i = 0; i < 3; i++) {
            const life = this.add.image(35 + i * 40, 30, "Life").setScale(0.2);
            this.player1Lifes.push(life); // Agrega cada vida al array
        }

        // Crear las vidas del jugador 2
        for (let i = 0; i < 3; i++) {
            const life = this.add.image(1216 - i * 40, 730, "Life").setScale(0.2);
            this.player2Lifes.push(life); // Agrega cada vida al array
        }
    }

    // Método que se ejecuta cuando un jugador recibe daño
    _playerHit(player) {
        player.isHit(); // Reduce la vida del jugador
        this._updatePlayerLives(player);
        console.log('player hit');
    }

    // Método para comprobar la colisión con los jugadores después de la animación
    _checkCollisionWithPlayers() {
        // Verificar si el regalo ha colisionado con los jugadores
        if (this.physics.overlap(this.regalo, this.player1.gameObject)) {
            this._playerHit(this.player1); // El jugador 1 ha sido golpeado
        } else if (this.physics.overlap(this.regalo, this.player2.gameObject)) {
            this._playerHit(this.player2); // El jugador 2 ha sido golpeado
        }
    }


    // Crear la animación de explosión del regalo
    _createPresentExplosionAnimation() {
        this._frames = []; // Aseguramos que _frames esté vacío antes de llenarlo
        for (let i = 1; i <= 26; i++) {
            this._frames.push({ key: "PresentExplosion" + i });
        }

        this.anims.create({
            key: "presentExplosion", // Nombre para la animación
            frames: this._frames, // Frames generados anteriormente
            frameRate: this._framesRate, // Velocidad de la animación
            repeat: 0, // Solo se reproduce una vez
        });
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

    // Inicializar al jugador 1
    _initPlayer1() {
        this.player1 = new Player(this, 1, this.position, 1);
    }
    _initPlayer2() {
        this.player2 = new Player(this, 2, this.position2, -1);
    }

    _checkColisionWithBomb(player, bomb) {
        //colisiona con un regalo
        player.isHit();
        if(_player1Colision()){
            this.player1Lifes.pop();
        }else{
            this.player2Lifes.pop();
        }
    }

    // Método para actualizar la interfaz de las vidas
    _updatePlayerLives(player) {
        // Determinar qué array de vidas se debe actualizar según el ID del jugador
        let lifesArray;

        if (player.id === 1) {
            lifesArray = this.player1Lifes; // Selecciona las vidas del jugador 1
        } else  {
            lifesArray = this.player2Lifes; // Selecciona las vidas del jugador 2
        }

        // Si el array de vidas tiene al menos un sprite, elimina el último
        if (lifesArray.length > 0) {
            const lifeSprite = lifesArray.pop(); // Saca el último sprite de la lista
            lifeSprite.destroy(); // Destruye el sprite para quitarlo de la pantalla
        }
        else {
            player.isLoserPlayer = true;
        }
    }


        // Cargar los assets de la animación
    _loadAssets() {
        this.load.spritesheet("regaloSprite", "assets/ASSTES/spritesheet.png" , {
            frameWidth: 192,
            frameHeight: 192
        });

    }
    
    _checkGameOver(){
        if(this.player1.isLoser()){
            this.scene.start('FinalScene');
        }else if(this.player2.isLoser()){
            this.scene.start('FinalScene');
        }
    }
    
    getLoser(){
        if(this.player1.isLoser()){
            return 1;
        } else {
            return 2;
        }
    }
    


}
