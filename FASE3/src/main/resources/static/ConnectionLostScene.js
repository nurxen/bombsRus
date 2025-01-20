class ConnectionLostScene extends Phaser.Scene {

	username;
	
	constructor() {
	        super({ key: 'ConnectionLostScene' });
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
	        this.connectingScreen = this.add.image(0, 0, 'connectingBackground').setOrigin(0, 0);
			this._createExitButton(); // Crear botón de salida
			this._addButtonAnimations(); // Crear botón de salida
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

}

