// Configuración del juego en Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }  // Gravedad en el eje Y
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, PauseScene, GameOverScene, WinScene] // Orden de las escenas
};

// Creación de una nueva instancia del juego con la configuración especificada
const game = new Phaser.Game(config);

// Métodos para gestionar escenas

function removeScene(key) {
    game.scene.remove(key);
}

function moveSceneUp(key) {
    game.scene.moveUp(key);
}

function transitionToScene(key) {
    game.scene.transition({
        target: key,
        duration: 1000
    });
}
