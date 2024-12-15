class MenuOnlineScene extends Phaser.Scene {
    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startText; // Texto del botón de inicio
    settingsButton; // Botón de salida
    settingsText; // Texto del botón de salida
    optionsButton; // Botón de opciones
    accountButton; // Botón de cuenta
    accountFormContainer; // Contenedor del formulario para cambiar la contraseña o borrar cuenta
	username;
	usernameText;
	
    constructor() {
        super({ key: 'MenuOnlineScene' });
    }

	init(data) { 
				this.username = data.username;
			}
						
    // Método que llamamos cuando creamos la escena
    create() {
		
		
			
        this._createBackground(); // Crear fondo
        this._createStartButton(); // Crear botón de inicio
        this._createSettingsButton(); // Crear botón de ajustes
        this._createOptionsButton(); // Crear botón de opciones
		this._createRankingButton(); // Crear botón de puntuaciones
		this._createBackButton(); // Crear botón de volver atrás
        this._createAccountButton(); // Crear botón para cambiar cuenta
		this._createUsernameText();
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Crear el fondo de la escena
    _createBackground() {
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 0.2, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }
	
	// Crear y mostrar el texto del username en la esquina superior izquierda
	_createUsernameText() {
	    // Crear el texto del username primero, para obtener sus dimensiones
	    this.usernameText = this.add.text(30, 30, `👤 ${this.username.toUpperCase()}`, {
	        fontFamily: 'Verdana, Geneva, sans-serif', // Fuente moderna
	        fontSize: '26px', // Tamaño del texto
	        fontStyle: 'bold', // Negrita
	        color: '#FFFFFF', // Texto blanco
	        align: 'center' // Alineación
	    }); // Esquina superior izquierda

	    // Obtener el tamaño del texto
	    const textWidth = this.usernameText.width;
	    const textHeight = this.usernameText.height;

	    // Crear un fondo redondeado detrás del texto usando gráficos
	    const background = this.add.graphics();
	    background
	        .fillStyle(0x000000, 0.5) // Fondo negro translúcido
	        .fillRoundedRect(20, 20, textWidth + 20, textHeight + 20, 10); // Ajustar al tamaño del texto (+ márgenes)

	    // Asegurar que el texto esté por encima del fondo
	    this.usernameText.setDepth(1);
	}


    // Crear el botón de "Start Game"
    _createStartButton() {
        this.startButton = this.add.image(640, 600, 'StartButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startGame()); // Llamar a la función para iniciar el juego

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que inicia el juego
    _startGame() {
		
        this.scene.start('GameScene', {"username" : this.username}); // Cambiar a la escena del juego
		this.backgroundMusic.stop();
        
    }

    // Crear el botón de "Settings"
    _createSettingsButton() {
        this.settingsButton = this.add.image(240, 500, 'HelpButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._settingsScene()); // Llamar a la función para salir del juego

        this.settingsText = this.add.text(640, 500, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }
	
	// Función que maneja la ajustes del juego
	_settingsScene() {
	    this.scene.start('SettingsOnlineScene'); // Cambiar a la escena del juego
	    console.log("Ajustes"); // Aquí se puede agregar la lógica para salir del juego, por ejemplo, cerrando la ventana o redirigiendo
	    
	}
	
	// Crear el botón de "Back"
		    _createBackButton() {
		        this.BackButton = this.add.image(1175, 725, 'MainMenuButton')
		            .setScale(0.13)
		            .setOrigin(0.5, 0.5)
		            .setInteractive() // Hacer el botón interactivo
		            .on('pointerdown', () => this._back()); // Llamar a la función para iniciar el juego

		        this.backText = this.add.text(640, 600, '', {
		            font: '32px Arial',
		            fill: '#fff'
		        }).setOrigin(0.5, 0.5);
		    }

		    // Función que te devuelve al menu de registro
		    _back() {
		        this.scene.start('RegisterScene'); // Cambiar a la escena de registro
		        
		    }

    // Crear el botón de "Options"
    _createOptionsButton() {
        this.optionsButton = this.add.image(1040, 500, 'OptionsButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._optionsScene()); // Llamar a la función para cambiar a opciones

        this.settingsText = this.add.text(640, 500, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que maneja la escena de opciones
    _optionsScene() {
        this.scene.start('OptionsOnlineScene'); // Cambiar a la escena de opciones
        console.log("Opciones");
    }

    // Crear el botón "Cuenta"
    _createAccountButton() {
        this.accountButton = this.add.image(this.sys.game.config.width - 40, 40, 'AccountButton')
            .setScale(1.0)
            .setOrigin(1, 0)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._showAccountOptions()); // Mostrar el formulario para gestionar cuenta
    }

    // Mostrar formulario de cambio de cuenta o contraseña
    _showAccountOptions() {
        if (this.accountFormContainer) {
            document.body.removeChild(this.accountFormContainer); // Eliminar cualquier formulario anterior
        }
        this._createAccountForm(); // Crear un nuevo formulario
    }

    // Crear el formulario para cambiar contraseña o borrar cuenta
    _createAccountForm() {
        this.accountFormContainer = document.createElement('div');
        this.accountFormContainer.id = 'accountForm';
        this.accountFormContainer.style.position = 'absolute';
        this.accountFormContainer.style.top = '50%';
        this.accountFormContainer.style.left = '50%';
        this.accountFormContainer.style.transform = 'translate(-50%, -50%)';
        this.accountFormContainer.style.background = 'rgba(0, 0, 0, 0.8)';
        this.accountFormContainer.style.borderRadius = '15px';
        this.accountFormContainer.style.padding = '20px 30px';
        this.accountFormContainer.style.textAlign = 'center';
        this.accountFormContainer.style.color = 'white';
        this.accountFormContainer.style.fontFamily = 'Arial, sans-serif';
        this.accountFormContainer.style.width = '400px';

        this.accountFormContainer.innerHTML = `
            <h2 style="margin-bottom: 20px;">ACCOUNT</h2>
            <button id="changePasswordBtn" style="padding: 10px; width: 100%; margin-bottom: 10px; background: orange; color: white; border: none; border-radius: 20px;">
                Update password
            </button>
            <button id="deleteAccountBtn" style="padding: 10px; width: 100%; background: red; color: white; border: none; border-radius: 20px;">
                Delete account
            </button>
            <button id="closeAccountFormBtn" style="padding: 10px; width: 100%; margin-top: 15px; background: #c0392b; color: white; border: none; border-radius: 20px;">
                Close
            </button>
        `;

        document.body.appendChild(this.accountFormContainer);

		// Depuración: verificar que el botón está en el DOM
		    console.log('submitLoginBtn:', document.getElementById('submitLoginBtn'));
		
			
        document.getElementById('changePasswordBtn').addEventListener('click', () => this._changePassword());
        document.getElementById('deleteAccountBtn').addEventListener('click', () => this._deleteAccount());
        document.getElementById('closeAccountFormBtn').addEventListener('click', () => {
            this.accountFormContainer.style.display = 'none'; // Ocultar el formulario
        });
    }

	// Cambiar la contraseña
	_changePassword() {
	    const currentUser = localStorage.getItem('currentUser');
	    if (!currentUser) {
	        alert('NO ACTIVE USER.');
	        return;
	    }

	    const newPassword = prompt('NEW PASSWORD:');
	    if (newPassword) {
	        const url = `/api/usuario?usuario=${encodeURIComponent(currentUser)}&nuevaContrasena=${encodeURIComponent(newPassword)}`;
	        fetch(url, {
	            method: 'PUT',
	        })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`Error ${response.status}: ${response.statusText}`);
	            }
	            return response.text();
	        })
	        .then(message => {
	            alert(message);

				// Ocultar el formulario en lugar de eliminarlo
	            const accountForm = document.getElementById('accountForm');
	            if (accountForm) {
	                accountForm.style.display = 'none'; // Ocultar el formulario
	            }
				
	            // Redirigir al MenuOnlineScene después de cambiar la contraseña
	            this.scene.start('MenuOnlineScene'); // Cambiar a la escena principal
	        })
	        .catch(error => alert(`ERROR UPDATING PASSWORD: ${error.message}`));
	    }
	}

	// Eliminar usuario
	_deleteAccount() {
	    const currentUser = localStorage.getItem('currentUser');
	    if (!currentUser) {
	        alert('NO ACTIVE USER.');
	        return;
	    }

	    const confirmDelete = confirm('ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?');
	    if (confirmDelete) {
	        const url = `/api/usuario?usuario=${encodeURIComponent(currentUser)}`;
	        fetch(url, {
	            method: 'DELETE',
	        })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error(`Error ${response.status}: ${response.statusText}`);
	            }
	            return response.text();
	        })
	        .then(message => {
	            alert(message);
	            localStorage.removeItem('currentUser'); // Eliminar el usuario de localStorage

	            // Eliminar el pop-up antes de cambiar a RegisterScene
	            const accountForm = document.getElementById('accountForm');
	            if (accountForm) {
	            	accountForm.style.display = 'none'; // Ocultar el formulario
	            }

	            // Redirigir al RegisterScene después de eliminar la cuenta
	            this.scene.start('RegisterScene'); // Cambiar a la escena de registro
	        })
	        .catch(error => alert(`ERROR DELETING ACCOUNT: ${error.message}`));
	    }
	}
	
	// Crear el botón de "Ranking"
		    _createRankingButton() {
		        this.rankingButton = this.add.image(340, 300, 'RankingButton')
		            .setScale(1.0)
		            .setOrigin(0.5, 0.5)
		            .setInteractive() // Hacer el botón interactivo
		            .on('pointerdown', () => this._rankingScene()); // Llamar a la función para iniciar el juego

		        this.rankingText = this.add.text(640, 600, '', {
		            font: '32px Arial',
		            fill: '#fff'
		        }).setOrigin(0.5, 0.5);
		    }

		    // Función que inicia el ranking
		    _rankingScene() {
		        this.scene.start('RankingScene'); // Cambiar a la escena del juego
		        //this.backgroundMusic.stop();
		    }
			
	// Agregar animaciones o efectos a los botones
	    _addButtonAnimations() {
	        // Agregar eventos para el botón de start
	        this.startButton.on('pointerover', () => this._onButtonHover(this.startButton));
	        this.startButton.on('pointerout', () => this._onButtonOut(this.startButton));

	        // Agregar eventos para el botón de ajustes
	        this.settingsButton.on('pointerover', () => this._onButtonHover(this.settingsButton));
	        this.settingsButton.on('pointerout', () => this._onButtonOut(this.settingsButton));

	        // Agregar eventos para el botón de ajustes
	        this.optionsButton.on('pointerover', () => this._onButtonHover(this.optionsButton));
	        this.optionsButton.on('pointerout', () => this._onButtonOut(this.optionsButton));
			
			// Agregar eventos para el botón de ajustes
			this.rankingButton.on('pointerover', () => this._onButtonHover(this.rankingButton));
			this.rankingButton.on('pointerout', () => this._onButtonOut(this.rankingButton));
			
			this.BackButton.on('pointerover', () => this._onButtonHoverBack(this.BackButton));
			this.BackButton.on('pointerout', () => this._onButtonOutBack(this.BackButton));
	    }

	    // Animación de cuando el puntero pasa por encima del botón "Start"
	    _onButtonHover(button) {
	        button.setScale(1.05); // Cambiar a una escala mayor
	    }

	    // Animación de cuando el puntero sale del botón "Start"
	    _onButtonOut(button) {
	        button.setScale(1.0); // Volver a la escala original
	    }
		
		// Animación de cuando el puntero pasa por encima del botón "Start"
		_onButtonHoverBack(button) {
		    button.setScale(0.14); // Cambiar a una escala mayor
		}

		// Animación de cuando el puntero sale del botón "Start"
		_onButtonOutBack(button) {
		    button.setScale(0.13); // Volver a la escala original
		}
}