/* global StickmanTapGameOffline */

var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.Login = function(){};
 
StickmanTapGame.Login.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        var localThis = this;
        
        this.localstorage = new LocalStorage();
        
        if(StickmanTapGameOffline === true)
        {
            this.state.start('Game');
        }
        else
        {
            var username = this.localstorage.getData('username');
            var password = this.localstorage.getData('password');
            if(!username || !password)
            {
                this.logInLabel = StickmanTapGame.game.add.text(100, 
                                                                StickmanTapGame.game.world.centerY-100, 
                                                                'Login', 
                                                                { font: '20px Arial', fill: '#000' });
                this.logInLabel.anchor.setTo(0, 0.5);
                this.logInLabel.inputEnabled = true;
                this.logInLabel.events.onInputDown.add(function(){
                    
                }, this);

                this.RegisterLabel = StickmanTapGame.game.add.text(100, StickmanTapGame.game.world.centerY-50, 
                                                                    'Register', 
                                                                    { font: '20px Arial', fill: '#000' });
                this.RegisterLabel.anchor.setTo(0, 0.5);
                this.RegisterLabel.inputEnabled = true;
                this.RegisterLabel.events.onInputDown.add(function(){
                    localThis.state.start('Register');
                }, this);

                this.ContinueOfflineLabel = StickmanTapGame.game.add.text(100, StickmanTapGame.game.world.centerY+50, 
                                                                    'Continue offline', 
                                                                    { font: '20px Arial', fill: '#000' });
                this.ContinueOfflineLabel.anchor.setTo(0, 0.5);
                this.ContinueOfflineLabel.inputEnabled = true;
                this.ContinueOfflineLabel.events.onInputDown.add(function(){
                    StickmanTapGameOffline = true;
                    this.state.start('Game');
                }, this);
            }
            else
            {
//                this.logIn("Login");
//                this.logOutLabel = StickmanTapGame.game.add.text(100, 
//                                                                StickmanTapGame.game.world.centerY-100, 
//                                                                'Logout', 
//                                                                { font: '20px Arial', fill: '#000' });
//                this.logOutLabel.anchor.setTo(0, 0.5);
            }
        }
        
    },
    
    update: function()
    {
        
    },
    
    logInLogoutRegister: function(action)
    {
        if(action !== "Login"
                || action !== "Logout"
                || action !== "Register")
        {
            alert("Wrong action");
            navigator.app.exitApp();
        }
        
        var api_url = this.localstorage.getData('apiUrl');
        var username = this.localstorage.getData('username');
        var password = this.localstorage.getData('password');
        
        var thisGame = this;

        $.ajax({
            url: api_url+"?action="+action+"&username="+username+"&password="+password,
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(response){
                if(typeof response.status !== 'undefined' && response.status === 'success')
                {
                    StickmanTapGameLoggedIn = true;
                    this.state.start('Game');
                }
            },
            error: function(xhr){
                thisGame.onFailure("1: "+xhr.responseText);
            }
        });
    },
    
    onFailure: function(reason)
    {
        if (window.confirm("There was problem with connection:\n"+reason+"\nDo you want to continue offline?")) 
        {
            StickmanTapGameOffline = true;
            this.state.start('Game');
        }
        else
        {
            navigator.app.exitApp();
        }
    }
};