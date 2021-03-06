/* global Phaser */

var StickmanTapGameOffline = false;
var StickmanTapGameLastTimeOnlineBackup = (Date.now() * 0.001) | 0; // timestamp

var StickmanTapGame = StickmanTapGame || {};

//StickmanTapGame.game = new Phaser.Game(720, 1280, Phaser.AUTO, '');
StickmanTapGame.game = new Phaser.Game(360, 640, Phaser.AUTO, '');
//StickmanTapGame.game = new Phaser.Game(360, 640, Phaser.CANVAS, '');
//StickmanTapGame.game = new Phaser.Game(640, 360, Phaser.AUTO, '');

StickmanTapGame.game.state.add('Boot', StickmanTapGame.Boot);
StickmanTapGame.game.state.add('CheckVersion', StickmanTapGame.CheckVersion);
StickmanTapGame.game.state.add('Preload', StickmanTapGame.Preload);
StickmanTapGame.game.state.add('Splash', StickmanTapGame.Splash);
StickmanTapGame.game.state.add('Login', StickmanTapGame.Login);
StickmanTapGame.game.state.add('Register', StickmanTapGame.Register);
StickmanTapGame.game.state.add('Game', StickmanTapGame.Game);
 
StickmanTapGame.game.state.start('Boot');

// Wait for device API libraries to load
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", function(e){
        e.preventDefault();
        navigator.notification.confirm(
            'Are you sure you want to exit?',  // message
            function(buttonIndex){  // callback to invoke with index of button pressed
                if(buttonIndex == 1)
                {
                    navigator.app.exitApp();
                }
            },
            'Exit',                 // title
            ['YES','NO']            // buttonLabels
        );
    }, false);
}
