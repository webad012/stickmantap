/* global StickmanTapGame, InfiniteFormulas */

function Player(name, level, coins, coord_x, coord_y, sprite_indx){
    
    this.sprite = StickmanTapGame.game.add.sprite(coord_x, coord_y, 'player', sprite_indx);  
    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.animations.add('attackanimation', [0, 46, 47, 46, 0], 30, false);
    this.sprite.animations.add('takedamageanimation', [0, 66, 67, 66, 0], 30, false);
    
    this.name = name;
    this.level = level;
    this.health = InfiniteFormulas.getPlayerMaxHealth(this.level);
    this.coins = coins;
        
    this.getDamage = function()
    {
        return InfiniteFormulas.getPlayerDamage(this.level);
    };
    this.getMaxHealth = function()
    {
        return InfiniteFormulas.getPlayerMaxHealth(this.level);
    };

    this.attack = function()
    {
        this.sprite.animations.play('attackanimation');
    };
    
    this.takeDamage = function(monsterDamage)
    {
        this.health -= monsterDamage;
        if(this.health < 0)
        {
            this.health = 0;
        }
        this.sprite.animations.play('takedamageanimation');
    };
    
    this.getLevelUpgradeCost = function()
    {
        return InfiniteFormulas.getPlayerLevelUpgradeCost(this.level);
    };
}

