/* global Phaser, StickmanTapGame, InfiniteFormulas */

//function Monster(damage, health, golddrop, spritesheet_obj){
function Monster(levelNum, spritesheet_obj){
    this.levelNum = levelNum;
    this.health = InfiniteFormulas.getMonsterMaxHealth(this.levelNum);
    this.name = spritesheet_obj.name;
    
    this.sprite = StickmanTapGame.game.add.sprite(StickmanTapGame.game.world.centerX+50, 
                                                StickmanTapGame.game.world.centerY+35, 
                                                spritesheet_obj.spritesheet, 
                                                spritesheet_obj.starting_index);  
    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.animations.add('staindinganimation', spritesheet_obj.stainding_animation, 2, true);
    this.sprite.animations.add('takedamageanimation', spritesheet_obj.take_damage_animation, 30, false);
    this.sprite.animations.add('attackanimation', spritesheet_obj.attacking_animation, 30, false);
    
    this.sprite.scale.x = spritesheet_obj.scale;
    this.sprite.scale.y = spritesheet_obj.scale;
    
    this.sprite.animations.play('staindinganimation');
    
    this.getMaxHealth = function()
    {
        return InfiniteFormulas.getMonsterMaxHealth(this.levelNum);
    };
    
    this.getDamage = function()
    {
        return InfiniteFormulas.getMonsterDamage(this.levelNum);
    };
    
    this.getGoldDrop = function()
    {
        return InfiniteFormulas.getMonsterGoldDrop(this.levelNum);
    };

    this.animateAttack = function()
    {
        this.sprite.animations.play('attackanimation');
    };
    
    this.takeDamage = function(damage)
    {
        this.health -= damage;
        if(this.health < 0)
        {
            this.health = 0;
        }
        
        this.sprite.animations.play('takedamageanimation');
    };
    
    this.destroy = function()
    {
        this.attackLooper.timer.stop();
        this.sprite.destroy();
    };
}

