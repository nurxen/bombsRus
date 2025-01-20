	// Configuración del juego en Phaser
// noinspection SpellCheckingInspection

let user = null;
let gameplayResourcesLoaded = false;
let IP = "";
let connection = null;
let wsMessageCallbacks = []
let matchData = null;

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
		SettingsScene,  OptionsScene,  GameScene, OnlineGameScene, PauseScene, PauseOnlineScene, FinalScene, Connecting, ConnectionLostScene,
		MenuOnlineScene, RankingScene, SettingsOnlineScene, OptionsOnlineScene, ChatScene, FinalOnlineScene] // Orden de las escenas
};

// Creación de una nueva instancia del juego con la configuración especificada
const game = new Phaser.Game(config);


const openWS = (openCallback, errorCallback) => 
{
	// Se establece una conexión WebSocket con una URL dinámica que se basa en la URL actual de la ventana.
    connection = new WebSocket('ws://' + window.location.href.slice(6) + 'match');

	// Asigna un callback que se ejecutará cuando la conexión se abra correctamente.
    connection.onopen = openCallback;
    
	// Define el comportamiento al recibir un mensaje.
    connection.onmessage = (m) => { for(const c of wsMessageCallbacks) c(m); }

	// Maneja errores en la conexión WebSocket.
    connection.onerror = (e)  => {
        console.log("WebSocket error: " + e); 
        errorCallback();
    };

	// Define el comportamiento cuando se cierre la conexión.
    connection.onclose = (e) => {
        connection = null; 
        console.log("conexion cerrada: " + e);
    };
};


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
