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
        this.body.setBounce(1);

        // Aplicar la velocidad ajustada
        this.body.setVelocity(this.direction.x * this._moveSpeed, this.direction.y * this._moveSpeed);
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this._hasStopped) {
            // Calcular la distancia recorrida
            let distanceTravelled = Phaser.Math.Distance.Between(
                this._startPosition.x,
                this._startPosition.y,
                this.body.x,
                this.body.y
            );

            if (distanceTravelled >= this._maxDistance) {
                this.body.setVelocity(0); // Detener el movimiento
                this._disableCollision(); // Desactivar colisión
                this._hasStopped = true;
            }
        }
    }

    _disableCollision() {
        // Desactivar la colisión para esta bomba
        this.body.checkCollision.none = true; // Desactiva todas las colisiones
    }
}
