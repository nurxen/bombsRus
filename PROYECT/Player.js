// noinspection SpellCheckingInspection

class Player {

    // Variables públicas
    direction = new Phaser.Math.Vector2(); // Dirección (para disparar)
    xInput = 0; // Input horizontal : -1, 0, 1
    yInput = 0; // Input vertical : -1, 0, 1
    dispararInput = 0; //input de disparar: 0, 1
    isLoserPlayer = false; //Comprueba si el jugador ha ganado o perdido

    // Variables privadas
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
        if (this._isAlive) {
            // Determina la dirección basándote en la velocidad o algún control
            const directionX = this.body.velocity.x; // Velocidad en el eje X
            const directionY = this.body.velocity.y; // Velocidad en el eje X
            if (this.id=== 1){
                if (directionX > 0) {
                    // Movimiento hacia la derecha
                    this.gameObject.setFlipX(false); // No invierte la animación
                    this.gameObject.anims.play("conejo_anim_derecha", true)
                        .setScale(1.05);
                } else if (directionX < 0) {
                    // Movimiento hacia la izquierda
                    this.gameObject.setFlipX(true); // Invierte la animación
                    this.gameObject.anims.play("conejo_anim_derecha", true)
                        .setScale(1.05);
                }  else if (directionY > 0) {
                    // Movimiento hacia arriba
                    this.gameObject.setFlipX(false); // No se invierte para movimiento vertical
                    this.gameObject.anims.play("conejo_anim_frente", true)
                        .setScale(1.05);
                } else if (directionY < 0) {
                    // Movimiento hacia arriba
                    this.gameObject.setFlipX(false); // No se invierte para movimiento vertical
                    this.gameObject.anims.play("conejo_anim_atras", true)
                        .setScale(1.05);
                } else {
                    // Si no hay movimiento, reproducir animación idle en vez de detenerla
                    this.gameObject.anims.play("conejo_idle", true)
                        .setScale(1.05);
                }
            }
            else if (this.id === 2){
                if (directionX > 0) {
                    // Movimiento hacia la derecha
                    this.gameObject.setFlipX(false); // No invierte la animación
                    this.gameObject.anims.play("oso_anim_derecha", true)
                        .setScale(1.05);
                } else if (directionX < 0) {
                    // Movimiento hacia la izquierda
                    this.gameObject.setFlipX(true); // Invierte la animación
                    this.gameObject.anims.play("oso_anim_derecha", true)
                        .setScale(1.05);
                }  else if (directionY > 0) {
                    // Movimiento hacia arriba
                    this.gameObject.setFlipX(false); // No se invierte para movimiento vertical
                    this.gameObject.anims.play("oso_anim_frente", true)
                        .setScale(1.05);
                } else if (directionY < 0) {
                    // Movimiento hacia arriba
                    this.gameObject.setFlipX(false); // No se invierte para movimiento vertical
                    this.gameObject.anims.play("oso_anim_atras", true)
                        .setScale(1.05);
                }  else {
                    // Si no hay movimiento, reproducir animación idle en vez de detenerla
                    this.gameObject.anims.play("oso_idle", true)
                        .setScale(1.05);
                }
            }
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
        let spriteKey; // Variable para almacenar el spritesheet correspondiente

        // Determinar el spritesheet según el id
        if (this.id === 1) {
            spriteKey = "conejo";
        } else if (this.id === 2) {
            spriteKey = "oso";
        } else {
            console.warn(`ID desconocido: ${this.id}. Usando sprite por defecto.`);
            spriteKey = "conejo"; // Usar conejo por defecto si el id es desconocido
        }

        // Crear el sprite del jugador con el spritesheet correspondiente
        this.gameObject = this._scene.physics.add.sprite(position.x, position.y, spriteKey);
        this.gameObject.setOrigin(0.5, 0.5);

        // Reproducir animación inicial
        this.gameObject.anims.play(`${spriteKey}_idle`); // Animación idle para conejo u oso

        // Asigna el cuerpo físico al objeto
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
        this.isLoserPlayer = true;
        this._stopMovement(); // Detiene el movimiento
    }

    // Registrar un callback cuando el jugador recibe daño
    isHit() {
        console.log("hit player");
        this._healthPoints--; // Reduce la vida del jugador

        if (this._healthPoints <= 0) {
            this._die(); // Si la vida es 0 o menos, el jugador muere
            console.log("player die");
        }

    }
}
