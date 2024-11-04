class PreloadScene extends Phaser.Scene {
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

        // Simulación de carga larga
        for (let i = 0; i < 10000; i++) {
            this.load.image(`dummy${i}`, '/images/homer.png'); // Usa una imagen pequeña y repítela
        }
    }
    
    
}
