/* global Phaser, InfiniteFormulas, StickmanTapGameOffline */

var StickmanTapGame = StickmanTapGame || {};
 
//loading the game assets
 
StickmanTapGame.Game = function(){};
 
StickmanTapGame.Game.prototype = {
    preload: function()
    {
        this.game.time.advancedTiming = true;
    },
    
    render: function()
    {
        this.game.debug.text('FPS:'+this.game.time.fps || '--', 2, 14, "#000000");   
    },
    
    create: function() 
    {
        this.backgrounds = [
            'background1',
            'background2',
            'background3'
        ];
        this.monster_spritesheets = [
            {
                name: 'Cudoviste',
                spritesheet: 'monster',
                scale: 1,
                starting_index: 4,
                stainding_animation: [4, 8, 8, 4],
                take_damage_animation: [4, 5, 6, 7, 6, 5, 4],
                attacking_animation: [4, 9, 10, 11, 10, 9, 4]
            }
        ];
        
        this.backgroundGroup = this.game.add.group();
        this.backgroundGroup.z = 0;
        this.topStatsGroup = this.game.add.group();
        this.topStatsGroup.z = 1;
        this.monsterGroup = this.game.add.group();
        this.monsterGroup.z = 2;
        this.playerGroup = this.game.add.group();
        this.playerGroup.z = 3;
        this.bottomButtonsGroup = this.game.add.group();
        this.bottomButtonsGroup.z = 4;
        this.popupGroup = this.game.add.group();
        this.popupGroup.z = 5;
        this.characterMenuGroup = this.game.add.group();
        this.characterMenuGroup.z = 6;
        
        this.loadDataFromLocalStorage();
        
        this.frameShown = false;
        this.inAnimation = false;
        this.wasRevertedInLevel = false;
        this.damagesInLastSecond = [];
        this.dpsCheckTimer = 0;
        this.backupToServerTimer = 0;
        this.monsterAttackTimer = 0;
        this.monsterCanAttack = false;
        this.playerAttackTimer = 0;
        this.playerCanAttack = false;
        this.currentDPS = 0;
        
        this.currentBackgroundSpriteIndex = -1;
        this.currentMonsterSpriteIndex = -1;
        
        this.damage_text_position = {coord_x: this.game.world.centerX-100, coord_y: this.game.world.centerY};
        this.damage_text_style = { font: "20px Arial", fill: "#000"};
                
        this.player = new Player(this.playerName, this.playerLevel, this.playerCoins, this.game.world.centerX-50, this.game.world.centerY+35, 0);
        this.playerGroup.add(this.player.sprite);
                
        this.monster_health = this.game.add.text(2*this.game.world.centerX-5, 50, "", this.damage_text_style, this.topStatsGroup);
        this.monster_health.anchor.setTo(1, 0.5);
        this.next_enemy_text = this.game.add.text(2*this.game.world.centerX-5, 80, "", this.damage_text_style, this.topStatsGroup);
        this.next_enemy_text.anchor.setTo(1, 0.5);
        this.next_enemy_text.inputEnabled = false;
        this.next_enemy_text.events.onInputDown.add(this.onNextEnemyClick, this);
        this.player_stats = this.game.add.text(5, 50, "", this.damage_text_style, this.topStatsGroup);
        this.player_stats.anchor.setTo(0, 0.5);
        this.player_health = this.game.add.text(5, 80, "", this.damage_text_style, this.topStatsGroup);
        this.player_health.anchor.setTo(0, 0.5);
        this.player_coins = this.game.add.text(5, 110, "", this.damage_text_style, this.topStatsGroup);
        this.player_coins.anchor.setTo(0, 0.5);
        this.player_dps = this.game.add.text(5, 140, "", this.damage_text_style, this.topStatsGroup);
        this.player_dps.anchor.setTo(0, 0.5);
        this.level_text = this.game.add.text(this.game.world.centerX,20, "", this.damage_text_style, this.topStatsGroup);
        this.level_text.anchor.setTo(0.5, 0.5);
                        
        this.profileButton = this.game.add.sprite(50, this.game.world.centerY+200, 'profilebutton', this.bottomButtonsGroup);
        this.profileButton.anchor.setTo(0.5, 0.5);
        this.profileButton.inputEnabled = true;
        this.profileButton.events.onInputDown.add(this.onProfileButtonClick, this);
        this.statisticsButton = this.game.add.sprite(135, this.game.world.centerY+200, 'statistics', this.bottomButtonsGroup);
        this.statisticsButton.anchor.setTo(0.5, 0.5);
        this.statisticsButton.inputEnabled = true;
        this.statisticsButton.events.onInputDown.add(this.onStatisticsButtonClick, this);
        this.leadedrboardsButton = this.game.add.sprite(210, this.game.world.centerY+200, 'trophyicon', this.bottomButtonsGroup);
        this.leadedrboardsButton.anchor.setTo(0.5, 0.5);
        this.leadedrboardsButton.inputEnabled = true;
        this.leadedrboardsButton.events.onInputDown.add(this.onLeadedrboardsButtonClick, this);
        this.settingsButton = this.game.add.sprite(300, this.game.world.centerY+200, 'settings', this.bottomButtonsGroup);
        this.settingsButton.anchor.setTo(0.5, 0.5);
        this.settingsButton.inputEnabled = true;
        this.settingsButton.events.onInputDown.add(this.onSettingsButtonClick, this);
        
//        this.tapmark = StickmanTapGame.game.add.sprite(0, 0, 'tapmark');
//        this.tapmark.anchor.setTo(0.5, 0.5);
//        this.tapmark.animations.add('tapanimation', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 40);
//        this.popupGroup.add(this.tapmark);
//        this.tapmark.visible = false;
                        
        this.loadLevel(this.gameLevel);
        
        if(this.lastAction)
        {
            this.calculateOffGameCoins(this.lastAction, this.playerLevel, this.gameLevel);
        }
    },
    
    update: function()
    {
        if ( this.dpsCheckTimer < this.game.time.time ) // 0.5s
        {
            var dps_sum = 0;
            
            var current_time = Date.now();
            var newDamagesInLastSecond = [];
            this.damagesInLastSecond.forEach(function(element){
                if(element['time'] > current_time-1000)
                {
                    newDamagesInLastSecond.push(element);
                    dps_sum += element['damage'];
                }
            });

            this.damagesInLastSecond = newDamagesInLastSecond;
            this.currentDPS = dps_sum;
            
            this.refreshTexts();
            
            this.dpsCheckTimer = this.game.time.time + 500; // 0.5s
        }
        
        if(StickmanTapGameOffline === false)
        {
            if ( this.backupToServerTimer < this.game.time.time ) // 1min
            {
//                console.log(Date.now()+' - backup atempt');
                
                LocalStorage.onlineBackup();
                
                this.backupToServerTimer = this.game.time.time + (1000 * 60); // 1min
            }
        }
        
        if(this.playerCanAttack === true)
        {
            if ( this.playerAttackTimer < this.game.time.time ) // 1s
            {
                this.playerAttack();
                
                this.playerAttackTimer = this.game.time.time + 1000; // 1s
            }
        }
        
        if(this.monsterCanAttack === true)
        {
            if ( this.monsterAttackTimer < this.game.time.time ) // 1s
            {
                this.monsterAttack();
                
                this.monsterAttackTimer = this.game.time.time + 1000; // 1s
            }
        }
    },
    
    loadDataFromLocalStorage: function()
    {
        this.lastAction = LocalStorage.getData('lastAction');
        
        var game_level = LocalStorage.getData('gameLevel');
        if(!game_level)
        {
            game_level = 1;
            LocalStorage.setData('gameLevel', game_level);
        }
        var player_coins = LocalStorage.getData('playerCoins');
        if(!player_coins)
        {
            player_coins = 0;
            LocalStorage.setData('playerCoins', player_coins);
        }
        var player_level = LocalStorage.getData('playerLevel');
        if(!player_level)
        {
            player_level = 1;
            LocalStorage.setData('playerLevel', player_level);
        }
        var max_game_level = LocalStorage.getData('maxGameLevel');
        if(!max_game_level)
        {
            max_game_level = 1;
            LocalStorage.setData('maxGameLevel', max_game_level);
        }
        var player_name = LocalStorage.getData('playerName');
        if(!player_name)
        {
            player_name = "Player";
            LocalStorage.setData('playerName', player_name);
        }
        
        this.gameLevel = parseInt(game_level);
        this.playerCoins = parseInt(player_coins);
        this.playerLevel = parseInt(player_level);
        this.maxGameLevel = parseInt(max_game_level);
        this.playerName = player_name;
        
        
        if(StickmanTapGameOffline === true)
        {
            LocalStorage.setData('lastPlayingUsername', '');
        }
    },
    
    onNextEnemyClick: function()
    {
        this.wasRevertedInLevel = false;
        var new_level = this.gameLevel+1;
        this.animateLoadLevel(new_level);
    },
    
    onProfileButtonClick: function()
    {
        this.frame = new ProfileFrame(this.player);
        this.frameShown = true;
    },
    
    onSettingsButtonClick: function()
    {
        this.frame = new SettingsFrame(this.player);
        this.frameShown = true;
    },
    
    onStatisticsButtonClick: function()
    {
        this.frame = new StatisticsFrame(this.maxGameLevel);
        this.frameShown = true;
    },
    
    onLeadedrboardsButtonClick: function()
    {
        this.frame = new LeaderboardsFrame();
        this.frameShown = true;
    },
    
    onBackgroundClick: function(event)
    {
        if(this.frameShown === true)
        {
            this.frame.close();
            this.frameShown = false;
        }
        else
        {
            this.animateInputDown(event);

            this.playerAttack();
        }
    },
    
    playerAttack: function()
    {
        if(this.inAnimation === false)
        {
            this.player.attack();
            var playerDamage = this.player.getDamage();
            this.monster.takeDamage(playerDamage);
            
            this.damagesInLastSecond.push({
                damage: playerDamage,
                time: Date.now()
            });

            this.animatePopuptext(this.monster.sprite.x, 
                                this.monster.sprite.x, 
                                this.monster.sprite.y-100, 
                                this.monster.sprite.y-200,
                                playerDamage,
                                { font: "20px Arial", fill: "#000"});

//            this.refreshTexts();

            if(this.monster.health <= 0)
            {
                this.monsterCanAttack = false;
                this.playerCanAttack = false;
                this.monsterDied();
            }
        }
    },
    
    refreshTexts: function()
    {
        if(this.player_stats)
        {
            this.player_stats.text = this.player.name;
        }
        if(this.monster_health)
        {
            this.monster_health.text = this.monster.name+": "
                    +InfiniteFormulas.humanReadableSize(this.monster.health)+" HP";
        }
        if(this.player_health)
        {
            this.player_health.text = "Health: "
                    +InfiniteFormulas.humanReadableSize(this.player.health)+" HP";
        }
        if(this.player_coins)
        {
            this.player_coins.text = "Coins: "+InfiniteFormulas.humanReadableSize(this.player.coins);
        }
        if(this.level_text)
        {
            this.level_text.text = "Game Level: "+InfiniteFormulas.humanReadableSize(this.gameLevel);
        }
        if(this.next_enemy_text && this.wasRevertedInLevel)
        {
            this.next_enemy_text.text = "Next Enemy";
        }
        else
        {
            this.next_enemy_text.text = "";
        }
        if(this.player_dps)
        {
            var dps_sum = 0;
            this.damagesInLastSecond.forEach(function(element){
                dps_sum += element['damage'];
            });
            
//            this.player_dps.text = 'DPS: '+InfiniteFormulas.humanReadableSize(dps_sum);
            this.player_dps.text = 'DPS: '+InfiniteFormulas.humanReadableSize(this.currentDPS);
        }
    },
    
    loadLevel: function(gameLevel)
    {
        this.monsterCanAttack = false;
        this.playerCanAttack = false;
        this.inAnimation = false;
        this.gameLevel = gameLevel;
        
        if(typeof this.monster !== 'undefined')
        {
            this.monster.destroy();
        }        
                        
        if(typeof this.background !== 'undefined')
        {
            this.background.destroy();
        }
        
        this.player.health = this.player.getMaxHealth();
        
        var background_index = this.nextLevelBackgroundIndex();
        var monster_spritesheet_index = ((Math.random() * this.monster_spritesheets.length)) | 0;
        
        this.background = this.game.add.sprite(0,0, this.backgrounds[background_index]);
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.onBackgroundClick, this);
        this.backgroundGroup.add(this.background);
        
        this.monster = new Monster(this.gameLevel, this.monster_spritesheets[monster_spritesheet_index]);
        this.monsterGroup.add(this.monster.sprite);
        if(gameLevel%5 === 0)
        {
            this.monsterCanAttack = true;
        }
        
        this.playerCanAttack = true;
        
        if(this.wasRevertedInLevel)
        {
            this.next_enemy_text.inputEnabled = true;
        }
    },
    
    monsterAttack: function()
    {
        if(this.inAnimation === false)
        {
            this.monster.animateAttack();
            var monsterDamage = this.monster.getDamage();
            this.player.takeDamage(monsterDamage);
            this.animatePopuptext(this.player.sprite.x,
                                this.player.sprite.x,
                                this.player.sprite.y-100,
                                this.player.sprite.y-200,
                                monsterDamage,
                                { font: "20px Arial", fill: "#000"});

            if(this.player.health <= 0)
            {
                this.monsterCanAttack = false;
                this.playerCanAttack = false;
                this.playerDied();
            }
        }
    },
    
    playerDied: function()
    {
        this.inAnimation = true;
        
        this.animatePopuptext(this.player.sprite.x, 
                            this.player.sprite.x, 
                            this.player.sprite.y-100, 
                            this.player.sprite.y-200,
                            "Died",
                            { font: "30px Arial", fill: "#F00", stroke: "#000", strokeThickness: 1});
        
        var new_level = this.gameLevel-1;
        if(new_level <= 0)
        {
            new_level = 1;
        }
        
        LocalStorage.setData('gameLevel', new_level);
        
        var fadeOutTween = this.game.add.tween(this.player.sprite).to( 
                            { alpha: 0 }, 500, 
                            Phaser.Easing.Linear.None, true);
        var thisGame = this;
        fadeOutTween.onComplete.add(function(){
            thisGame.player.sprite.alpha = 1;
            thisGame.wasRevertedInLevel = true;
            thisGame.loadLevel(new_level);
        });
    },
    
    monsterDied: function()
    {
        this.inAnimation = true;
        
        var monster_gold_drop = this.monster.getGoldDrop();
        
        this.animatePopuptext(this.monster.sprite.x, 
                        this.monster.sprite.x, 
                        this.monster.sprite.y-100, 
                        this.monster.sprite.y-200,
                        "+"+InfiniteFormulas.humanReadableSize(monster_gold_drop),
                        { font: "30px Arial", fill: "#FF0", stroke: "#000", strokeThickness: 1});

        this.player.coins += monster_gold_drop;
        LocalStorage.setData('playerCoins', this.player.coins);
        
        var new_level = this.gameLevel;
        if(this.wasRevertedInLevel === false)
        {
            new_level++;
        }
        
        this.animateLoadLevel(new_level);
    },
    
    animateLoadLevel: function(levelNum)
    {
        this.inAnimation = true;
        
        LocalStorage.setData('gameLevel', levelNum);
        
        if(levelNum > this.maxGameLevel)
        {
            this.newMaxGameLevel(levelNum);
        }
        
        var fadeOutTween = this.game.add.tween(this.monster.sprite).to( 
                            { alpha: 0 }, 500, 
                            Phaser.Easing.Linear.None, true);
        var thisGame = this;
        fadeOutTween.onComplete.add(function(){
            thisGame.loadLevel(levelNum);
        });
    },
    
    animateInputDown: function(event)
    {
        var tapmark = StickmanTapGame.game.add.sprite(this.game.input.x, this.game.input.y, 'tapmark');
        tapmark.anchor.setTo(0.5, 0.5);
        tapmark.animations.add('tapanimation', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        tapmark.animations.play('tapanimation', 40, false, true);
        this.popupGroup.add(tapmark);
        
//        this.tapmark.x = this.game.input.x;
//        this.tapmark.y = this.game.input.y;
//        this.tapmark.visible = true;
//        this.tapmark.animations.play('tapanimation');
//        this.tapmark.events.onAnimationComplete.add(function(sprite){
//            if(sprite.visible === true)
//            {
//                sprite.visible=false;
//            }
//        }, this);
    },
    
    animatePopuptext: function(coord_x_start, coord_x_end, coord_y_start, coord_y_end, text, style)
    {
        var popuptext = this.game.add.text(coord_x_start, coord_y_start, text, style);
        popuptext.anchor.setTo(0.5, 0.5);
        this.popupGroup.add(popuptext);
        var popupTextTween = this.game.add.tween(popuptext);
        popupTextTween.to({x: coord_x_end, y: coord_y_end}, 500);
        popupTextTween.onComplete.add(function(){
            popuptext.destroy();
        });
        popupTextTween.start();
    },
    
    calculateOffGameCoins: function(lastActiveTimeInSec, playerLevel, gameLevel)
    {
        var currentTimeInSec = (Date.now() / 1000) | 0;
        var offTimeInSec = currentTimeInSec-lastActiveTimeInSec;
        
        var playerDPS = InfiniteFormulas.getPlayerDamage(playerLevel);

        var monsterLevel = this.getMonsterLevelDefeatableByPlayer(gameLevel, playerLevel);
        var monsterHealth = InfiniteFormulas.getMonsterMaxHealth(monsterLevel);
        var monsterGoldDrop = InfiniteFormulas.getMonsterGoldDrop(gameLevel);
        
        var timePerMonsterInSec = Math.ceil(monsterHealth/playerDPS);
        
        var monstersPosiblyKilled = (offTimeInSec/timePerMonsterInSec) | 0;
        
        var resultMadeCoinsWhileOffGame = monstersPosiblyKilled * monsterGoldDrop;
        resultMadeCoinsWhileOffGame = (resultMadeCoinsWhileOffGame/10) | 0;
                
        if(resultMadeCoinsWhileOffGame > 0)
        {
            this.frame = new OffGameCoinsFrame(resultMadeCoinsWhileOffGame, this.player);
            this.frameShown = true;
        }
    },
    
    newMaxGameLevel: function(levelNum)
    {
        this.animatePopuptext(this.game.world.centerX,
                                this.game.world.centerX,
                                this.game.world.centerY-100,
                                this.game.world.centerY-200,
                                'New max game level',
                                { font: "30px Arial", fill: "#00F"});
   
        this.maxGameLevel = levelNum;
        LocalStorage.setData('maxGameLevel', this.maxGameLevel);
        
        LocalStorage.onlineBackup();
    },
    
    getMonsterLevelDefeatableByPlayer: function(assumedMaxMonsterLevel, playerLevel)
    {
        var monsterLevel = assumedMaxMonsterLevel;
        var playerDPS = InfiniteFormulas.getPlayerDamage(playerLevel);
        var playerHealth = InfiniteFormulas.getPlayerMaxHealth(playerLevel);
        
        var foundMonster = false;
        while(!foundMonster)
        {
            var monsterHealth = InfiniteFormulas.getMonsterMaxHealth(monsterLevel);
            var monsterDamage = InfiniteFormulas.getMonsterDamage(monsterLevel);
            
            var timePerMonsterInSec = Math.ceil(monsterHealth/playerDPS);
            var timePerPlayerInSec = Math.ceil(playerHealth/monsterDamage);
            if(monsterLevel%5 !== 0 || timePerMonsterInSec < timePerPlayerInSec)
            {
                foundMonster = true;
                break;
            }
            monsterLevel--;
        }
        
        return monsterLevel;
    },
    
    nextLevelBackgroundIndex: function()
    {        
        var background_index = this.currentBackgroundSpriteIndex;
        
        for(var i=0; i<5; i++)
        {
            if(background_index !== this.currentBackgroundSpriteIndex)
            {
                this.currentBackgroundSpriteIndex = background_index;
                break;
            }
            
            background_index = ((Math.random() * this.backgrounds.length)) | 0;
        }
        
        return background_index;
    }
};

