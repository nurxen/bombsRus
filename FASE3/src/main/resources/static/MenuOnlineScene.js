class MenuOnlineScene extends Phaser.Scene {
    // Variables públicas
    loseBackground;
    startButton;
    startText;
    settingsButton;
    settingsText;
    optionsButton;
    accountButton;
    accountFormContainer;
    username;
    usernameText;
    chatButton;
    chatFormContainer;
	buttonsEnabled = true;
	isChatOpen = false; // Variable para controlar el estado del chat
	refresh;
	sinWifi;
	reconectButton;

    constructor() {
        super({ key: 'MenuOnlineScene' });
    }

    init(data) {
        this.username = data.username;
    }

    create() {
        this._createBackground();
        this._createStartButton();
        this._createSettingsButton();
        this._createOptionsButton();
        this._createRankingButton();
        this._createBackButton();
        this._createAccountButton();
        this._createChatButton();
		this._createReconnectButton();
        this._createUsernameText();
        this._addButtonAnimations();
		this._defaultrefresh();
		this._actualizarUsuariosConectados(); 
		// Variable para almacenar el texto de usuarios conectados
		this.usuariosConectadosText = this.add.text(20, this.game.config.height - 40, 'Usuarios Conectados: 0', {
		    fontSize: '20px',
		    fill: '#ffffff',
		    align: 'left'
		});

    }

    // Crear el fondo de la escena
    _createBackground() {
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 0.2, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }

    // Crear y mostrar el texto del username
    _createUsernameText() {
        this.usernameText = this.add.text(30, 30, `👤 ${this.username.toUpperCase()}`, {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        const textWidth = this.usernameText.width;
        const textHeight = this.usernameText.height;

        const background = this.add.graphics();
        background
            .fillStyle(0x000000, 0.5)
            .fillRoundedRect(20, 20, textWidth + 20, textHeight + 20, 10);

        this.usernameText.setDepth(1);
    }

    // Crear el botón de "Start Game"
    _createStartButton() {
        this.startButton = this.add.image(640, 600, 'StartButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._startGame());

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    _startGame() {
        this.scene.start('GameScene', { "username": this.username });
        //this.backgroundMusic.stop();
    }

    _createSettingsButton() {
        this.settingsButton = this.add.image(240, 500, 'HelpButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._settingsScene());
    }

    _settingsScene() {
        this.scene.start('SettingsOnlineScene', {"username" : this.username});
    }

	_createReconnectButton() {
	        this.reconectButton = this.add.image(6000, 6000, 'reloadButton')
	            .setScale(0.5)
	            .setOrigin(0.5, 0.5)
	            .setInteractive()
				this.sinWifi= this.add.image(6000, 6000, 'sinWifi').setScale(0.75)
	  }
		
    _createBackButton() {
        this.BackButton = this.add.image(1175, 725, 'BackButton')
            .setScale(0.25)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._back());
    }
	
	_stopUsuariosInterval() {
	    if (this.usuariosInterval) {
	        clearInterval(this.usuariosInterval);
	        this.usuariosInterval = null;
	    }
	}

	_back() {
	    this._stopUsuariosInterval();
	    fetch(`/api/usuarioConectado?usuario=${encodeURIComponent(this.username)}`, {
	        method: 'DELETE'
	    }).then(() => {
	        console.log('Usuario desconectado.');
	        this.scene.start('RegisterScene');
	    }).catch(error => console.error('Error removing user:', error));
	}


    _createOptionsButton() {
        this.optionsButton = this.add.image(1040, 500, 'OptionsButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._optionsScene());
    }

    _optionsScene() {
        this.scene.start('OptionsOnlineScene', {"username" : this.username});
    }

    _createAccountButton() {
        this.accountButton = this.add.image(this.sys.game.config.width - 90, 80, 'UserButton')
            .setScale(0.25)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._showAccountOptions());
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
		                throw new Error("Error ${response.status}: ${response.statusText}");
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
		            this.scene.start('MenuOnlineScene', { "username": this.username }); // Cambiar a la escena principal
		        })
		        .catch(error => alert("ERROR UPDATING PASSWORD: ${error.message}"));
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
		                throw new Error("Error ${response.status}: ${response.statusText}");
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
					this.username = null;
		            // Redirigir al RegisterScene después de eliminar la cuenta
					
		            this.scene.start('RegisterScene', {"username" : this.username}); // Cambiar a la escena de registro
					this._actualizarUsuariosConectados();
		        })
		        .catch(error => alert("ERROR DELETING ACCOUNT: ${error.message}"));
		    }
			
		}

    _createRankingButton() {
        this.rankingButton = this.add.image(this.sys.game.config.width - 135, 175, 'RankingButton')
            .setScale(0.25)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._rankingScene());
    }

    _rankingScene() {
		this.scene.start('RankingScene', {"username" : this.username}); // Cambiar a la escena del juego
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
				this.rankingButton.on('pointerover', () => this._onButtonHoverAccount(this.rankingButton));
				this.rankingButton.on('pointerout', () => this._onButtonOutAccount(this.rankingButton));
				
				this.BackButton.on('pointerover', () => this._onButtonHoverBack(this.BackButton));
				this.BackButton.on('pointerout', () => this._onButtonOutBack(this.BackButton));
				
				this.accountButton.on('pointerover', () => this._onButtonHoverAccount(this.accountButton));
				this.accountButton.on('pointerout', () => this._onButtonOutAccount(this.accountButton));
				
				this.chatButton.on('pointerover', () => this._onButtonHoverCircle(this.chatButton));
				this.chatButton.on('pointerout', () => this._onButtonOutCircle(this.chatButton));
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
			    button.setScale(0.26); // Cambiar a una escala mayor
			}

			// Animación de cuando el puntero sale del botón "Start"
			_onButtonOutBack(button) {
			    button.setScale(0.25); // Volver a la escala original
			}
			
			// Animación de cuando el puntero pasa por encima del botón "Start"
			_onButtonHoverAccount(button) {
				button.setScale(0.30); // Cambiar a una escala mayor
			}

			// Animación de cuando el puntero sale del botón "Start"
			_onButtonOutAccount(button) {
				button.setScale(0.25); // Volver a la escala original
			}
			
			// Animación de cuando el puntero pasa por encima del botón "Start"
			_onButtonHoverCircle(button) {
				button.setScale(0.21); // Cambiar a una escala mayor
			}

			// Animación de cuando el puntero sale del botón "Start"
			_onButtonOutCircle(button) {
				button.setScale(0.18); // Volver a la escala original
			}



	// Crear el botón de "Chat"
	    _createChatButton() {
	        this.chatButton = this.add.image(this.sys.game.config.width - 195, 80, 'ChatIcon')
	            .setScale(0.18)
	            .setOrigin(0.5, 0.5)
	            .setInteractive()
	            .on('pointerdown', () => this._toggleChatForm()); // Usar _toggleChatForm en lugar de _openChatForm
	    }

	    // Función para alternar entre abrir y cerrar el chat
	    _toggleChatForm() {
	        if (this.isChatOpen) {
	            this._closeChatForm();  // Cerrar el chat si está abierto
	        } else {
	            this._openChatForm();   // Abrir el chat si está cerrado
	        }
	    }

	    // Abrir el formulario de chat
	    _openChatForm() {
			
			this.scene.start('ChatScene', { "username": this.username });
			this.startButton.setInteractive(false);

	        // Crear overlay que bloquea la pantalla
	        this._createOverlay();

	        // Si ya hay un formulario de chat previo, eliminarlo
	        if (this.chatFormContainer) {
	            document.body.removeChild(this.chatFormContainer);
	        }

	        // Crear el contenedor del formulario de chat
	        this.chatFormContainer = document.createElement('div');
	        this.chatFormContainer.id = 'chatForm';
	        this.chatFormContainer.style.position = 'absolute';
	        this.chatFormContainer.style.top = '50%';
	        this.chatFormContainer.style.left = '50%';
	        this.chatFormContainer.style.transform = 'translate(-50%, -50%)';
	        this.chatFormContainer.style.background = 'rgba(0, 0, 0, 0.8)';
	        this.chatFormContainer.style.borderRadius = '15px';
	        this.chatFormContainer.style.padding = '20px 30px';
	        this.chatFormContainer.style.textAlign = 'center';
	        this.chatFormContainer.style.color = 'white';
	        this.chatFormContainer.style.fontFamily = 'Arial, sans-serif';
	        this.chatFormContainer.style.width = '400px';

	        // Agregar el formulario al cuerpo de la página
	        this.chatFormContainer.innerHTML = `
	            <h2 style="margin-bottom: 20px;">CHAT</h2>
	            <div id="chatMessages" style="height: 200px; overflow-y: auto; background: #333; padding: 10px; border-radius: 10px; margin-bottom: 10px;"></div>
	            <input id="chatInput" type="text" placeholder="Type your message..." style="width: 80%; padding: 10px; border-radius: 5px; margin-bottom: 10px;"/>
	            <button id="sendChatBtn" style="padding: 10px; background: #3498db; color: white; border: none; border-radius: 5px;">Send</button>
	            <button id="closeChatFormBtn" style="padding: 10px; background: #c0392b; color: white; border: none; border-radius: 5px; margin-left: 10px;">Close</button>
	        `;
	        document.body.appendChild(this.chatFormContainer);

	        // Event listeners para botones de enviar y cerrar
	        document.getElementById('sendChatBtn').addEventListener('click', () => this._sendChatMessage());
	        document.getElementById('closeChatFormBtn').addEventListener('click', () => this._closeChatForm());

	        this._fetchChatMessages(); // Comienza a actualizar los mensajes periódicamente

	        // Actualizar el estado del chat
	        this.isChatOpen = true;
	    }

	    // Cerrar el formulario de chat
	    _closeChatForm() {
	        this.chatFormContainer.style.display = 'none';
	        // Remover el overlay
	        this._removeOverlay();
			
	        // Actualizar el estado del chat
	        this.isChatOpen = false;
			
	    }

		// Enviar mensaje al servidor
		    _sendChatMessage() {
		        const messageInput = document.getElementById('chatInput');
		        const message = messageInput.value.trim();
		        if (!message) return;

		        fetch('/api/chat', {
		            method: 'POST',
		            headers: { 'Content-Type': 'application/json' },
		            body: JSON.stringify({ username: this.username, message }) //enviamos al servidor /api/chat usando POST con el username usando JSON
		        })
		        .then(() => {
		            messageInput.value = '';
		            this._fetchChatMessages(); //actualizamos la lista de mensajes
		        });
		    }



			
			_actualizarUsuariosConectados() {
			    this.usuariosInterval = setInterval(async () => {
			        try {
			            const response = await fetch('/api/usuariosConectados');
			            if (response.ok) {
			                const usuarios = await response.json();		
							console.log('Usuarios conectados:', usuarios);	                
			                // Actualizar el texto con el número de usuarios conectados
			                this.usuariosConectadosText.setText('Usuarios Conectados: ' + usuarios.length);
			            }
			        } catch (error) {
			            console.error('Error fetching connected users:', error);
			        }
			    }, 2000); // Actualizar cada 2 segundos
			}

			
			_error() {
			    console.log('Connection failed. Redirecting to the menu...');
			    this._stopRefresh(); // Detiene el refresh

			    // Muestra el ícono de sin conexión
			    this.sinWifi.setPosition(636,200);
				this.reconectButton.setPosition(640,600);

			    // Crea el botón de reconexión
			    this.reconectButton.on('pointerdown', () => {
			            fetch('/api/conexion', {
			                method: 'GET',
			                headers: { 'Content-Type': 'application/json' }
			            })
			            .then(response => {
			                if (!response.ok) {
			                    throw new Error('Failed to connect');
			                }
			                console.log('Reconnection successful!');

			                // Eliminar el ícono y el botón al reconectar
							this._actualizarUsuariosConectados();
			                this.sinWifi.destroy(); // Elimina el ícono de la escena
			                this.reconectButton.destroy(); // Elimina el botón de reconexión de la escena
							this.scene.start('RegisterScene', { "username": this.username });
							
			            })
			            .catch(error => {
			                console.error('Reconnection error:', error);
			                // Podrías mantener el ícono y botón si sigue fallando la conexión
			            });
			        });
			}

			_tryconexion() {
			    fetch('/api/conexion', {
			        method: 'GET',
			        headers: { 'Content-Type': 'application/json' }
			    })
			    .then(response => {
			        if (!response.ok) {
			            throw new Error('Failed to connect');
			        }
			        console.log('Connection successful!');
			    })
			    .catch(error => {
			        console.error('Connection error:', error);
			        this._error(); // Llama al manejador de errores
			    });
			}

			_defaultrefresh() {
			    this.refresh = setInterval(() => {
			        this._tryconexion();
			    }, 1000); // Intenta conectar cada segundo
			}

			_stopRefresh() {
			    clearInterval(this.refresh); // Detiene el intervalo
			}

			
			
			
		    // Obtener mensajes del servidor
		    _fetchChatMessages() {
		        fetch('/api/chat')
		            .then(response => response.json())
		            .then(messages => {
		                const chatMessagesDiv = document.getElementById('chatMessages');
		                chatMessagesDiv.innerHTML = messages.map(msg => `<p><strong>${msg.username}:</strong> ${msg.message}</p>`).join('');
		            });

		        // Vuelve a llamar a este método después de 0.5 segundos para que se le muestren a todos los usuarios los mensajes
		        setTimeout(() => this._fetchChatMessages(), 500);
		    }

		    // Agregar un overlay para bloquear toda la pantalla
		    _createOverlay() {
		        this.overlay = this.add.graphics()
		            .fillStyle(0x000000, 0.5)
		            .fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
		            .setDepth(2); // Asegura que el overlay esté encima de todo.
		    }

		    // Remover el overlay cuando se cierra el chat
		    _removeOverlay() {
		        if (this.overlay) {
		            this.overlay.clear(); // Limpiar el overlay de la pantalla.
		            this.overlay = null;
		        }
		    }
}
