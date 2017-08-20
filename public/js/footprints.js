var Footprint = function(context, x, y, rotation) {
    this.game = context;
    this.entity = this.game.add.sprite(x, y, 'footprints');

    game.physics.enable(this.entity, Phaser.Physics.ARCADE);
    this.entity.rotation = rotation;
    this.entity.anchor.setTo(.5);
    this.MAX_LIFE = 10000;
    this.life = 0;
};

Footprint.prototype = {
    remove: function() {
        this.entity.destroy();
    },
  
    update: function(dt) {
        this.life += dt;
        this.entity.alpha = (this.MAX_LIFE-this.life)/this.MAX_LIFE;
    }
};

