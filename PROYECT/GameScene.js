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
    position = new Phaser.Math.Vector2(64, 256); // Posición inicial del jugador
    position2 = new Phaser.Math.Vector2(1216, 256); // Posición inicial del jugador

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
            repeat: 0
        })
        //this.physics.add.overlap(this.player1, this.bombas, this.player1.bombasHit, null, this.player1);


        this.ground = this.physics.add.staticGroup();
        this.ground.create(640, 360, "pato");

        // Añadir colisiones entre la bomba y el "ground"
        this.physics.add.collider(this.bombas, this.ground, (bomba, ground) => {
            bomba._onCollision();
        });

        this.physics.add.collider(this.player1.body, this.ground);
        this.physics.add.collider(this.player2.body, this.ground);
        this.physics.add.collider(this.bombas, this.ground);

        // Reproducir la animación de explosión de regalo solo una vez
        //this._presentAnimation.play("presentExplosion");  // es una prueba
    }

    update(time, delta) {
        this._processInput(); // Procesar las entradas del jugador
        this.player1.update(time, delta); // Actualizar el jugador
        this.player2.update(time, delta); // Actualizar el jugador
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
        this._bk = this.add.image(0, 0, "bk").setOrigin(0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }

    // Crear la animación de explosión del regalo
    _createPresentExplosionAnimation() {
        this._frames = []; // Asegurar que _frames esté vacío antes de llenarlo
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
        this._presentAnimation = this.add.sprite(400, 300, "PresentExplosion1") // Posición inicial del sprite
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



    // Cargar los assets de la animación (puedes usar esta función para cargar más assets en el futuro)
    _loadAssets() {
        this.load.spritesheet("regaloSprite", "assets/spritesheet.png" , {
            frameWidth: 192,
            frameHeight: 192
        });

    }
    


}
