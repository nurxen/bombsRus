class PreloadScene extends Phaser.Scene {
    //commit
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        
        // Dimensiones de la barra de progreso
        const progressBarWidth = 400;
        const progressBarHeight = 25;
        const progressBarX = (this.cameras.main.width - progressBarWidth) / 2;
        const progressBarY = (this.cameras.main.height - progressBarHeight) / 2;

        // Fondo de la barra de progreso
        const progressBarBackground = this.add.graphics();
        progressBarBackground.fillStyle(0x222222, 0.8);
        progressBarBackground.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // Barra de progreso dinámica
        const progressBarFill = this.add.graphics();

        // Accedemos a los assets
        //Sonido
        this.load.audio('explosionSound', "./assets/SONIDOS/explosion.mp3");
        this.load.audio('backgroundMusic', "./assets/SONIDOS/loop.mp3");
        this.load.audio('menuBackgroundMusic', "./assets/SONIDOS/menuBackground.wav");
        
        // Animacion de Cuddles
        this.load.image("CuddlesIdleLeft", "./assets/tile.png");
        this.load.image("CuddlesMoveLeft", "./assets/tile.png");
        this.load.image("CuddlesIdleRight", "./assets/tile.png");
        this.load.image("CuddlesMoveRight", "./assets/tile.png");
        this.load.image("CuddlesIdleUp", "./assets/tile.png");
        this.load.image("CuddlesMoveUp", "./assets/tile.png");
        this.load.image("CuddlesIdleDown", "./assets/tile.png");
        this.load.image("CuddlesMoveDown", "./assets/tile.png");

        // Animacion de Puffy
        this.load.image("PuffyIdleLeft", "./assets/tile.png");
        this.load.image("PuffyMoveLeft", "./assets/tile.png");
        this.load.image("PuffyIdleRight", "./assets/tile.png");
        this.load.image("PuffyMoveRight", "./assets/tile.png");
        this.load.image("PuffyIdleUp", "./assets/tile.png");
        this.load.image("PuffyMoveUp", "./assets/tile.png");
        this.load.image("PuffyIdleDown", "./assets/tile.png");
        this.load.image("PuffyMoveDown", "./assets/tile.png");

        // Assets interactuables
        this.load.image("ColiderPresentExplosion", "./assets/ASSTES/ColiderExplosionRegalo.png");
        this.load.image("Colider64", "./assets/ASSTES/Colider.png");
        this.load.image("Present64", "./assets/ASSTES/Present.png");
        this.load.image("CoveyorBeltExtremo", "./assets/ASSTES/CoveyorBeltExtremo.png"); // cinta transpoirtadora
        this.load.image("CoveyorBeltMedio1", "./assets/ASSTES/CoveyorBeltMedio1.png");
        this.load.image("CoveyorBeltMedio2", "./assets/ASSTES/Present.png");

        // Assets de decoracion
        this.load.image("LegoDecoration", "./assets/DECORACION/LegoDecoration.png");
        this.load.image("BallDecoration", "./assets/DECORACION/BallDecoration.png");
        this.load.image("CarDecoration", "./assets/DECORACION/CarDecoracion.png");
        this.load.image("CubeDecoration", "./assets/DECORACION/CubeDecoration.png");
        this.load.image("Towerdecoration", "./assets/DECORACION/Towerdecoration.png");
        this.load.image("PinkDuckDecoration", "./assets/DECORACION/PinkDuckDecoration.png");
        this.load.image("YellowDuckDecoration", "./assets/DECORACION/YellowDuckDecoration.png");

        // Interfaces
        this.load.image("MainMenuBackground", "./assets/ESCENARIOS/MainMenuBackground.png");
        this.load.image("WinPlayerOneBackground", "./assets/ESCENARIOS/WinPlayerOneBackground.png");
        this.load.image("WinPlayerTwoBackground", "./assets/ESCENARIOS/WinPlayerTwoBackground.png");
        this.load.image("DrawBackground", "./assets/ESCENARIOS/DrawBackground.png");
        this.load.image("SettingsBackground", "./assets/ESCENARIOS/SettingsBackground.png");
        this.load.image("OptionsBackground", "./assets/ESCENARIOS/OptionsBackground.png");
        this.load.image("GameBackground", "./assets/ESCENARIOS/GameBackground.png");
		this.load.image("PauseBackground", "./assets/ESCENARIOS/MainMenuBackground.png");
		
		//Botones
        this.load.image("StartButton", "./assets/BOTONES/StartButton.png");
		this.load.image("PauseButton", "./assets/BOTONES/StartButton.png");
		this.load.image("ExitButton", "./assets/BOTONES/StartButton.png");
        this.load.image("HelpButton", "./assets/BOTONES/HelpButton.png");
        this.load.image("OptionsButton", "./assets/BOTONES/OptionsButton.png");
        this.load.image("RetryButton", "./assets/BOTONES/RetryButton.png");
        this.load.image("MainMenuButton", "./assets/BOTONES/MainMenuButton.png");
        this.load.image("Life", "./assets/ASSTES/heart.png");
        this.load.image("OptionsText", "./assets/BOTONES/OptionsText.png");
        this.load.image("MusicText", "./assets/BOTONES/MusicText.png");
        this.load.image("VFXText", "./assets/BOTONES/VFXText.png");

        //pruebas
        this.load.image("pato", "./assets/pato.png");


        // Texto del porcentaje de carga
        const loadingText = this.add.text(this.cameras.main.width / 2, progressBarY - 30, 'Cargando: 0%', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Actualización de la barra de progreso
        this.load.on('progress', (value) => {
            progressBarFill.clear();
            progressBarFill.fillStyle(0xffffff, 1);
            progressBarFill.fillRect(progressBarX, progressBarY, progressBarWidth * value, progressBarHeight);
            loadingText.setText(`Cargando: ${Math.floor(value * 100)}%`);
        });

        // Transición a `MenuScene` cuando la carga esté completa
        this.load.on('complete', () => {
            progressBarBackground.destroy();
            progressBarFill.destroy();
            loadingText.destroy();
            this.scene.start('RegisterScene');
        });

    }


}
