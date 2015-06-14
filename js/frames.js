/* global StickmanTapGame, InfiniteFormulas */

var ProfileFrame = function(player)
{
    this.player = player;
    this.localstorage = new LocalStorage();
    
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

            thisFrame.localstorage.setData('playerLevel', thisFrame.player.level);
            thisFrame.localstorage.setData('playerCoins', thisFrame.player.coins);

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
    
//    $.ajax({
//        type: "POST",
//        url: "index.php?r=api/getTeams",
//        dataType: 'json',
//        async: true,
//        success: function(response){
//            if(response.status === "success")
//            {
//                var select_team = parentDiv.find('.select-team');
//                                                
//                if(response.message !== undefined)
//                {
//                    var json_result = jQuery.parseJSON(response.message);
//                    for(var i=0; i<json_result.length; i++)
//                    {
//                        select_team.append($("<option></option>")
//                                    .attr("value",json_result[i].id)
//                                    .text(json_result[i].name)); 
//                    }
//                }
//            }
//            else
//            {
//                alert("failure: "+response.message);
//            }
//        },
//        error: function(xhr){
//            alert("failure: "+xhr.responseText+ " - " + this.url);
//        }
//    });
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
            var localstorage = new LocalStorage();
            localstorage.setData('playerName', newname);
        }
    }, this);
    this.frameChildren.push(this.playerName);

    this.factoryResetLabel = StickmanTapGame.game.add.text(marginX, 
                                                    StickmanTapGame.game.world.centerY+150, 
                                                    'Factory reset', 
                                                    { font: '20px Arial', fill: '#000' });
    this.factoryResetLabel.anchor.setTo(0, 0.5);
    this.factoryResetLabel.inputEnabled = true;
    this.factoryResetLabel.events.onInputDown.add(function(){
        if (window.confirm("Are you sure you want to perform factory reset?")) 
        {
            var localstorage = new LocalStorage();
            localstorage.factoryReset();
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
//    this.frameChildren = [this.frameLabel, this.factoryResetLabel, this.playerName, this.playerNameLabel];
    
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
    
    
    this.frameLabel = StickmanTapGame.game.add.text(StickmanTapGame.game.world.centerX, 
                                                    StickmanTapGame.game.world.centerY+200, 
                                                    'Click outside to continue', 
                                                    { font: '15px Arial', fill: '#000' });
    this.frameLabel.anchor.setTo(0.5, 0.5);

    this.frameShown = true;
    this.frameChildren = [this.frameLabel, this.maxGameLevelLabel];
    
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
