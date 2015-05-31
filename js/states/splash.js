var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.Splash = function(){};
 
StickmanTapGame.Splash.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        this.blinking = this.game.add.text(this.game.world.centerX, 
                                            100, 
                                            "Tap to continue", 
                                            { font: "20px Arial", fill: "#000"});
        this.blinking.anchor.setTo(0.5, 0.5);
        this.blinkingTimer = 0;
        
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
        
        this.mj = this.game.add.text(this.game.world.centerX, 
                                                2*this.game.world.centerY-100, 
                                                "Milos Jankovic", 
                                                { font: "20px Arial", fill: "#000"});
        this.mj.anchor.setTo(0.5, 0.5);
        this.ww = this.game.add.text(this.game.world.centerX, 
                                                2*this.game.world.centerY-50, 
                                                "www.milosjankovic.com", 
                                                { font: "20px Arial", fill: "#000"});
        this.ww.anchor.setTo(0.5, 0.5);
        
        this.game.input.onDown.add(function(){this.state.start('Game');}, this);
    },
    
    update: function()
    {
        this.blinkingTimer += this.game.time.elapsed; //this is in ms, not seconds.
        if ( this.blinkingTimer >= 1000 )
        {
            this.blinkingTimer -= 1000;
            this.blinking.visible = !this.blinking.visible;
        }
    }
};