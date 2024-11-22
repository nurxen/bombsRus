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
        this.load.image("Present", "./assets/PRESENT1_5_21.png");
        this.load.image("CoveyorBeltExtremo", "./assets/regalos.png"); // cinta transpoirtadora
        this.load.image("CoveyorBeltMedio1", "./assets/regalos.png");
        this.load.image("CoveyorBeltMedio2", "./assets/regalos.png");
        
        // Assets de decoracion
        this.load.image("CubesDecoration", "./assets/regalos.png");
        this.load.image("LegoDecoration", "./assets/regalos.png");
        this.load.image("ButtonDecoration", "./assets/regalos.png");
        this.load.image("CarDecoration", "./assets/regalos.png");
        this.load.image("CubeDecoration", "./assets/regalos.png");
        this.load.image("Towerdecoration", "./assets/regalos.png");
        
        // Interfaces
        this.load.image("MainMenuBackground", "./assets/regalos.png");
        this.load.image("PauseBackground", "./assets/regalos.png");
        this.load.image("LoseBackground", "./assets/LoseBackground.png");
        this.load.image("WinBackground", "./assets/regalos.png");
        this.load.image("StartButton", "./assets/regalos.png");
        this.load.image("CreditsButton", "./assets/regalos.png");
        this.load.image("PauseButton", "./assets/regalos.png");
        this.load.image("PlayAgainButton", "./assets/regalos.png");
        this.load.image("ExitButton", "./assets/regalos.png");
        this.load.image("PauseButton", "./assets/regalos.png");

        // Cargar imágenes de explosión de regalo
        this.load.image("PresentExplosion1", "./assets/PRESENT1_5_21.png");
        this.load.image("PresentExplosion2", "./assets/PRESENT2_4_22.png");
        this.load.image("PresentExplosion3", "./assets/PRESENT3_23.png");
        this.load.image("PresentExplosion4", "./assets/PRESENT2_4_22.png");
        this.load.image("PresentExplosion5", "./assets/PRESENT1_5_21.png");
        this.load.image("PresentExplosion6", "./assets/PRESENT6_20.png");
        this.load.image("PresentExplosion7", "./assets/PRESENT7_19.png");
        this.load.image("PresentExplosion8", "./assets/PRESENT8_18.png");
        this.load.image("PresentExplosion9", "./assets/PRESENT9_17.png");
        this.load.image("PresentExplosion10", "./assets/PRESENT10_16.png");
        this.load.image("PresentExplosion11", "./assets/PRESENT11_15.png");
        this.load.image("PresentExplosion12", "./assets/PRESENT12_14.png");
        this.load.image("PresentExplosion13", "./assets/PRESENT13.png");
        this.load.image("PresentExplosion14", "./assets/PRESENT12_14.png");
        this.load.image("PresentExplosion15", "./assets/PRESENT11_15.png");
        this.load.image("PresentExplosion16", "./assets/PRESENT10_16.png");
        this.load.image("PresentExplosion17", "./assets/PRESENT9_17.png");
        this.load.image("PresentExplosion18", "./assets/PRESENT8_18.png");
        this.load.image("PresentExplosion19", "./assets/PRESENT7_19.png");
        this.load.image("PresentExplosion20", "./assets/PRESENT6_20.png");
        this.load.image("PresentExplosion21", "./assets/PRESENT1_5_21.png");
        this.load.image("PresentExplosion22", "./assets/PRESENT2_4_22.png");
        this.load.image("PresentExplosion23", "./assets/PRESENT3_23.png");
        this.load.image("PresentExplosion24", "./assets/PRESENT24.png");
        this.load.image("PresentExplosion25", "./assets/PRESENT25.png");
        this.load.image("PresentExplosion26", "./assets/PRESENT26.png");
        
        //pruebas
        this.load.image("pato", "./assets/pato.png");
        this.load.image("bk", "./assets/bk.png");
        this.load.image("RetryButton", "./assets/retryButton.png");
        this.load.image("RetryButtonGrande", "./assets/RetryButton2.png");
        
        //load json
        this.load.atlas('regalo', 'assets/spritesheet.png', 'assets/regalo.json');
        

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
