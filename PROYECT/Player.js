class Player {

    // Variables públicas
    characterSprite = ""; // Referencia al sprite del bomberman
    horizontalInput = 0; // Input horizontal: -1 (izquierda), 0 (quieto), 1 (derecha)
    verticalInput = 0; // Input vertical: -1 (arriba), 0 (quieto), 1 (abajo)
    bombInput = 0; // Input de disparar: 0, 1
    bombDirection = new Phaser.Math.Vector2(); // Dirección para colocar la bomba
    direction = new Phaser.Math.Vector2(); // Dirección (para disparar)
    xInput = 0; // Input horizontal : -1, 0, 1
    yInput = 0; // Input vertical : -1, 0, 1

    // Variables privadas
    _animationKeys = {
        idle: "idle",   // Animación de estar quieto
        walk: "walk",   // Animación de caminar
        die: "die",     // Animación de morir (explosión)
    };
    _currentAnimationKey = ""; // Animación actual
    _moveSpeed = 200; // Velocidad de movimiento (horizontal y vertical)
    _bombCooldown = 0.5; // Tiempo a esperar entre colocar bombas
    _isBombOnCooldown = false; // Control para el cooldown de la bomba
    _cooldownTimer = 0; // Timer para el cooldown de la bomba
    _healthPoints = 6; // Salud del bomberman
    _isAlive = true; // Control para no moverse al estar muerto
    _hitCallbacks = []; // Array para guardar los callbacks cuando el bomberman reciba daño
    _deathCallbacks = []; // Lo mismo que _hitCallbacks pero cuando el bomberman muere
    _shouldUpdateAnimations = true; // Control para no cambiar de animación si está en estado de golpe o muerto

    constructor(scene, id, position, xDirection) {
        this._scene = scene;
        this.id = id;

        // Crear el objeto del jugador
        this._createPlayerSprite(position);
    }

    update(time, delta) {
        if (!this._isAlive) {
            this._stopMovement(); // Detener movimiento si está muerto
            return;
        }

        this._move(delta);
        this._resetInputs();
    }

    // Métodos privados

    // Crear el sprite del jugador
    _createPlayerSprite(position) {
        this.gameObject = this._scene.physics.add.sprite(position.x, position.y, "pato");
        this.body = this.gameObject.body;
    }

    // Detener el movimiento del jugador 
    _stopMovement() {
        this.body.setVelocityX(0); // No se mueve horizontalmente
    }

    // Mover al jugador según la dirección de entrada
    _move(delta) {
        this.body.setVelocityX(this._moveSpeed * this.xInput);
        this.body.setVelocityY(this._moveSpeed * this.yInput);

        // Actualizar la dirección para disparar
        this.direction.set(this.xInput, this.yInput);
    }

    // Restablecer las entradas después de cada frame
    _resetInputs() {
        this.xInput = 0;
        this.yInput = 0;
    }
    
    _placeBomb() {
        // Por hacer
    }

    // Actualizar las animaciones (por ahora vacío, pero puede ser implementado)
    _updateAnimations() {
        if (this._shouldUpdateAnimations) {
            // Implementar lógica de actualización de animaciones
        }
    }

    // Cambiar la animación del jugador
    _setAnimation(key) {
        if (this._currentAnimationKey !== key) {
            this._currentAnimationKey = key;
            this.gameObject.anims.play(key, true); // Cambiar la animación
        }
    }

    // Ejecutar la lógica cuando el jugador muere
    _die() {
        this._isAlive = false;
        this._stopMovement(); // Detiene el movimiento
    }

    // Registrar un callback cuando el jugador recibe daño
    _onHit() {
        
    }

    // Registrar un callback cuando el jugador muere
    _onDeath() {
        
    }
}
