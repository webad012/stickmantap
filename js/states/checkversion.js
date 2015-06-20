/* global StickmanTapGameVersion, StickmanTapDefaultConf */

var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.CheckVersion = function(){};
 
StickmanTapGame.CheckVersion.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        this.blinking = this.game.add.text(this.game.world.centerX, 
                                            100, 
                                            "", 
                                            { font: "20px Arial", fill: "#000"});
        this.blinking.anchor.setTo(0.5, 0.5);
        this.blinkingTimer = 0;
        
        this.gameVersion = StickmanTapDefaultConf.gameVersion;
        
        var text1 = this.game.add.text(this.game.world.width-10, 
                                this.game.world.height-10, 
                                this.gameVersion, 
                                { font: "20px Arial", fill: "#000"});
        text1.anchor.setTo(1, 1);
        
        this.checkVersion();
    },
    
    update: function()
    {
        this.blinkingTimer += this.game.time.elapsed; //this is in ms, not seconds.
        if ( this.blinkingTimer >= 1000 )
        {
            this.blinkingTimer -= 1000;
            this.blinking.visible = !this.blinking.visible;
        }
    },
    
    checkVersion: function()
    {
        this.blinking = "Checking version";
        
        var thisGame = this;
        
        stickmanAjax('GetCurrentVersion', function(response){
            thisGame.onSuccess(response);
        });
    },
    
    onSuccess: function (response)
    {
        if(typeof response.gameVersion !== 'undefined')
        {
            if(parseFloat(response.gameVersion) === this.gameVersion)
            {
                this.state.start('Preload');
            }
            else
            {
                if(typeof response.downloadUrl !== 'undefined')
                {
                    var text1 = this.game.add.text(this.game.world.centerX, 
                                            100, 
                                            "There is a new version of application", 
                                            { font: "20px Arial", fill: "#000"});
                    text1.anchor.setTo(0.5, 0.5);
                    
                    var text2 = this.game.add.text(this.game.world.centerX, 
                                            150, 
                                            "You can download it from:", 
                                            { font: "20px Arial", fill: "#000"});
                    text2.anchor.setTo(0.5, 0.5);
                    var text3 = this.game.add.text(this.game.world.centerX, 
                                            200, 
                                            'Download', 
                                            { font: "20px Arial", fill: "#00F"});
                    text3.anchor.setTo(0.5, 0.5);
                    text3.inputEnabled = true;
                    text3.events.onInputDown.add(function(){
                        window.open(response.downloadUrl, '_blank');
                    }, this);
                    
                    var text4 = this.game.add.text(this.game.world.centerX, 
                                            300, 
                                            "Or continue offline", 
                                            { font: "20px Arial", fill: "#000"});
                    text4.anchor.setTo(0.5, 0.5);
                    text4.inputEnabled = true;
                    text4.events.onInputDown.add(function(){
                        StickmanTapGameOffline = true;
                        this.state.start('Preload');
                    }, this);
                }
                else
                {
                    stickanAjaxFailure("Error getting download url");
                }
            }
        }
        else
        {
            stickanAjaxFailure(JSON.stringify(response));
        }
    }
};