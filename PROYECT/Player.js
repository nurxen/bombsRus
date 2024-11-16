// noinspection SpellCheckingInspection

class Player {

    // Variables públicas
    characterSprite = ""; // referencia al sprite del bomberman
    horizontalInput = 0; // input horizontal: -1 (izquierda), 0 (quieto), 1 (derecha)
    verticalInput = 0; // input vertical: -1 (arriba), 0 (quieto), 1 (abajo)
    bombInput = 0; //input de disparar: 0, 1
    bombDirection = new Phaser.Math.Vector2(); // dirección para colocar la bomba    

    // Variables privadas
    _animationKeys = // objeto con todas las keys para reproducir las animaciones
        {
            idle: "idle",   // Animación de estar quieto
            walk: "walk",   // Animación de caminar
            die: "die", // Animación de morir (explosión)
        };
    _currentAnimationKey = ""; // animación actual
    _movementSpeed = 200; // velocidad de movimiento (horizontal y vertical)
    _bombCooldown = 0.5; // tiempo a esperar entre colocar bombas
    _isBombOnCooldown = false; // control para el cooldown de la bomba
    _cooldownTimer = 0; // timer para el cooldown de la bomba
    _healthPoints = 6; // salud del bomberman
    _isAlive = true; // control para no moverse al estar muerto
    _hitCallbacks = []; // array para guardar todos los callbacks a llamar cuando el bomberman reciba daño
    _deathCallbacks = []; // lo mismo de arriba pero cuando el bomberman muere
    _shouldUpdateAnimations = true; // control para no cambiar de animación si el bomberman está en estado de golpe o muerto

    constructor(scene, id, position, xDirection)
    {
        this._scene = scene;
        this.id = id;
        this.p1=scene.physics.add.sprite(position.x, position.y, "pato");
    }
    
    update(time, delta)
    {
        if(!this._isAlive)
        {
            this.characterSprite.setVelocityX(0);
            return;
        }

        this._move(delta);
        this._placeBomb();
        this._updateAnimations();

        //reseteo de inputs para el siguiente frame
        this.xInput = 0;
        this.yInput = 0;
        this.bombInput = 0;
    }
    
    
    // metodos privados

    _move(delta)
    {
        //movimiento
        this.body.setVelocityX(this._moveSpeed * this.xInput);

        //direccion (para disparar)
        this.direction.y = this.yInput;
    }


    _placeBomb(){
        
    }

    _updateAnimations()
    {}

    _setAnimation(key)
    {}

    _die()
    {}
}