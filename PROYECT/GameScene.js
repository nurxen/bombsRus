class GameScene extends Phaser.Scene{
    constructor() {
        super({key: 'GameScene'});
    }
    preload(){console.log("carga GameScene")}
    create(){
        
        this.bk=this.add.image(0,0, "tile");
        this.bk.setOrigin(0,0);
    }
}
