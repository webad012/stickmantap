var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.Register = function(){};
 
StickmanTapGame.Register.prototype = {
 
    preload: function() {
    },
 
    create: function() {        
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
        
        this.registerButton = StickmanTapGame.game.add.text(150, 
                                                        StickmanTapGame.game.world.centerY+100, 
                                                        'Register', 
                                                        { font: '20px Arial', fill: '#000' });
        this.registerButton.anchor.setTo(0, 0.5);
        
        this.registerButton.inputEnabled = true;
        this.registerButton.events.onInputDown.add(function(){
            if(this.usernameField.text === ' '
                    || this.passwordField.text === ' ')
            {
                alert("Username and/or password not entered");
            }
            else
            {
                var username = this.usernameField.text;
                var password = this.passwordField.text;
                
                stickmanAjax('Register', function(response){
                    alert(response.message);
                    if(response.message === 'success')
                    {
                        var localstorage = new LocalStorage();
                        localstorage.setData('username', username);
                        localstorage.setData('password', password);
                        
                        StickmanTapGame.game.state.start('Login');
                    }
                },
                "username="+username+"&password="+password
                        +"&lastaction="+Math.floor(Date.now() / 1000));
            }
        }, this);
        
        this.backButton = StickmanTapGame.game.add.text(150, 
                                                        StickmanTapGame.game.world.centerY+150, 
                                                        'Back', 
                                                        { font: '20px Arial', fill: '#000' });
        this.backButton.anchor.setTo(0, 0.5);
        
        this.backButton.inputEnabled = true;
        this.backButton.events.onInputDown.add(function(){
            StickmanTapGame.game.state.start('Login');
        }, this);
        
    }
};