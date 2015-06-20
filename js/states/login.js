/* global StickmanTapGameOffline */

var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.Login = function(){};
 
StickmanTapGame.Login.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        var localThis = this;
        
        this.blinking = this.game.add.text(this.game.world.centerX, 
                                            100, 
                                            "", 
                                            { font: "20px Arial", fill: "#000"});
        this.blinking.anchor.setTo(0.5, 0.5);
        this.blinkingTimer = 0;
        
        if(StickmanTapGameOffline === true)
        {
            this.state.start('Game');
        }
        else
        {
            this.localstorage = new LocalStorage();
            
            var username = this.localstorage.getData('username');
            var password = this.localstorage.getData('password');
            if( (username === null || username.length === 0) || (password === null || password.length === 0) )
            {
                this.usernameLabel = StickmanTapGame.game.add.text(50, 
                                                        StickmanTapGame.game.world.centerY-150, 
                                                        'Username:', 
                                                        { font: '20px Arial', fill: '#000' });
                this.usernameLabel.anchor.setTo(0, 0.5);
                this.usernameField = StickmanTapGame.game.add.text(150, 
                                                                StickmanTapGame.game.world.centerY-150, 
                                                                '', 
                                                                { font: '20px Arial', fill: '#000' });
                this.usernameField.anchor.setTo(0, 0.5);
                this.usernamePen = this.game.add.sprite(150+this.usernameField.width, 
                                                        this.game.world.centerY-150, 
                                                        'penicon');
                this.usernamePen.anchor.setTo(0, 0.5);
                this.usernamePen.inputEnabled = true;
                this.usernamePen.events.onInputDown.add(function(){
                    var username = prompt("Please enter username");
                    while(username !== null && (username.length > 10 || username.length === 0)){
                        alert("Keep the name length to 10 chars or less");
                        username = prompt("Please enter username", username);
                    }
                    if (username !== null) {
                        this.usernameField.text = username;
                        this.usernamePen.position.x = 150+this.usernameField.width;
                    }
                }, this);

                this.passwordLabel = StickmanTapGame.game.add.text(50, 
                                                                StickmanTapGame.game.world.centerY-50, 
                                                                'Password:', 
                                                                { font: '20px Arial', fill: '#000' });
                this.passwordLabel.anchor.setTo(0, 0.5);
                this.passwordField = StickmanTapGame.game.add.text(150, 
                                                                StickmanTapGame.game.world.centerY-50, 
                                                                '', 
                                                                { font: '20px Arial', fill: '#000' });
                this.passwordField.anchor.setTo(0, 0.5);
                this.passwordPen = this.game.add.sprite(150+this.usernameField.width, 
                                                        this.game.world.centerY-50, 
                                                        'penicon');
                this.passwordPen.anchor.setTo(0, 0.5);
                this.passwordPen.inputEnabled = true;
                this.passwordPen.events.onInputDown.add(function(){
                    var password = prompt("Please enter password");
                    while(password !== null && (password.length > 20 || password.length === 0)){
                        alert("Keep the name length to 20 chars or less");
                        password = prompt("Please enter password", password);
                    }
                    if (password !== null) {
                        this.passwordField.text = password;
                        this.passwordPen.position.x = 150+this.passwordField.width;
                    }
                }, this);

                this.loginButton = StickmanTapGame.game.add.text(150, 
                                                                StickmanTapGame.game.world.centerY+50, 
                                                                'Login', 
                                                                { font: '20px Arial', fill: '#000' });
                this.loginButton.anchor.setTo(0, 0.5);

                this.loginButton.inputEnabled = true;
                this.loginButton.events.onInputDown.add(function(){
                    if(this.usernameField.text === ' '
                            || this.passwordField.text === ' ')
                    {
                        alert("Username and/or password not entered");
                    }
                    else
                    {
                        localThis.logIn(this.usernameField.text, this.passwordField.text);
                    }
                }, this);

                this.RegisterLabel = StickmanTapGame.game.add.text(100, StickmanTapGame.game.world.centerY+150, 
                                                                    'Register', 
                                                                    { font: '20px Arial', fill: '#000' });
                this.RegisterLabel.anchor.setTo(0, 0.5);
                this.RegisterLabel.inputEnabled = true;
                this.RegisterLabel.events.onInputDown.add(function(){
                    localThis.state.start('Register');
                }, this);

                this.ContinueOfflineLabel = StickmanTapGame.game.add.text(100, StickmanTapGame.game.world.centerY+200, 
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
                this.logIn(username, password);
            }
        }
        
    },
    
    update: function()
    {
        if(this.blinking.text !== ' ')
        {
            this.blinkingTimer += this.game.time.elapsed; //this is in ms, not seconds.
            if ( this.blinkingTimer >= 1000 )
            {
                this.blinkingTimer -= 1000;
                this.blinking.visible = !this.blinking.visible;
            }
        }
    },
    
    logIn: function(username, password)
    {
        var localThis = this;
        
        this.blinking.text = 'Loging in';
        this.blinking.visible = true;
        
        var parameters = "username="+username+"&password="+password;
        
        stickmanAjax('Login', 
        function(response){
            localThis.blinking.text = '';
            localThis.blinking.visible = false;
            if(response.message === 'success')
            {
                localThis.blinking.text = response.message;
                localThis.localstorage.setData('username', username);
                localThis.localstorage.setData('password', password);
                
                var lastAction = localThis.localstorage.getData('lastAction');
                
                if(response.user_data.last_action !== lastAction)
                {
                    var lastPlayingUsername = localThis.localstorage.getData('lastPlayingUsername');
                    if(lastPlayingUsername === username)
                    {
                        if(response.user_data.last_action < lastAction)
                        {
                            localThis.localstorage.onlineBackup();
                        }
                    }
                    else
                    {
                        if(typeof lastPlayingUsername !== 'undefined' 
                                && lastPlayingUsername.length !== null
                                && lastPlayingUsername.length > 0)
                        {
                            localThis.localstorage.setData('gameLevel', response.user_data.character_game_level);
                            localThis.localstorage.setData('playerCoins', response.user_data.character_coins);
                            localThis.localstorage.setData('playerLevel', response.user_data.character_level);
                            localThis.localstorage.setData('maxGameLevel', response.user_data.max_game_level);
                            localThis.localstorage.setData('playerName', response.user_data.character_name);
                        }
                        else
                        {
                            var dbDate = new Date(response.user_data.last_action * 1000);
                            var gameDate = new Date(lastAction * 1000);

                            var message = 'Login successfull.\n\
                                    \nThere is game data on this device:';
                            message += '\n - local time:\t'+gameDate.toGMTString();
                            message += '\n - server time:\t'+dbDate.toGMTString();
                            message += '\n\n Would you like to load server data?';
                            message += '\n (yes: server data; no: local data)';
                            if (window.confirm(message)) 
                            {
                                localThis.localstorage.setData('gameLevel', response.user_data.character_game_level);
                                localThis.localstorage.setData('playerCoins', response.user_data.character_coins);
                                localThis.localstorage.setData('playerLevel', response.user_data.character_level);
                                localThis.localstorage.setData('maxGameLevel', response.user_data.max_game_level);
                                localThis.localstorage.setData('playerName', response.user_data.character_name);
                            }
                            else
                            {
                                localThis.localstorage.onlineBackup();
                            }
                        }
                    }
                }
                else
                {
//                    console.log('same');
                }
                
                localThis.state.start('Game');
            }
            else
            {
                alert(response.message);
                localThis.localstorage.setData('username', '');
                localThis.localstorage.setData('password', '');
                localThis.state.start('Login');
            }
        },
        parameters,
        function(responseText){
//            console.log('login error');
            localThis.blinking.text = '';
            localThis.blinking.visible = false;
            alert(responseText);
        });
    }
};