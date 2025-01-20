class Connecting extends Phaser.Scene {

	username;
	
	constructor() {
	        super({ key: 'Connecting' });
	    }
		
	connectingScreen;
	searchingScreen;
	exitButton;
	
	init(data) 
	{
		this.username = data.username;
	}
	
	create()
	    {
	        this.searchingScreen = this.add.image(0, 0, "searchingBackground").setOrigin(0, 0).setVisible(true);
			this._createExitButton(); // Crear botón de salida
			this._addButtonAnimations(); // Crear botón de salida
			
			// Enviar el user con el que quiero jugar
			openWS(() => this.onWSOpen(), () => this.onWSError());
			        wsMessageCallbacks.push((msg) => this.processWSMessage(msg.data))
		}
			
	onWSOpen()
	    {
	        console.log("conexion abierta")
	        const userData = {username : this.username}

	        connection.send('!' + JSON.stringify(userData));
	    }

    onWSError()
    {
        console.log("no se ha podido conectar.")
        this.closeScreen();
    }

	processWSMessage(msg)
	{
	    msg = JSON.parse(msg)

	    if(msg.onStart) //si es el mensaje de respuesta al intentar iniciar una sesion
	    {
	        if(msg.error) console.log(msg.error);
	        else if(msg.info) //el usuario entro en la cola de emparejamiento
	        {
	            console.log(msg.info);
	            this.searchingScreen.setVisible(true);
	        }
	        return;
	    }

	    if(msg.onQueue)
	    {
	        if(msg.queueTimeout)  // si el mensaje es timeout
	        {
	            console.log(msg.error); // Mostrar el error al jugador
	            // Esto por si se lleva un rato (20 segundos sin hacer nada, que se cierre solo el error)
	            setTimeout(() => {this.minTimeOver = true; this.closeScreen()}, 1000 * 20);
	        }

	        if(msg.matchStart)
	        {
	            matchData = msg;
	            wsMessageCallbacks.shift(); //quitar el callback del array
	    		this.game.sound.stopAll();
	            this.scene.start("OnlineGameScene", { isPlaying: true, "username": this.username });
				
	        }
	    }
	}
	
	_createExitButton() {
	    this.exitButton = this.add.image(640, 610, 'MainMenuButton')
	        .setScale(0.2)
	        .setOrigin(0.5, 0.5)
	        .setInteractive()
	        .on('pointerdown', () => this._exitGame());
	}

	_exitGame() {
	    this.scene.start('MenuOnlineScene', {"username" : this.username});
	}

	_addButtonAnimations() {

		[this.exitButton].forEach(button => {
		    button.on('pointerover', () => this._onButtonHover(button));
		    button.on('pointerout', () => this._onButtonOut(button));
		});
	}
		
	_onButtonHover(button) {
	    button.setScale(0.21);
	}

	_onButtonOut(button) {
	    button.setScale(0.2);
	}
	
	closeScreen()
    {
        this.game.sound.stopAll();
        //this.audioClose.play();
        if(connection != null && connection.readyState < 2) connection.close();
        this.scene.start("MenuOnlineScene", { isPlaying: true, "username": this.username });
    }
}

