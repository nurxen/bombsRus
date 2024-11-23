// noinspection SpellCheckingInspection

class Player {

    // Variables públicas
    /*characterSprite = ""; // Referencia al sprite del bomberman
    horizontalInput = 0; // Input horizontal: -1 (izquierda), 0 (quieto), 1 (derecha)
    verticalInput = 0; // Input vertical: -1 (arriba), 0 (quieto), 1 (abajo)
    bombInput = 0; // Input de disparar: 0, 1
    bombDirection = new Phaser.Math.Vector2(); // Dirección para colocar la bomba*/
    direction = new Phaser.Math.Vector2(); // Dirección (para disparar)
    xInput = 0; // Input horizontal : -1, 0, 1
    yInput = 0; // Input vertical : -1, 0, 1
    dispararInput = 0; //input de disparar: 0, 1
    isLoserPlayer = false; //Comprueba si el jugador ha ganado o perdido

    // Variables privadas
    /*_animationKeys = {
        idle: "idle",   // Animación de estar quieto
        walk: "walk",   // Animación de caminar
        die: "die",     // Animación de morir (explosión)
    };
    _bombCooldown = 0.5; // Tiempo a esperar entre colocar bombas
    _isBombOnCooldown = false; // Control para el cooldown de la bombas
    _hitCallbacks = []; // Array para guardar los callbacks cuando el bomberman reciba daño
    _deathCallbacks = []; // Lo mismo que _hitCallbacks pero cuando el bomberman muere*/
    _healthPoints = 3; // Salud del bomberman
    _currentAnimationKey = ""; // Animación actual
    _moveSpeed = 200; // Velocidad de movimiento (horizontal y vertical)
    _cooldownTimer = 0; // Timer para el cooldown de la bomba
    _isOnCooldown = false;
    _castCooldown = 1000; //tiempo a esperar entre disparo y disparo
    _shouldUpdateAnimations = true; // Control para no cambiar de animación si está en estado de golpe o muerto
    _isAlive = true; // Control para no moverse al estar muerto
    
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
        this._disparar(delta);
        //reseteo para el sigueinte frame
        this.xInput = 0;
        this.yInput = 0;
        this.dispararInput = 0;
    }

    isLoser(){
        return this.isLoserPlayer;
    }

    // Crear el sprite del jugador
    _createPlayerSprite(position) {
        this.gameObject = this._scene.physics.add.sprite(position.x, position.y, "pato");
        this.gameObject.setOrigin(0.5, 0.5);
        this.body = this.gameObject.body;
    }

    // Detener el movimiento del jugador 
    _stopMovement() {
        this.body.setVelocityX(0); // No se mueve horizontalmente
    }

    // Mover al jugador según la dirección de entrada
    _move(delta) {
        // Calcular la nueva velocidad
        let velocityX = this._moveSpeed * this.xInput;
        let velocityY = this._moveSpeed * this.yInput;

        // Obtener límites del mundo
        let bounds = this._scene.physics.world.bounds;
        
        // Comprobar si la posición actual más el movimiento está dentro de los límites
        let newX = this.body.x + velocityX * (delta / 1000);
        let newY = this.body.y + velocityY * (delta / 1000);

        // Limitar el movimiento si se sale de los límites, si no sale no entra en los ifs
        // y mete en setvelocity la velocidad normal
        if (newX < bounds.left + 66) {
            velocityX = 0;
            this.body.x = bounds.left + 66; //reseteo para que no avance mas
        } else if (newX > bounds.right - this.body.width - 66) {
            velocityX = 0;
            this.body.x = bounds.right - this.body.width - 66; //reseteo para que no avance mas
        }

        if (newY < bounds.top + 72) {
            velocityY = 0;
            this.body.y = bounds.top + 72;
        } else if (newY > bounds.bottom - this.body.height - 72) {
            velocityY = 0;
            this.body.y = bounds.bottom - this.body.height - 72;
        }

        // Aplicar la velocidad restringida
        this.body.setVelocityX(velocityX);
        this.body.setVelocityY(velocityY);

        // Actualizar la dirección para disparar
        this.direction.set(this.xInput, this.yInput);
    }


    _disparar(delta) {
        if(!this._isOnCooldown)
        {
            if(this.dispararInput)
            {
                //cast
                this._isOnCooldown = true;
                this._cooldownTimer = 0;
                // console.log(this.direction);
                let bomba = new Bomba(this._scene, this.id, this.gameObject.x, this.gameObject.y, this.direction);
            }
        }
        else
        {
            this._cooldownTimer += delta;
            if(this._cooldownTimer >= this._castCooldown) this._isOnCooldown = false;
        }
    }

    // Restablecer las entradas después de cada frame
    _resetInputs() {
        this.xInput = 0;
        this.yInput = 0;
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
        this.scene.start('FinalSecene');
        this.isWinnerPlayer = false;
    }

    // Registrar un callback cuando el jugador recibe daño
    isHit() {
        this._healthPoints--; // Reduce la vida del jugador

        if (this._healthPoints <= 0) {
            this._die(); // Si la vida es 0 o menos, el jugador muere
        }

    }
    
    getLifes(){
        return _healthPoints;
    }
}
