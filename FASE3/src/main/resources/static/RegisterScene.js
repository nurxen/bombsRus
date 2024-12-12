class RegisterScene extends Phaser.Scene {

    // Variables públicas
    loseBackground; // Fondo de la escena de pérdida
    startButton; // Botón de inicio
    startButtonO; // Botón de inicio online
    startText; // Texto del botón de inicio
    settingsButton; // Botón de salida
    settingsText; // Texto del botón de salida

    constructor() {
        super({ key: 'RegisterScene' });
    }

    create() {
        this._createBackground(); // Crear fondo
        this._createStartButtonLocal(); // Crear botón de inicio local
        this._createStartButtonOnline(); // Crear botón de inicio online
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Crear el fondo de la escena
    _createBackground() {
        // Verificar si la música ya está activa
        if (!this.sound.get('menuBackgroundMusic') || !this.sound.get('menuBackgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('menuBackgroundMusic', { volume: 3, loop: true });
            this.backgroundMusic.play();
        }

        this.loseBackground = this.add.image(0, 0, 'MainMenuBackground')
            .setOrigin(0) // Establece el origen en la esquina superior izquierda
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta al tamaño del canvas
    }

    // Crear el botón de "Start Game" local
    _createStartButtonLocal() {
        this.startButton = this.add.image(240, 600, 'StartButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startGame()); // Llamar a la función para iniciar el juego

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Crear el botón de "Start Game" online
    _createStartButtonOnline() {
        this.startButtonO = this.add.image(1040, 600, 'StartButton')
            .setScale(1.0)
            .setOrigin(0.5, 0.5)
            .setInteractive() // Hacer el botón interactivo
            .on('pointerdown', () => this._startRegister()); // Llamar a la función para abrir el popup

        this.startText = this.add.text(640, 600, '', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    // Función que inicia el juego
    _startGame() {
        this.scene.start('MenuScene'); // Cambiar a la escena del juego
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
            <h2 style="margin-bottom: 20px; font-size: 28px; background: white; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                REGISTER / LOG IN
            </h2>
            <div id="tab-buttons" style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                <button id="registerTab" style="flex: 1; padding: 10px; cursor: pointer; background: orange; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
                    Register
                </button>
                <button id="loginTab" style="flex: 1; padding: 10px; cursor: pointer; background: #2196f3; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
                    Log in
                </button>
            </div>
            <div id="form-section">
                <!-- Registro -->
                <div id="registerForm">
                    <input id="usernameRegister" type="text" placeholder="Username" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
                    <input id="passwordRegister" type="password" placeholder="Password" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
                    <button id="submitRegisterBtn" style="padding: 10px; cursor: pointer; width: 100%; background: orange; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
                        Register
                    </button>
                </div>
                <!-- Inicio de Sesión -->
                <div id="loginForm" style="display: none;">
                    <input id="usernameLogin" type="text" placeholder="Username" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
                    <input id="passwordLogin" type="password" placeholder="Password" style="margin-bottom: 10px; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 15px;"/><br/>
                    <button id="submitLoginBtn" style="padding: 10px; cursor: pointer; width: 100%; background: #2196f3; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
                        Log in
                    </button>
                </div>
            </div>
            <button id="closeBtn" style="padding: 10px; cursor: pointer; width: 100%; margin-top: 15px; background: #e53935; color: white; border: none; border-radius: 20px; transition: all 0.3s;">
                Close
            </button>
        `;

        // Agregar el contenedor al cuerpo del documento
        document.body.appendChild(formContainer);

        // Lógica de los botones para cambiar entre "Registro" e "Inicio de Sesión"
        document.getElementById('registerTab').addEventListener('click', () => {
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('loginForm').style.display = 'none';
        });
        document.getElementById('loginTab').addEventListener('click', () => {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
		

        // Eventos para enviar datos a la API
		document.getElementById('submitRegisterBtn').addEventListener('click', async () => {
		    const username = document.getElementById('usernameRegister').value;
		    const password = document.getElementById('passwordRegister').value;

		    if (!username || !password) {
		        alert('Please complete both fields.');
		        return;
		    }

		    try {
		        const response = await fetch('/api/usuario', {
		            method: 'POST',
		            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		            body: new URLSearchParams({ usuario: username, contrasena: password })
		        });

		        const result = await response.text();
		        if (result.includes('creado correctamente')) {
		            localStorage.setItem('currentUser', username); // Establece el usuario como actual
					console.log('Usuario activo:', localStorage.getItem('currentUser'));
		            alert(result);
		        } else {
		            alert(result); // Si hay un error (por ejemplo, usuario ya existe)
		        }
		    } catch (error) {
		        console.error(error);
		        alert('Error registering user.');
		    }
		});

		console.log('submitLoginBtn:', document.getElementById('submitLoginBtn'));
		
		document.getElementById('submitLoginBtn').addEventListener('click', async () => {
		    const username = document.getElementById('usernameLogin').value;
		    const password = document.getElementById('passwordLogin').value;

		    if (!username || !password) {
		        alert('Please complete both fields.');
		        return;
		    }

		    try {
		        const response = await fetch('/api/usuario', {
		            method: 'GET',
		            headers: { 'Content-Type': 'application/json' },
		        });

		        const users = await response.json();
		        if (users[username] === password) {
		            localStorage.setItem('currentUser', username); // Guarda el usuario actual
					console.log('Usuario activo:', localStorage.getItem('currentUser'));
		            alert('Login successful.');
					
					// Eliminar el formulario antes de cambiar de escena
		            const formContainer = document.getElementById('registro');
		            if (formContainer) {
		                document.body.removeChild(formContainer);
		            }
								
		            this.scene.start('MenuOnlineScene'); // Cambia a la escena principal
		        } else {
		            alert('Invalid username or password.');
		        }
		    } catch (error) {
		        console.error(error);
		        alert('Error logging in.');
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
