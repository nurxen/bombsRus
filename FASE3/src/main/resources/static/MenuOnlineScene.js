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

    constructor() {
        super({ key: 'MenuOnlineScene' });
    }

    // Método que llamamos cuando creamos la escena
    create() {
			
        this._createBackground(); // Crear fondo
        this._createStartButton(); // Crear botón de inicio
        this._createSettingsButton(); // Crear botón de ajustes
        this._createOptionsButton(); // Crear botón de opciones
        this._createAccountButton(); // Crear botón para cambiar cuenta
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Crear el fondo de la escena
    _createBackground() {
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 3, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
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
        this.scene.start('GameScene'); // Cambiar a la escena del juego
        //this.backgroundMusic.stop();
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

    // Función que maneja los ajustes del juego
    _settingsScene() {
        this.scene.start('SettingsScene'); // Cambiar a la escena de ajustes
        console.log("Ajustes");
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
            <h2 style="margin-bottom: 20px;">Cuenta</h2>
            <button id="changePasswordBtn" style="padding: 10px; width: 100%; margin-bottom: 10px; background: orange; color: white; border: none; border-radius: 20px;">
                Cambiar Contraseña
            </button>
            <button id="deleteAccountBtn" style="padding: 10px; width: 100%; background: red; color: white; border: none; border-radius: 20px;">
                Borrar Cuenta
            </button>
            <button id="closeAccountFormBtn" style="padding: 10px; width: 100%; margin-top: 15px; background: #c0392b; color: white; border: none; border-radius: 20px;">
                Cerrar
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
	        alert('No hay usuario activo.');
	        return;
	    }

	    const newPassword = prompt('Ingresa tu nueva contraseña:');
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
	            this.scene.start('RegisterScene'); // Cambiar a la escena principal
	        })
	        .catch(error => alert(`Error al cambiar la contraseña: ${error.message}`));
	    }
	}

	// Eliminar usuario
	_deleteAccount() {
	    const currentUser = localStorage.getItem('currentUser');
	    if (!currentUser) {
	        alert('No hay usuario activo.');
	        return;
	    }

	    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar tu cuenta?');
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
	        .catch(error => alert(`Error al eliminar la cuenta: ${error.message}`));
	    }
	}



    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de start
        this.startButton.on('pointerover', () => this._onStartButtonHover());
        this.startButton.on('pointerout', () => this._onStartButtonOut());

        // Agregar eventos para el botón de ajustes
        this.settingsButton.on('pointerover', () => this._onSettingsButtonHover());
        this.settingsButton.on('pointerout', () => this._onSettingsButtonOut());

        // Agregar eventos para el botón de opciones
        this.optionsButton.on('pointerover', () => this._onOptionsButtonHover());
        this.optionsButton.on('pointerout', () => this._onOptionsButtonOut());
    }

    // Animación de cuando el puntero pasa por encima del botón "Start"
    _onStartButtonHover() {
        this.startButton.setScale(1.05);
    }

    // Animación de cuando el puntero sale del botón "Start"
    _onStartButtonOut() {
        this.startButton.setScale(1.0);
    }

    // Animación de cuando el puntero pasa por encima del botón "Settings"
    _onSettingsButtonHover() {
        this.settingsButton.setScale(1.05);
    }

    // Animación de cuando el puntero sale del botón "Settings"
    _onSettingsButtonOut() {
        this.settingsButton.setScale(1.0);
    }

    // Animación de cuando el puntero pasa por encima del botón "Options"
    _onOptionsButtonHover() {
        this.optionsButton.setScale(1.05);
    }

    // Animación de cuando el puntero sale del botón "Options"
    _onOptionsButtonOut() {
        this.optionsButton.setScale(1.0);
    }
}