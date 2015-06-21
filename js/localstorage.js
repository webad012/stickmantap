var LocalStorage = function () {
    this.setData = function(name, data, without_last_action)
    {
        localStorage.setItem(name, data);
        var lastAction = Math.floor(Date.now() / 1000);
        
        if(without_last_action !== true)
        {
            localStorage.setItem('lastAction', lastAction);
        }
    };
    
    this.getData = function(name)
    {
        var data = localStorage.getItem(name);
        return data;
    };
    
    this.factoryReset = function()
    {
        localStorage.clear();
    };
    
    this.onlineBackup = function()
    {
        var username = localStorage.getItem('username');
        var gameLevel = localStorage.getItem('gameLevel');
        var playerCoins = localStorage.getItem('playerCoins');
        var playerLevel = localStorage.getItem('playerLevel');
        var maxGameLevel = localStorage.getItem('maxGameLevel');
        var playerName = localStorage.getItem('playerName');
        var lastAction = localStorage.getItem('lastAction');

        var parameters = "username="+username
                +"&gameLevel="+gameLevel
                +"&playerCoins="+playerCoins
                +"&playerLevel="+playerLevel
                +"&maxGameLevel="+maxGameLevel
                +"&playerName="+playerName
                +"&lastAction="+lastAction;
        stickmanAjax('SetData',
        function(response){console.log('backup success');},
        parameters,
        function(responseText){
            StickmanTapGameOffline = true;
            var message = 'There was problem with network, you will continue to play offline';
            alert(message);
        });
    }
};