class RegisterScene extends Phaser.Scene {

    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startButtonO; // Botón de inicio online
    startText; // Texto del botón de inicio
    settingsButton; // Botón de salida
    settingsText; // Texto del botón de salida
	username;
	
	
    constructor() {
        super({ key: 'RegisterScene' });
    }
	
	init(data) {
		this.username = data.username;
	}

    create() {
		this.username = null;
		// Estilo global para todos los textos
		    this.sys.game.config.defaultFontFamily = 'Poppins, Montserrat, Arial Rounded MT Bold, sans-serif';
		    this.sys.game.config.defaultFontSize = '36px';
        this._createBackground(); // Crear fondo
        this._createStartButtonLocal(); // Crear botón de inicio local
        this._createStartButtonOnline(); // Crear botón de inicio online
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Crear el fondo de la escena
    _createBackground() {
        // Verificar si la música ya está activa
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 0.2, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Start Game" local
    _createStartButtonLocal() {
        this.startButton = this.add.image(240, 600, 'LocalButton')
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
			
	        this.scene.start('MenuScene', {"username" : this.username}); // Cambiar a la escena del juego
	    }

    // Crear el botón de "Start Game" online
    _createStartButtonOnline() {
        this.startButtonO = this.add.image(1040, 600, 'OnlineButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startRegister()); // Llamar a la función para abrir el popup

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    _startRegister() {
        this._popUp();
    }

    // Agregar animaciones o efectos a los botones
    _addButtonAnimations() {
        // Agregar eventos para el botón de start
        this.startButton.on('pointerover', () => this._onStartButtonHover());
        this.startButton.on('pointerout', () => this._onStartButtonOut());

        this.startButtonO.on('pointerover', () => this._onStartButtonHoverOnline());
        this.startButtonO.on('pointerout', () => this._onStartButtonOutOnline());
    }

    // Animación de cuando el puntero pasa por encima del botón "Start"
    _onStartButtonHover() {
        this.startButton.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Start"
    _onStartButtonOut() {
        this.startButton.setScale(1.0); // Volver a la escala original
    }

    // Animación de cuando el puntero pasa por encima del botón "Start" online
    _onStartButtonHoverOnline() {
        this.startButtonO.setScale(1.05); // Cambiar a una escala mayor
    }

    // Animación de cuando el puntero sale del botón "Start" online
    _onStartButtonOutOnline() {
        this.startButtonO.setScale(1.0); // Volver a la escala original
    }
	
	

	_popUp() {
	    // Crear un contenedor DOM para el formulario
	    const formContainer = document.createElement('div');
	    formContainer.id = 'registro';
	    formContainer.style.position = 'absolute';
	    formContainer.style.top = '50%';
	    formContainer.style.left = '50%';
	    formContainer.style.transform = 'translate(-50%, -50%)';
	    formContainer.style.background = 'rgba(0, 0, 0, 0.8)';
	    formContainer.style.borderRadius = '15px';
	    formContainer.style.padding = '20px 30px';
	    formContainer.style.textAlign = 'center';
	    formContainer.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.5)';
	    formContainer.style.color = 'white';
	    formContainer.style.fontFamily = 'Arial, sans-serif';
	    formContainer.style.width = '400px';

		formContainer.innerHTML = `
		    <h2 id="formTitle" style="margin-bottom: 20px; font-size: 28px; background: white; -webkit-background-clip: 
		        text; -webkit-text-fill-color: transparent;">
		        LOG IN
		    </h2>
		    <div id="form-section">
		        <!-- Mensaje de error -->
		        <p id="errorMessage" style="color: red; display: none; font-size: 14px; margin-bottom: 10px;"></p>
		        
		        <!-- Inicio de Sesión -->
		        <div id="loginForm">
		            <input id="usernameLogin" type="text" placeholder="Username" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
		            <input id="passwordLogin" type="password" placeholder="Password" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
		            <button id="submitLoginBtn" style="padding: 10px; cursor: pointer; width: 100%; background: #77dd77; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
		                Confirm
		            </button>
		        </div>

		        <!-- Registro (oculto por defecto) -->
		        <div id="registerForm" style="display: none;">
		            <input id="usernameRegister" type="text" placeholder="Username" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
		            <input id="passwordRegister" type="password" placeholder="Password" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
		            <button id="submitRegisterBtn" style="padding: 10px; cursor: pointer; width: 100%; background: #77dd77; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
		                Confirm
		            </button>
		        </div>
		    </div>

	        <p id="toggleFormText" style="margin-top: 15px; color: #ddd; cursor: pointer; text-decoration: underline;">
	            No account? Try registering here
	        </p>
	        <button id="closeBtn" style="padding: 10px; cursor: pointer; width: 100%; margin-top: 15px; background: #7d2b55; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
	            Close
	        </button>
	    `;

	    // Agregar el contenedor al cuerpo del documento
	    document.body.appendChild(formContainer);

	    // Lógica para alternar entre formularios
	    document.getElementById('toggleFormText').addEventListener('click', () => {
	        const loginForm = document.getElementById('loginForm');
	        const registerForm = document.getElementById('registerForm');
	        const formTitle = document.getElementById('formTitle');
	        const toggleText = document.getElementById('toggleFormText');

	        if (loginForm.style.display === 'none') {
	            // Mostrar formulario de inicio de sesión
	            loginForm.style.display = 'block';
	            registerForm.style.display = 'none';
	            formTitle.innerText = 'LOG IN';
	            toggleText.innerText = 'No account? Try registering here';
	        } else {
	            // Mostrar formulario de registro
	            loginForm.style.display = 'none';
	            registerForm.style.display = 'block';
	            formTitle.innerText = 'REGISTER';
	            toggleText.innerText = 'Already have an account? Log in here.';
	        }
	    });

	    // Eventos para manejar envío de formularios
		document.getElementById('submitRegisterBtn').addEventListener('click', async () => {
		    const username = document.getElementById('usernameRegister').value;
		    const password = document.getElementById('passwordRegister').value;
		    const errorMessage = document.getElementById('errorMessage');

		    if (!username || !password) {
		        errorMessage.style.display = 'block';
		        errorMessage.innerText = 'Please, fill all the blanks.';
		        return;
		    }

		    try {
		        const response = await fetch('/api/usuario', {
		            method: 'POST',
		            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		            body: new URLSearchParams({ usuario: username, contrasena: password })
		        });

		        const result = await response.text();
		        if (result.includes('USER CREATED SUSCCESSFULLY.')) {
		            localStorage.setItem('currentUser', username);
		            console.log('Usuario registrado:', username);
		            errorMessage.style.display = 'none'; // Oculta el mensaje de error
		        } else {
		            errorMessage.style.display = 'block';
		            errorMessage.innerText = 'Error registering your user, please try again.';
		        }
		    } catch (error) {
		        errorMessage.style.display = 'block';
		        errorMessage.innerText = 'An error occurred. Try again.';
		        console.error(error);
		    }
		});


		document.getElementById('submitLoginBtn').addEventListener('click', async () => {
		    const username = document.getElementById('usernameLogin').value;
		    const password = document.getElementById('passwordLogin').value;
		    const errorMessage = document.getElementById('errorMessage');

		    if (!username || !password) {
		        errorMessage.style.display = 'block';
		        errorMessage.innerText = 'Please, fill all the blanks.';
		        return;
		    }

			try {
		            const response = await fetch('/api/loadusuario', {
		                method: 'POST',
		                headers: { 'Content-Type': 'application/json' },
		                body: JSON.stringify({ username: username, password: password })
		            });

		            if (response.ok) { // Verifica si la respuesta es exitosa
		                localStorage.setItem('currentUser', username); // Guarda el usuario actual
		                // Notificar al servidor que el usuario está conectado
		                await fetch(`/api/usuarioConectado?usuario=${encodeURIComponent(username)}`, {
		                    method: 'POST'
		                });
		                console.log('ACTIVE USER:', localStorage.getItem('currentUser'));

		                // Eliminar el formulario antes de cambiar de escena
		                const formContainer = document.getElementById('registro');
		                if (formContainer) {
		                    document.body.removeChild(formContainer);
		                }

		                this.scene.start('MenuOnlineScene', { "username": username }); // Cambia a la escena principal
		            } else {
		            errorMessage.style.display = 'block';
		            errorMessage.innerText = 'Wrong username or password.';
		        }
		    } catch (error) {
		        errorMessage.style.display = 'block';
		        errorMessage.innerText = 'An error occurred. Try again.';
		        console.error(error);
		    }
		});


	    // Botón para cerrar el pop-up
	    document.getElementById('closeBtn').addEventListener('click', () => {
	        formContainer.style.transition = 'opacity 0.5s';
	        formContainer.style.opacity = 0;

	        setTimeout(() => {
	            document.body.removeChild(formContainer);
	        }, 500);
	    });
	}
}