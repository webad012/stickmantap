var StickmanTapGame = StickmanTapGame || {};
 
//loading the game assets
 
StickmanTapGame.Preload = function(){};
 
StickmanTapGame.Preload.prototype = {
 
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);
 
    //load game assets
    this.load.spritesheet('player', 'img/DudeFull.png', 127, 127, -1, 1, 1);
    this.load.spritesheet('monster', 'img/ghostSheet (copy).PNG', 172, 172, -1, 1, 1);
    this.load.spritesheet('tapmark', 'img/explosion01_sprite_sheet.png', 210, 120, -1, 5, 5);
//    this.game.load.image('background', 'img/background2.png');
    this.game.load.image('background', 'img/background3.png');
    this.game.load.image('logo', 'img/stickmanicon.png');
    this.game.load.image('profilebutton', 'img/profilebutton.png');
    this.game.load.image('frame', 'img/frame.png');
    this.game.load.image('upgradebutton', 'img/upgradebutton.png');
    this.game.load.image('settings', 'img/toolsbutton.png');
    this.game.load.image('statistics', 'img/bar_chart_50x50.png');
    this.game.load.image('penicon', 'img/pen_50x50.png');
  },
 
  create: function() {
    this.state.start('Splash');
  }
};