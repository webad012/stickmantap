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
        
        this.checkVersion(api_url);
        
//        this.state.start('Preload');
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
//                console.log('success');
//                console.log(response);
                thisGame.onSuccess(response);
//                
            },
            error: function(xhr){
//                console.log('failure');
//                console.log(xhr.responseText);
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
                var text1 = this.game.add.text(this.game.world.centerX, 
                                        100, 
                                        "There is a new version of application", 
                                        { font: "20px Arial", fill: "#000"});
                text1.anchor.setTo(0.5, 0.5);

                if(typeof response.download_url !== 'undefined')
                {
                    var text2 = this.game.add.text(this.game.world.centerX, 
                                            150, 
                                            "You can download it from:", 
                                            { font: "20px Arial", fill: "#000"});
                    text2.anchor.setTo(0.5, 0.5);
                    var text3 = this.game.add.text(this.game.world.centerX, 
                                            200, 
                                            response.download_url, 
                                            { font: "20px Arial", fill: "#000"});
                    text3.anchor.setTo(0.5, 0.5);
                }
                else
                {
                    var text2 = this.game.add.text(this.game.world.centerX, 
                                            150, 
                                            "There was error getting download url", 
                                            { font: "20px Arial", fill: "#000"});
                    text2.anchor.setTo(0.5, 0.5);
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
            StickmanTapGame.state.start('Preload');
        }
    }
};