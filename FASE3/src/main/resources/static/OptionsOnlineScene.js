class OptionsOnlineScene extends Phaser.Scene {
    // Variables públicas
    settingsBackground; // Fondo de la escena
    exitButton; // Botón de salida
    musicSlider; // Slider para música
    effectsSlider; // Slider para efectos de sonido
    musicText; // Texto del slider de música
    effectsText; // Texto del slider de efectos de sonido
	
	//cambiar volumen dpendiendo de cuenta
	musicVolume =  0.5; // Volumen inicial de la música (0.0 a 1.0)
	effectsVolume = 0.5; // Volumen inicial de los efectos de sonido (0.0 a 1.0)
	


    constructor() {
        super({ key: 'OptionsOnlineScene' });
    }

    create() {
        this._createBackground(); // Crear fondo
        this._createSettingsText(); // Crear texto de ajustes
        this._createSliders(); // Crear sliders de volumen
        this._createExitButton(); // Crear botón de salida
        this._addButtonAnimations(); // Agregar animaciones a los botones
    }

    // Métodos privados

    // Crear el fondo de la escena
    _createBackground() {
        this.settingsBackground = this.add.image(0, 0, 'OptionsBackground')
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }

    // Crear el texto principal de ajustes
    _createSettingsText() {
        this.optionsText = this.add.image(600, 300, 'OptionsText')
            .setScale(1)

        this.musicText = this.add.image(600, 320, 'MusicText')
            .setScale(1)

        this.VFXText = this.add.image(600, 350, 'VFXText')
            .setScale(1)
    }

    // Crear los sliders para la música y los efectos de sonido
    _createSliders() {
        // Slider para la música
        this.musicSlider = this._createSlider(750, 310, globalSettings.musicVolume, (value) => {
            globalSettings.musicVolume = value;
            this._updateMusicVolume();
        });

        // Slider para los efectos de sonido
        this.effectsSlider = this._createSlider(750, 430, globalSettings.effectsVolume, (value) => {
            globalSettings.effectsVolume = value;
            this._updateEffectsVolume();
        });
    }

    // Crear un slider genérico
    _createSlider(x, y, initialValue, onChangeCallback) {
        const sliderWidth = 500;

        // Fondo del slider
        const sliderTrack = this.add.rectangle(x, y, sliderWidth, 10, 0x555555).setOrigin(0.5, 0.5);

        // Marcador del slider
        const sliderHandle = this.add.rectangle(x - sliderWidth / 2 + sliderWidth * initialValue, y, 20, 20, 0xffffff).setOrigin(0.5, 0.5).setInteractive();

        // Hacer que el sliderHandle sea arrastrable
        this.input.setDraggable(sliderHandle);

        // Lógica para arrastrar el slider
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === sliderHandle) {
                // Restringir el movimiento dentro de los límites del slider
                const clampedX = Phaser.Math.Clamp(dragX, x - sliderWidth / 2, x + sliderWidth / 2);
                gameObject.x = clampedX;

                // Calcular el valor del slider (0.0 a 1.0)
                const sliderValue = (clampedX - (x - sliderWidth / 2)) / sliderWidth;
                onChangeCallback(sliderValue); // Llamar al callback
            }
        });

        return sliderHandle;
    }

    // Actualizar el volumen de la música
    _updateMusicVolume() {
        // Aquí puedes actualizar el volumen de la música del menu
        if (this.sound.get('menuBackgroundMusic')) {
            this.sound.get('menuBackgroundMusic').setVolume(globalSettings.musicVolume);
        }
        
        // Aquí puedes actualizar el volumen de la música en tu juego
        if (this.sound.get('backgroundMusic')) {
            this.sound.get('backgroundMusic').setVolume(globalSettings.musicVolume);
        }
    }

    // Actualizar el volumen de los efectos de sonido
    _updateEffectsVolume() {
        if (this.sound.get('explosionSound')) {
            this.sound.get('explosionSound').setVolume(globalSettings.musicVolume);
        }
    }

    // Crear el botón de salida
    _createExitButton() {
        this.exitButton = this.add.image(1125, 650, 'MainMenuButton')
            .setScale(0.15)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => this._menuScene());
    }

    _menuScene() {
        this.scene.start('MenuOnlineScene'); // Cambiar a la escena del menú
    }

    _addButtonAnimations() {
        this.exitButton.on('pointerover', () => this.exitButton.setScale(0.2));
        this.exitButton.on('pointerout', () => this.exitButton.setScale(0.15));
    }
}

