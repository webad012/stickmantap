/* global StickmanTapGameVersion, StickmanTapDefaultConf */

var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.CheckVersion = function(){};
 
StickmanTapGame.CheckVersion.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        var localstorage = new LocalStorage();
        var api_url = localstorage.getData('apiUrl');
        if(!api_url)
        {
            api_url = StickmanTapDefaultConf.apiUrl;
            localstorage.setData('apiUrl', api_url);
        }
        
        this.gameVersion = StickmanTapDefaultConf.gameVersion;
        
        var text1 = this.game.add.text(this.game.world.width-10, 
                                this.game.world.height-10, 
                                this.gameVersion, 
                                { font: "20px Arial", fill: "#000"});
        text1.anchor.setTo(1, 1);
        
        this.checkVersion(api_url);
    },
    
    update: function()
    {
    },
    
    checkVersion: function(api_url)
    {
        var thisGame = this;
                
        $.ajax({
            url: api_url+"?action=GetCurrentVersion",
//            data: {
//                action: 'GetCurrentVersion',
//                version: StickmanTapGameVersion
//            },
//            get_data: {
//                action: 'GetCurrentVersion',
//                version: StickmanTapGameVersion
//            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(response){
                thisGame.onSuccess(response);
//                
            },
            error: function(xhr){
                thisGame.onFailure("1: "+xhr.responseText);
            }
        });
    },
    
    onSuccess: function (response)
    {
        if(typeof response.gameVersion !== 'undefined')
        {
            if(response.gameVersion === this.gameVersion)
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
                                            response.downloadUrl, 
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
                    this.onFailure("Error getting download url");
                }
            }
        }
        else
        {
            this.onFailure(JSON.stringify(response));
        }
    },
    
    onFailure: function(reason)
    {
        if (window.confirm("There was problem with connection:\n"+reason+"\nDo you want to continue offline?")) 
        {
            StickmanTapGameOffline = true;
            this.state.start('Preload');
        }
        else
        {
            navigator.app.exitApp();
        }
    }
};