var Player = function(context, name, isMe, x, y) {
    this.game = context;
    this.isMe = isMe;
    this.entity = game.add.sprite(x, y, 'player', 1);
    this.entity.animations.add('up', [105,106,107,108,109,110,111,112], 15, true);
    this.entity.animations.add('left', [118,119,120,121,122,123,124,125], 15, true);
    this.entity.animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
    this.entity.animations.add('right', [144,145,146,147,148,149,150,151], 15, true);
    this.maxSpeed = 175;
    this.isMoving = false;

    game.physics.enable(this.entity, Phaser.Physics.ARCADE);

    this.entity.body.setSize(64, 64, 2, 1);

    this.entity.body.collideWorldBounds = true;
    
    this.startPoint = new Phaser.Point(this.entity.body.x, this.entity.body.y);
    this.targetPoint = new Phaser.Point(this.entity.body.x, this.entity.body.y);
    this.remainderDistance = -1;
    this.rotation = Math.PI/2;
    
    this.name = game.add.text(this.entity.body.x, this.entity.body.y, name, { font: '11px Arial', fill: '#ffffff' });

    if(this.isMe) {
      game.camera.follow(this.entity);
    }
};

Player.prototype = {
    remove: function() {
        this.entity.destroy();
        this.name.destroy();
    },

    setTarget: function(x, y) {
        this.startPoint = new Phaser.Point(this.entity.body.x, this.entity.body.y);
        this.targetPoint = new Phaser.Point(x, y);
        
        this.remainderDistance = -1;
        if(this.startPoint.distance(this.targetPoint) > 0) {
            this.rotation = this.startPoint.angle(this.targetPoint);
        }
      
    },
  
    update: function(world, rotation, force) {
        moving = force != 0;
        if(!this.isMe) {
          var currentPoint = new Phaser.Point(this.entity.body.x, this.entity.body.y);
          rotation = this.rotation;
          force = 1;
          moving = this.isMoving;
          
          var newRemainderDistance = this.targetPoint.distance(currentPoint);
          if(newRemainderDistance >= this.remainderDistance && this.remainderDistance >= 0) {
            force = 0;
            this.remainderDistance = -1;
            this.startPoint = this.targetPoint;
            this.entity.body.x = this.targetPoint.x;
            this.entity.body.y = this.targetPoint.y;
          }
          this.remainderDistance = newRemainderDistance;
        }
      
        else {
          game.physics.arcade.collide(this.entity, world);
        }
        this.entity.body.velocity.set(0);
        if (force != 0)
        {
            var vel = force * this.maxSpeed;
            this.entity.body.velocity.x = Math.cos(rotation) * vel;
            this.entity.body.velocity.y = Math.sin(rotation) * vel;

            if(rotation >= -Math.PI / 4 && rotation <= Math.PI / 4) {
                this.entity.play('right');
            }
            else if(rotation >= Math.PI * .75 || rotation <= -Math.PI * 75) {
                this.entity.play('left');
            }
            else if (rotation < 0) {
                this.entity.play('up');
            }
            else {
                this.entity.play('down');
            }
        }
        else if (!moving)
        {
            this.entity.animations.stop();
        }
        this.name.x = this.entity.body.x-((this.name.width-this.entity.body.width)/2);
        this.name.y = this.entity.body.y+this.entity.body.height;
    }
};

