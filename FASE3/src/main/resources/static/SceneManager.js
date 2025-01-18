	// Configuración del juego en Phaser
// noinspection SpellCheckingInspection

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 768,
    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // Gravedad en el eje Y
            debug:false
        }
    },
    scene: [PreloadScene, RegisterScene, MenuScene, 
		SettingsScene,  OptionsScene,  GameScene, PauseScene, FinalScene, 
		MenuOnlineScene, RankingScene, SettingsOnlineScene, OptionsOnlineScene, ChatScene, FinalOnlineScene] // Orden de las escenas
};

// Creación de una nueva instancia del juego con la configuración especificada
const game = new Phaser.Game(config);


const openWS = (openCallback, errorCallback) => 
{
    connection = new WebSocket('ws://' + window.location.href.slice(6) + 'match');

    connection.onopen = openCallback;

    connection.onmessage = (m) => { for(const c of wsMessageCallbacks) c(m); }

    connection.onerror = (e)  => {console.log("WebSocket error: " + e); errorCallback()};
    
    connection.onclose = (e) => {connection = null; console.log("conexion cerrada: " + e);}
}


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
