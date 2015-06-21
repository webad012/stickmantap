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
//        var playerLevelUpgradeCost = playerLevel * 10 + (playerLevel * 5);
        var playerLevelUpgradeCost = Math.pow(playerLevel, 3.5);
        return playerLevelUpgradeCost;
    },
    
    getMonsterDamage: function(gameLevelNum)
    {
        return Math.ceil(gameLevelNum * 2 + (gameLevelNum * 0.5));
//        var monsterDamage = Math.pow(gameLevelNum, 3);
//        return monsterDamage;
    },
    getMonsterGoldDrop: function(gameLevelNum)
    {
//        return gameLevelNum * 2;
//        return (gameLevelNum ^ 10) * (gameLevelNum ^ 20);
        var monsterGoldDrop = Math.floor(Math.pow(gameLevelNum, 2.5));
        return monsterGoldDrop;
    },
    getMonsterMaxHealth: function(gameLevelNum)
    {
//        return gameLevelNum * 10;
        var monsterMaxHealth = Math.pow(gameLevelNum, 2);
        return monsterMaxHealth;
    },
    
    humanReadableSize: function(size) {
        var thresh = 1000;
        if(Math.abs(size) < thresh) {
            return size;
        }
        var units = ['k','M','G','T','P','E','Z','Y'];
        var u = -1;
        do {
            size /= thresh;
            ++u;
        } while(Math.abs(size) >= thresh && u < units.length - 1);
        
        return size.toFixed(2)+units[u];
    }
};
