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
        this._createUsernameText();
        this._addButtonAnimations();
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
        this.backgroundMusic.stop();
    }

    _createSettingsButton() {
        this.settingsButton = this.add.image(240, 500, 'HelpButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._settingsScene());
    }

    _settingsScene() {
        this.scene.start('SettingsOnlineScene');
        console.log("Ajustes");
    }

    _createBackButton() {
        this.BackButton = this.add.image(1175, 725, 'MainMenuButton')
            .setScale(0.13)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._back());
    }

    _back() {
        this.scene.start('RegisterScene');
    }

    _createOptionsButton() {
        this.optionsButton = this.add.image(1040, 500, 'OptionsButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._optionsScene());
    }

    _optionsScene() {
        this.scene.start('OptionsOnlineScene');
        console.log("Opciones");
    }

    _createAccountButton() {
        this.accountButton = this.add.image(this.sys.game.config.width - 40, 40, 'UserButton')
            .setScale(0.5)
            .setOrigin(1, 0)
            .setInteractive()
            .on('pointerdown', () => this._showAccountOptions());
    }

    _showAccountOptions() {
        // Implementación existente del formulario de cuenta
    }

    _createRankingButton() {
        this.rankingButton = this.add.image(this.sys.game.config.width - 40, 400, 'RankingButton')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._rankingScene());
    }

    _rankingScene() {
		this.scene.start('RankingScene', {"username" : this.username}); // Cambiar a la escena del juego
    }

    _addButtonAnimations() {
        this.startButton.on('pointerover', () => this._onButtonHover(this.startButton));
        this.startButton.on('pointerout', () => this._onButtonOut(this.startButton));
        this.settingsButton.on('pointerover', () => this._onButtonHover(this.settingsButton));
        this.settingsButton.on('pointerout', () => this._onButtonOut(this.settingsButton));
        this.optionsButton.on('pointerover', () => this._onButtonHover(this.optionsButton));
        this.optionsButton.on('pointerout', () => this._onButtonOut(this.optionsButton));
        this.rankingButton.on('pointerover', () => this._onButtonHover(this.rankingButton));
        this.rankingButton.on('pointerout', () => this._onButtonOut(this.rankingButton));
        this.BackButton.on('pointerover', () => this._onButtonHoverBack(this.BackButton));
        this.BackButton.on('pointerout', () => this._onButtonOutBack(this.BackButton));
    }

    _onButtonHover(button) {
        button.setScale(1.05);
    }

    _onButtonOut(button) {
        button.setScale(1.0);
    }

    _onButtonHoverBack(button) {
        button.setScale(0.14);
    }

    _onButtonOutBack(button) {
        button.setScale(0.13);
    }

	// Crear el botón de "Chat"
	    _createChatButton() {
	        this.chatButton = this.add.image(this.sys.game.config.width - 35, 600, 'StartButton')
	            .setScale(0.5)
	            .setOrigin(1, 0)
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

		    // Obtener mensajes del servidor
		    _fetchChatMessages() {
		        fetch('/api/chat')
		            .then(response => response.json())
		            .then(messages => {
		                const chatMessagesDiv = document.getElementById('chatMessages');
		                chatMessagesDiv.innerHTML = messages.map(msg => `<p><strong>${msg.username}:</strong> ${msg.message}</p>`).join('');
		            });

		        // Vuelve a llamar a este método después de 2 segundos para que se le muestren a todos los usuarios los mensajes
		        setTimeout(() => this._fetchChatMessages(), 2000);
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
