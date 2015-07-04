/* global StickmanTapGame, InfiniteFormulas */

var ProfileFrame = function(player)
{
    this.player = player;
    
    this.frame = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX, 
                                                    StickmanTapGame.game.world.centerY, 
                                                    'frame', 
                                                    StickmanTapGame.characterMenuGroup);
    this.frame.anchor.setTo(0.5, 0.5);
    this.frame.inputEnabled = true;

    this.levelLabel = StickmanTapGame.game.add.text(60, 150, '', { font: '20px Arial', fill: '#000' });
    this.levelLabel.anchor.setTo(0, 0.5);
    refreshTexts(this);
    var levelUpgradeX = 60+10+this.levelLabel.width;
    this.levelUpgrade = StickmanTapGame.game.add.sprite(levelUpgradeX, 150, 
                                                        'upgradebutton', 
                                                        StickmanTapGame.characterMenuGroup);
    this.levelUpgrade.anchor.setTo(0, 0.5);
    this.levelUpgrade.inputEnabled = true;
    this.levelUpgrade.events.onInputDown.add(function(){
        onPurchaseLevelUprade(this);
    }, this);
    var levelUpgradeCostX = levelUpgradeX+10+this.levelUpgrade.width;
    this.levelUpgradeCost = StickmanTapGame.game.add.text(levelUpgradeCostX, 150, '', 
                                { font: '15px Arial', fill: '#000' });
    this.levelUpgradeCost.anchor.setTo(0, 0.5);
    refreshTexts(this);

    this.frameLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX, 
                                                    StickmanTapGame.game.world.centerY+200, 
                                                    'Click outside to continue', 
                                                    { font: '15px Arial', fill: '#000' });
    this.frameLabel.anchor.setTo(0.5, 0.5);

    refreshTexts(this);

    this.frameShown = true;
    this.frameChildren = [this.levelLabel, this.levelUpgrade, this.levelUpgradeCost, this.frameLabel];
    
    this.close = function()
    {
        this.frameChildren.forEach(function(element){element.destroy();});
        this.frame.destroy();
    };
    
    function onPurchaseLevelUprade(thisFrame)
    {
        if(thisFrame.player.getLevelUpgradeCost() <= thisFrame.player.coins)
        {
            thisFrame.player.coins -= thisFrame.player.getLevelUpgradeCost();
            thisFrame.player.level += 1;

            LocalStorage.setData('playerLevel', thisFrame.player.level);
            LocalStorage.setData('playerCoins', thisFrame.player.coins);
            
            if(StickmanTapGameOffline === false)
            {
                LocalStorage.onlineBackup();
            }

            refreshTexts(thisFrame);
        }
        else
        {

        }
    };
    
    function refreshTexts(thisFrame)
    {
        if(thisFrame.levelLabel)
        {
            thisFrame.levelLabel.text = 'Level: '+InfiniteFormulas.humanReadableSize(thisFrame.player.level);
        }
        if(thisFrame.levelUpgradeCost)
        {
            thisFrame.levelUpgradeCost.text = '('+InfiniteFormulas.humanReadableSize(thisFrame.player.getLevelUpgradeCost())+' coins)';
        }
        if(thisFrame.signInUpLabel)
        {
            if(thisFrame.isSignedIn === true)
            {
                
            }
        }
    };
};

var OffGameCoinsFrame = function(resultMadeCoinsWhileOffGame, player)
{
    this.frame = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX, 
                                                StickmanTapGame.game.world.centerY, 
                                                'frame', 
                                                StickmanTapGame.characterMenuGroup);
    this.frame.anchor.setTo(0.5, 0.5);
    this.frame.inputEnabled = true;
    this.frame.events.onInputDown.add(function(){
        close(this);
    }, this);

    var text = 'While offline you have\n';
    text += 'collected '+InfiniteFormulas.humanReadableSize(resultMadeCoinsWhileOffGame)+' coins\n';
    text += '\nTap to close.';
    this.frameLabel = StickmanTapGame.game.add.text(60, 200, text, { font: '20px Arial', fill: '#000' });
    this.frameLabel.anchor.setTo(0, 0.5);

    player.coins += resultMadeCoinsWhileOffGame;

    this.frameShown = true;
    this.frameChildren = [this.frameLabel];
    
    this.close = function()
    {
        close(this);
    };
    
    function close(thisFrame)
    {
        thisFrame.frameChildren.forEach(function(element){element.destroy();});
        thisFrame.frame.destroy();
    }
};

var SettingsFrame = function(player)
{
    this.frameChildren = [];
    
    this.frame = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX, 
                                                StickmanTapGame.game.world.centerY, 
                                                'frame', 
                                                StickmanTapGame.characterMenuGroup);
    this.frame.anchor.setTo(0.5, 0.5);
    this.frame.inputEnabled = true;
    
    var marginX = StickmanTapGame.game.world.centerX-130;

    this.playerNameLabel = StickmanTapGame.game.add.text(marginX, 
                                                    StickmanTapGame.game.world.centerY-200, 
                                                    'Player name: ', 
                                                    { font: '20px Arial', fill: '#000' });
    this.playerNameLabel.anchor.setTo(0, 0.5);
    this.frameChildren.push(this.playerNameLabel);

    this.playerName = StickmanTapGame.game.add.text(marginX+120, 
                                                    StickmanTapGame.game.world.centerY-200, 
                                                    player.name, 
                                                    { font: '20px Arial', fill: '#000' });
    this.playerName.anchor.setTo(0, 0.5);
    this.playerName.inputEnabled = true;
    var pname = this.playerName;
    this.playerName.events.onInputDown.add(function(){
        var newname = prompt("Please enter your name", player.name);
        while(newname !== null && (newname.length > 10 || newname.length === 0)){
            alert("Keep the name length to 10 chars or less");
            newname = prompt("Please enter your name", player.name);
        }
        if (newname !== null) {
            player.name = newname;
            pname.text = player.name;
            LocalStorage.setData('playerName', newname);
        }
    }, this);
    this.frameChildren.push(this.playerName);
    
    
    //
    if(StickmanTapGameOffline === false)
    {
        this.loggedInLabel = StickmanTapGame.game.add.text(marginX, 
                                                        StickmanTapGame.game.world.centerY-150, 
                                                        'Logged in: ', 
                                                        { font: '20px Arial', fill: '#000' });
        this.loggedInLabel.anchor.setTo(0, 0.5);
        this.frameChildren.push(this.loggedInLabel);

        var username = LocalStorage.getData('username');
        this.userName = StickmanTapGame.game.add.text(marginX+100, 
                                                        StickmanTapGame.game.world.centerY-150, 
                                                        username, 
                                                        { font: '20px Arial', fill: '#000' });
        this.userName.anchor.setTo(0, 0.5);
        
        this.loggedOutLabel = StickmanTapGame.game.add.text(marginX+100+this.userName.width, 
                                                        StickmanTapGame.game.world.centerY-150, 
                                                        '(logout)', 
                                                        { font: '20px Arial', fill: '#000' });
        this.loggedOutLabel.anchor.setTo(0, 0.5);
        this.frameChildren.push(this.loggedOutLabel);
        this.loggedOutLabel.inputEnabled = true;
        this.loggedOutLabel.events.onInputDown.add(function(){
            if (window.confirm("Are you sure you want to logout?")) 
            {
                LocalStorage.setData('username', '');
                LocalStorage.setData('password', '');
                StickmanTapGame.game.state.start('Login');
            }
        }, this);
        this.frameChildren.push(this.userName);
    }
    //

    this.factoryResetLabel = StickmanTapGame.game.add.text(marginX, 
                                                    StickmanTapGame.game.world.centerY+150, 
                                                    'Factory reset', 
                                                    { font: '20px Arial', fill: '#000' });
    this.factoryResetLabel.anchor.setTo(0, 0.5);
    this.factoryResetLabel.inputEnabled = true;
    this.factoryResetLabel.events.onInputDown.add(function(){
        if (window.confirm("Are you sure you want to perform factory reset?")) 
        {
            LocalStorage.factoryReset();
            StickmanTapGame.game.state.start('Boot');
        }
    }, this);
    this.frameChildren.push(this.factoryResetLabel);

    this.frameLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX, 
                                                    StickmanTapGame.game.world.centerY+200, 
                                                    'Click outside to continue', 
                                                    { font: '15px Arial', fill: '#000' });
    this.frameLabel.anchor.setTo(0.5, 0.5);
    this.frameChildren.push(this.frameLabel);

    this.frameShown = true;
    
    this.close = function()
    {
        close(this);
    };
    
    function close(thisFrame)
    {
        thisFrame.frameChildren.forEach(function(element){element.destroy();});
        thisFrame.frame.destroy();
    }
};

var StatisticsFrame = function(maxGameLevel)
{
    this.frameChildren = [];
    
    this.frame = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX, 
                                                StickmanTapGame.game.world.centerY, 
                                                'frame', 
                                                StickmanTapGame.characterMenuGroup);
    this.frame.anchor.setTo(0.5, 0.5);
    this.frame.inputEnabled = true;
    
    var marginX = StickmanTapGame.game.world.centerX-130;

    this.maxGameLevelLabel = StickmanTapGame.game.add.text(marginX, 
                                    StickmanTapGame.game.world.centerY-200, 
                                    'Max game level: '
                                    +InfiniteFormulas.humanReadableSize(maxGameLevel), 
                                    { font: '20px Arial', fill: '#000' });
    this.maxGameLevelLabel.anchor.setTo(0, 0.5);
    this.frameChildren.push(this.maxGameLevelLabel);
    
    this.frameLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX, 
                                                    StickmanTapGame.game.world.centerY+200, 
                                                    'Click outside to continue', 
                                                    { font: '15px Arial', fill: '#000' });
    this.frameLabel.anchor.setTo(0.5, 0.5);
    this.frameChildren.push(this.frameLabel);

    this.frameShown = true;
    
    this.close = function()
    {
        close(this);
    };
    
    function close(thisFrame)
    {
        thisFrame.frameChildren.forEach(function(element){element.destroy();});
        thisFrame.frame.destroy();
    }
};

var LeaderboardsFrame = function(maxGameLevel)
{
    var localThis = this;
    this.frameChildren = [];
    this.rankItems = [];
    
    this.frame = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX, 
                                                StickmanTapGame.game.world.centerY, 
                                                'frame', 
                                                StickmanTapGame.characterMenuGroup);
    this.frame.anchor.setTo(0.5, 0.5);
    this.frame.inputEnabled = true;
    
    this.statusLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX+20, 
                                    StickmanTapGame.game.world.centerY-200, 
                                    'Loading', 
                                    { font: '20px Arial', fill: '#000' });
    this.statusLabel.anchor.setTo(0.5, 0.5);
    this.frameChildren.push(this.statusLabel);

    if(StickmanTapGameOffline === false)
    {
        this.statusLabel.text = '';
        
        var leaderboard_data = JSON.parse(SessionStorage.getData('leaderboard_data'));
        var player_position = parseInt(leaderboard_data.users_position);
        var yourRankLabel = StickmanTapGame.game.add.text(50, 
                                    StickmanTapGame.game.world.centerY-210, 
                                    'Your rank: '+player_position, 
                                    { font: '20px Arial', fill: '#000' });
        yourRankLabel.anchor.setTo(0, 0);
        localThis.frameChildren.push(yourRankLabel);
        
        var headerFont = '15px Arial';
        var headerYPosBase = StickmanTapGame.game.world.centerY-170;

        var rankHeaderLabel = StickmanTapGame.game.add.text(50, 
                                    headerYPosBase, 
                                    'Rank', 
                                    { font: headerFont, fill: '#000' });
        rankHeaderLabel.anchor.setTo(0, 0);
        localThis.frameChildren.push(rankHeaderLabel);

        var charnameHeaderLabel = StickmanTapGame.game.add.text(100, 
                                    headerYPosBase, 
                                    'Player', 
                                    { font: headerFont, fill: '#000' });
        charnameHeaderLabel.anchor.setTo(0, 0);
        localThis.frameChildren.push(charnameHeaderLabel);

        var valueHeaderLabel = StickmanTapGame.game.add.text(200, 
                                    headerYPosBase, 
                                    'Game level', 
                                    { font: headerFont, fill: '#000' });
        valueHeaderLabel.anchor.setTo(0, 0);
        localThis.frameChildren.push(valueHeaderLabel);
        
        var spacerHeaderLabel = StickmanTapGame.game.add.text(50, 
                                    headerYPosBase, 
                                    '_______________________________', 
                                    { font: headerFont, fill: '#000' });
        localThis.statusLabel.anchor.setTo(0, 0);
        localThis.frameChildren.push(spacerHeaderLabel);
        
        var leftArrow = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX-100, 
                                    StickmanTapGame.game.world.centerY+170, 
                                                        'arrowleft');
        leftArrow.anchor.setTo(0.5, 0.5);
        localThis.frameChildren.push(leftArrow);
        leftArrow.inputEnabled = true;
        leftArrow.events.onInputDown.add(function(){
            var leaderboard_selected_start_pos = parseInt(SessionStorage.getData('leaderboard_selected_start_pos'));
            
            if(leaderboard_selected_start_pos > 0)
            {
                leaderboard_selected_start_pos -= 10;
                SessionStorage.setData('leaderboard_selected_start_pos', leaderboard_selected_start_pos);
                redrawLeaderboards(localThis);
            }
        });
        
        var rightArrow = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX+100, 
                                    StickmanTapGame.game.world.centerY+170, 
                                                        'arrowright');
        rightArrow.anchor.setTo(0.5, 0.5);
        localThis.frameChildren.push(rightArrow);
        rightArrow.inputEnabled = true;
        rightArrow.events.onInputDown.add(function(){
            var leaderboard_selected_start_pos = parseInt(SessionStorage.getData('leaderboard_selected_start_pos'));
            
            if(leaderboard_selected_start_pos < 90)
            {
                leaderboard_selected_start_pos += 10;
                SessionStorage.setData('leaderboard_selected_start_pos', leaderboard_selected_start_pos);
                redrawLeaderboards(localThis);
            }
        });

        var refreshLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX, 
                                    StickmanTapGame.game.world.centerY+210, 
                                    'Refresh', 
                                    { font: '20px Arial', fill: '#000' });
        refreshLabel.anchor.setTo(0.5, 0.5);
        localThis.frameChildren.push(refreshLabel);
        refreshLabel.inputEnabled = true;
        refreshLabel.events.onInputDown.add(function(){
            localThis.statusLabel.text = 'Loading';
            var username = LocalStorage.getData('username');
            stickmanAjax('LoadLeaderboards', function(response){
                localThis.statusLabel.text = '';

                if(response.status === 'success')
                {
                    SessionStorage.setData('leaderboard_data', JSON.stringify(response.message), true);
                    redrawLeaderboards(localThis);
                }
                else
                {
                    StickmanTapGameOffline = true;
                    var message = 'There was problem with network, you will continue to play offline';
                    alert(message);
                }
            },
            "username="+username,
            function(responseText){
                localThis.statusLabel.text = 'Error';

                StickmanTapGameOffline = true;
                var message = 'There was problem with network, you will continue to play offline';
                alert(message);
            });
        }, this);
        
        redrawLeaderboards(this);    
    }
    else
    {
        this.statusLabel.text = 'Offline play';
    }

    this.frameShown = true;
    
    this.close = function()
    {
        close(this);
    };
    
    function close(thisFrame)
    {
        thisFrame.frameChildren.forEach(function(element){element.destroy();});
        thisFrame.rankItems.forEach(function(element){element.destroy();});
        thisFrame.frame.destroy();
    };
    
    function redrawLeaderboards(thisFrame)
    {
        thisFrame.rankItems.forEach(function(element){element.destroy();});
        
        var leaderboard_data = JSON.parse(SessionStorage.getData('leaderboard_data'));
        var leaderboard = leaderboard_data.leaderboard;
        var player_position = parseInt(leaderboard_data.users_position);

        var start_pos = 0;
        var stop_pos = 10;
        
        var leaderboard_selected_start_pos = SessionStorage.getData('leaderboard_selected_start_pos');
        if(typeof leaderboard_selected_start_pos !== 'undefined'
                && leaderboard_selected_start_pos !== null)
        {
            start_pos = parseInt(leaderboard_selected_start_pos);
        }
        else
        {
            if(player_position > 100)
            {
                start_pos = 90;
            }
            else
            {
                var decade_pos = (player_position * 0.1) | 0;

                start_pos = decade_pos*10;
            }
            
            SessionStorage.setData('leaderboard_selected_start_pos', start_pos)
        }
        
        stop_pos = start_pos+10;
        
        for (var i = start_pos; i < stop_pos; i++) 
        {
            var font = '15px Arial';
            var yPosBase = StickmanTapGame.game.world.centerY-140;
            if(i === player_position-1)
            {
                font = 'bold 20px Arial';
                yPosBase -= 5;
            }

            var rankLabel = StickmanTapGame.game.add.text(50, 
                                        yPosBase + ((i-start_pos)*30), 
                                        (i+1)+'.', 
                                        { font: font, fill: '#000' });
            rankLabel.anchor.setTo(0, 0);
            thisFrame.rankItems.push(rankLabel);

            var charnameLabel = StickmanTapGame.game.add.text(100, 
                                        yPosBase + ((i-start_pos)*30), 
                                        leaderboard[i].character_name, 
                                        { font: font, fill: '#000' });
            charnameLabel.anchor.setTo(0, 0);
            thisFrame.rankItems.push(charnameLabel);

            var valueLabel = StickmanTapGame.game.add.text(200, 
                                        yPosBase + ((i-start_pos)*30), 
                                        leaderboard[i].max_game_level, 
                                        { font: font, fill: '#000' });
            valueLabel.anchor.setTo(0, 0);
            thisFrame.rankItems.push(valueLabel);

            var spacerLabel = StickmanTapGame.game.add.text(50, 
                                        StickmanTapGame.game.world.centerY-140 + ((i-start_pos)*30), 
                                        '_______________________________', 
                                        { font: '15px Arial', fill: '#000' });
            spacerLabel.anchor.setTo(0, 0);
            thisFrame.rankItems.push(spacerLabel);
        }
    };
};
