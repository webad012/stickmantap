var InfiniteFormulas = {
    getPlayerDamage: function(playerLevel)
    {
        return playerLevel * 1;
    },
    getPlayerMaxHealth: function(playerLevel)
    {
        var playerMaxHealth = playerLevel * 10;
        return playerMaxHealth;
    },
    getPlayerLevelUpgradeCost: function(playerLevel)
    {
        var playerLevelUpgradeCost = (Math.pow(playerLevel, 3.5)) | 0;
        return playerLevelUpgradeCost;
    },
    
    getMonsterDamage: function(gameLevelNum)
    {
        var boss_multiplicator = 1;
        if(gameLevelNum % 5 === 0)
        {
            boss_multiplicator = 2;
        }
        
        return Math.ceil(gameLevelNum * 2 + (gameLevelNum * 0.5)) * boss_multiplicator;
    },
    getMonsterGoldDrop: function(gameLevelNum)
    {
        var monsterGoldDrop = (Math.pow(gameLevelNum, 2.5)) | 0;
        return monsterGoldDrop;
    },
    getMonsterMaxHealth: function(gameLevelNum)
    {
        var boss_multiplicator = 1;
        if(gameLevelNum % 5 === 0)
        {
            boss_multiplicator = 2;
        }
        
        var monsterMaxHealth = Math.pow(gameLevelNum, 2) * boss_multiplicator;
        return monsterMaxHealth;
    },
    
    humanReadableSize: function(size) {
        var thresh = 1000;
        var thresh_decimal = 0.001;
        if(Math.abs(size) < thresh) {
            return size;
        }
        var units = ['k','M','G','T','P','E','Z','Y'];
        var u = -1;
        do {
            size *= thresh_decimal;
            ++u;
        } while(Math.abs(size) >= thresh && u < units.length - 1);
        
        return size.toFixed(2)+units[u];
    }
};
