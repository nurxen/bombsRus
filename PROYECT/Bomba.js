class Bomba extends Phaser.Physics.Arcade.Sprite {
    direction = new Phaser.Math.Vector2();
    id;
    _moveSpeed = 500;
    _maxDistance = 300; // Distancia máxima que la bomba puede recorrer
    _startPosition = new Phaser.Math.Vector2();
    _hasStopped = false;
    
    constructor(scene, id, x, y, direction) {
        super(scene, x, y, "PresentExplosion1");
        this.id = id;
        this._startPosition.set(x, y); // Guardar posición inicial
        this.direction = direction.clone().normalize();
        scene.bombas.add(this, true);
        this.body.setAllowGravity(false);
        this.body.setBounce(0);
        
        this.body.setVelocity(this.direction.x * this._moveSpeed, this.direction.y * this._moveSpeed);

        console.log(`Velocidad X: ${this.body.velocity.x}, Velocidad Y: ${this.body.velocity.y}`);
        console.log(this.direction);
        
        
    }
    

    update(time, delta) {
        super.update(time, delta);
        
        if (!this._hasStopped) {
            // Calcular la distancia recorrida
            let distanceTravelled = Phaser.Math.Distance.Between(
                this._startPosition.x,
                this._startPosition.y,
                this.x,
                this.y
            );
            
            

            if (distanceTravelled >= this._maxDistance) {
                console.log(distanceTravelled)
                this.body.setVelocity(0); // Detener el movimiento
                this._disableCollision(); // Desactivar colisión
                this._hasStopped = true;
                // Reproducir la animación de explosión
                this._playExplosion();
                console.log(this.body.x, this.body.y, this.x, this.y);
            }
        }
    }

    _disableCollision() {
        // Desactivar la colisión para esta bomba
        this.body.checkCollision.none = true; // Desactiva todas las colisiones
    }

    _playExplosion() {
        // Crear el sprite de explosión en la posición actual de la bomba
        const explosion = this.scene.add.sprite(this.x, this.y, "regaloSprite");
        explosion.play("regaloSprite_anim"); // Reproducir la animación

        // Eliminar el sprite de explosión al finalizar la animación
        explosion.on("animationcomplete", () => {
            explosion.destroy();
        });

        // Destruir la bomba después de la explosión
        this.destroy();
    }

    _onCollision() {
        // Llamado cuando la bomba colisiona con el ground
        if (!this._hasStopped) {
            this.body.setVelocity(0); // Detener el movimiento
            this._disableCollision(); // Desactivar colisión
            this._hasStopped = true;
            this._playExplosion(); // Reproducir la animación de explosión
        }
    }
    
}
