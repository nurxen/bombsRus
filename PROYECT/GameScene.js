class GameScene extends Phaser.Scene {
    
    // Variables públicas
    playersInput = {
        wasdKeys: 0,
        bombKey1: 0,
    }

    player1; // El jugador 1 instancia la clase Player
    position = new Phaser.Math.Vector2(64, 256); // Posición inicial del jugador

    constructor() {
        super({ key: 'GameScene' });
    }

    // Variables privadas
    _bk; // Fondo de la escena
    _p1; // Imagen del jugador (pato)
    _presentAnimation; // Animación de los regalos
    _frames; // Frames de la animación
    _framesRate = 6; // Velocidad de la animación

    preload() {
        console.log("carga GameScene");
        this._loadAssets(); // Cargar assets para la animación
    }

    create() {
        this._setupInputs(); // Configurar las teclas de entrada
        this._createBackground(); // Crear fondo
        this._initPlayer1(); // Inicializar jugador 1
        this._createPresentExplosionAnimation(); // Crear la animación del regalo
        this._createPresentAnimationSprite(); // Crear el sprite para la animación

        // Reproducir la animación de explosión de regalo solo una vez
        this._presentAnimation.play("presentExplosion");  // es una prueba
    }

    update(time, delta) {
        this._processInput(); // Procesar las entradas del jugador
        this.player1.update(time, delta); // Actualizar el jugador
    }

    // Métodos privados

    // Configura las teclas de entrada
    _setupInputs() {
        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.bombKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Crear fondo y elementos base
    _createBackground() {
        this._bk = this.add.image(0, 0, "tile");
        this._p1 = this.add.image(0, 0, "pato");
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
            .setOrigin(0.5, 0.5); // Centro del sprite como origen
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

        // Si el jugador presiona la tecla para colocar una bomba
        if (this.playersInput.bombKey1.isDown) {
            this.player1.bombKey1 = 1;
        }
    }

    // Inicializar al jugador 1
    _initPlayer1() {
        this.player1 = new Player(this, 1, this.position, 1);
    }

    // Cargar los assets de la animación (puedes usar esta función para cargar más assets en el futuro)
    _loadAssets() {
        for (let i = 1; i <= 26; i++) {
            this.load.image("PresentExplosion" + i, "./assets/PRESENT" + i + ".png");
        }
    }
}
