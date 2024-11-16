class GameScene extends Phaser.Scene{
    constructor() {
        super({key: 'GameScene'});
    }
    playersInput =
        {
            wasdKeys: 0,
            arrowKeys: 0,
        }
    player1;
    position = new Phaser.Math.Vector2(64, 256);
    
    preload(){console.log("carga GameScene")}
    create(){

        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.bombKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();
        //this.playersInput.bombKey2 = this.input.keyboard.addKey("P");
        
        this.bk=this.add.image(0,0, "tile");
        this.p1=this.add.image(0,0, "pato");
        this.initPlayer1();
        
        //this.bk.setOrigin(0,0);
        //this.p1.setOrigin(0,0);
    }

    update(time, delta)
    {
        this.processInput();
        this.player1.update(time, delta);
    }
    
    processInput()
    {
        //player 1
        //añadir if ele para no ir en diagonal
        if(this.playersInput.wasdKeys.A.isDown) {
            this.player1.xInput = -1;
        }
        else if(this.playersInput.wasdKeys.D.isDown) {
            this.player1.xInput = 1;
        }
        else if(this.playersInput.wasdKeys.W.isDown) {
            this.player1.yInput = -1;
        }
        else if(this.playersInput.wasdKeys.S.isDown)
        {
            this.player1.yInput = 1;
        }
        if(this.playersInput.bombKey1.isDown) {
            this.player1.bombKey1 = 1;
        }
        

    }

    initPlayer1() {
        this.player1 = new Player(this, 1, this.position, 1);
    }
}
