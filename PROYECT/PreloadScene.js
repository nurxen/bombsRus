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
        this.load.image("Present64", "./assets/ASSTES/Present.png");
        this.load.image("CoveyorBeltExtremo", "./assets/ASSTES/CoveyorBeltExtremo.png"); // cinta transpoirtadora
        this.load.image("CoveyorBeltMedio1", "./assets/ASSTES/CoveyorBeltMedio1.png");
        this.load.image("CoveyorBeltMedio2", "./assets/ASSTES/regalos.png");

        // Assets de decoracion
        this.load.image("LegoDecoration", "./assets/DECORACION/LegoDecoration.png");
        this.load.image("BallDecoration", "./assets/DECORACION/BallDecoration.png");
        this.load.image("CarDecoration", "./assets/DECORACION/CarDecoracion.png");
        this.load.image("CubeDecoration", "./assets/DECORACION/CubeDecoration.png");
        this.load.image("Towerdecoration", "./assets/DECORACION/Towerdecoration.png");
        this.load.image("PinkDuckDecoration", "./assets/DECORACION/PinkDuckDecoration.png");
        this.load.image("YellowDuckDecoration", "./assets/DECORACION/YellowDuckDecoration.png");

        // Interfaces
        this.load.image("MainMenuBackground", "./assets/ESCENARIOS/LoseBackground.png");
        this.load.image("PauseBackground", "./assets/ESCENARIOS/regalos.png");
        this.load.image("WinPlayerOneBackground", "./assets/ESCENARIOS/LoseBackground.png");
        this.load.image("WinPlayerTwoBackground", "./assets/ESCENARIOS/regalos.png");
        this.load.image("GameBackground", "./assets/ESCENARIOS/GameBackground.png");
        this.load.image("StartButton", "./assets/BOTONES/MainMenuButton.png");
        this.load.image("CreditsButton", "./assets/BOTONES/regalos.png");
        this.load.image("PauseButton", "./assets/BOTONES/regalos.png");
        this.load.image("RetryButton", "./assets/BOTONES/RetryButton.png");
        this.load.image("MainMenuButton", "./assets/BOTONES/MainMenuButton.png");
        this.load.image("PauseButton", "./assets/BOTONES/regalos.png");
        this.load.image("SettingsButton", "./assets/BOTONES/SettingsButton.png");

        // Cargar imágenes de explosión de regalo
        this.load.image("Present64", "./assets/present64.png");
        this.load.image("PresentExplosion1", "./assets/EXPLOSION_REGALO_1/PRESENT1_5_21.png");
        this.load.image("PresentExplosion2", "./assets/EXPLOSION_REGALO_1/PRESENT2_4_22.png");
        this.load.image("PresentExplosion3", "./assets/EXPLOSION_REGALO_1/PRESENT3_23.png");
        this.load.image("PresentExplosion4", "./assets/EXPLOSION_REGALO_1/PRESENT2_4_22.png");
        this.load.image("PresentExplosion5", "./assets/EXPLOSION_REGALO_1/PRESENT1_5_21.png");
        this.load.image("PresentExplosion6", "./assets/EXPLOSION_REGALO_1/PRESENT6_20.png");
        this.load.image("PresentExplosion7", "./assets/EXPLOSION_REGALO_1/PRESENT7_19.png");
        this.load.image("PresentExplosion8", "./assets/EXPLOSION_REGALO_1/PRESENT8_18.png");
        this.load.image("PresentExplosion9", "./assets/EXPLOSION_REGALO_1/PRESENT9_17.png");
        this.load.image("PresentExplosion10", "./assets/EXPLOSION_REGALO_1/PRESENT10_16.png");
        this.load.image("PresentExplosion11", "./assets/EXPLOSION_REGALO_1/PRESENT11_15.png");
        this.load.image("PresentExplosion12", "./assets/EXPLOSION_REGALO_1/PRESENT12_14.png");
        this.load.image("PresentExplosion13", "./assets/EXPLOSION_REGALO_1/PRESENT13.png");
        this.load.image("PresentExplosion14", "./assets/EXPLOSION_REGALO_1/PRESENT12_14.png");
        this.load.image("PresentExplosion15", "./assets/EXPLOSION_REGALO_1/PRESENT11_15.png");
        this.load.image("PresentExplosion16", "./assets/EXPLOSION_REGALO_1/PRESENT10_16.png");
        this.load.image("PresentExplosion17", "./assets/EXPLOSION_REGALO_1/PRESENT9_17.png");
        this.load.image("PresentExplosion18", "./assets/EXPLOSION_REGALO_1/PRESENT8_18.png");
        this.load.image("PresentExplosion19", "./assets/EXPLOSION_REGALO_1/PRESENT7_19.png");
        this.load.image("PresentExplosion20", "./assets/EXPLOSION_REGALO_1/PRESENT6_20.png");
        this.load.image("PresentExplosion21", "./assets/EXPLOSION_REGALO_1/PRESENT1_5_21.png");
        this.load.image("PresentExplosion22", "./assets/EXPLOSION_REGALO_1/PRESENT2_4_22.png");
        this.load.image("PresentExplosion23", "./assets/EXPLOSION_REGALO_1/PRESENT3_23.png");
        this.load.image("PresentExplosion24", "./assets/EXPLOSION_REGALO_1/PRESENT24.png");
        this.load.image("PresentExplosion25", "./assets/EXPLOSION_REGALO_1/PRESENT25.png");
        this.load.image("PresentExplosion26", "./assets/EXPLOSION_REGALO_1/PRESENT26.png");

        //pruebas
        this.load.image("pato", "./assets/pato.png");
        this.load.image("bk", "./assets/backgroundDef.png");
        // this.load.image("RetryButton", "./assets/BOTONES/retryButton.png");
        // this.load.image("RetryButtonGrande", "./assets/BOTONES/RetryButton2.png");

        //load json
        this.load.atlas('regalo', './assets/ASSTES/spritesheet.png', './assets/ASSTES/regalo.json');


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
            this.scene.start('MenuScene');
        });

    }


}
