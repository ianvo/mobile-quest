var Player = function(context, player, isMe, x, y) {
    this.game = context;
    this.isMe = isMe;
    this.isSelected = false;
    this.sprites = [];
    if(player.b == 0) {
        this.sprites.push(game.add.sprite(x, y, 'female_base', 131));
        this.sprites.push(game.add.sprite(x, y, 'female_shoes', 131));
        this.sprites.push(game.add.sprite(x, y, 'female_pants', 131));
        this.sprites.push(game.add.sprite(x, y, femaleHair[player.ht], 131));
        this.sprites.push(game.add.sprite(x, y, 'female_shirt', 131));
    }
    else if(player.b == 1) {
        this.sprites.push(game.add.sprite(x, y, 'male_base', 131));
        this.sprites.push(game.add.sprite(x, y, 'male_shoes', 131));
        this.sprites.push(game.add.sprite(x, y, 'male_pants', 131));
        this.sprites.push(game.add.sprite(x, y, maleHair[player.ht], 131));
        this.sprites.push(game.add.sprite(x, y, 'male_shirt', 131));
    }
    else {
        this.sprites.push(game.add.sprite(x, y, 'skeleton_base', 131));
        this.sprites.push(game.add.sprite(x, y, 'male_shoes', 131));
        this.sprites.push(game.add.sprite(x, y, 'male_pants', 131));
        this.sprites.push(game.add.sprite(x, y, maleHair[player.ht], 131));
        this.sprites.push(game.add.sprite(x, y, 'male_shirt', 131));
        this.sprites[1].alpha = 0;
        this.sprites[4].alpha = 0;
    }
    this.sprites[0].tint = valueToColor(player.sk);
    this.sprites[3].tint = valueToColor(player.h);
    this.sprites[4].tint = valueToColor(player.sh);
    this.sprites[2].tint = valueToColor(player.p);

    for(var i in this.sprites) {
        this.sprites[i].animations.add('up', [105,106,107,108,109,110,111,112], 15, true);
        this.sprites[i].animations.add('left', [118,119,120,121,122,123,124,125], 15, true);
        this.sprites[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
        this.sprites[i].animations.add('right', [144,145,146,147,148,149,150,151], 15, true);
        game.physics.enable(this.sprites[i], Phaser.Physics.ARCADE);
        this.sprites[i].body.setSize(64, 64, 2, 1);
        this.sprites[i].body.collideWorldBounds = true;
    }

    this.sprites[0].inputEnabled = true;

    this.maxSpeed = 175;
    this.isMoving = false;
    this.MAX_MESSAGE_LIFE = 4000;
    this.messageLife = 0;
    
    this.startPoint = new Phaser.Point(x, y);
    this.targetPoint = new Phaser.Point(x, y);
    this.remainderDistance = -1;
    this.rotation = Math.PI/2;
    this.lastPosition = this.startPoint;
    this.distanceSinceLastFootstep = 0;
    
    this.name = game.add.text(x, y, player.n);
    this.name.font = 'Slackey';
    this.name.fill = this.isMe ? "#00ff00" : "#ffffff";
    this.name.fontSize = 13;
    this.name.stroke = '#000000';
    this.name.strokeThickness = 3;
    this.stateChanged = false;

    if(this.isMe) {
      game.camera.follow(this.sprites[0]);
    }
};

Player.prototype = {

    setSelected: function(selected) {
        this.isSelected = selected;
    },
    setMessage: function(latestMessage) {
        if(this.message != undefined) {
            this.message.destroy();
        }
        this.message = game.add.text(this.sprites[0].body.x, 0, latestMessage, { font: '11px Press Start 2P', fill: '#ffffff' });
        this.messageLife = 0;
    },

    remove: function() {
        for(var i in this.sprites) {
            this.sprites[i].destroy();
        }
        this.name.destroy();
        if(this.message != undefined) {
            this.message.destroy();
        }
    },

    setTarget: function(x, y) {
        this.startPoint = new Phaser.Point(this.sprites[0].body.x, this.sprites[0].body.y);
        this.targetPoint = new Phaser.Point(x, y);
        
        this.remainderDistance = -1;
        if(this.startPoint.distance(this.targetPoint) > 0) {
            this.rotation = this.startPoint.angle(this.targetPoint);
        }
      
    },

    bringToTop: function() {
        this.name.bringToTop();
        for(var i in this.sprites) {
            this.sprites[i].bringToTop();
        }
    },
  
    update: function(world, rotation, force, dt) {
        moving = force != 0;

        this.stateChanged = false;
        var currentPoint = new Phaser.Point(this.sprites[0].body.x, this.sprites[0].body.y); 
        if(!this.isMe) {
          rotation = this.rotation;
          force = 1;
          moving = this.isMoving;
          
          var newRemainderDistance = this.targetPoint.distance(currentPoint);
          if(newRemainderDistance >= this.remainderDistance && this.remainderDistance >= 0) {
            force = 0;
            this.remainderDistance = -1;
            this.startPoint = this.targetPoint;
            this.sprites[0].body.x = this.targetPoint.x;
            this.sprites[0].body.y = this.targetPoint.y;
          }
          this.remainderDistance = newRemainderDistance;

            if(this.isSelected) {
                this.name.stroke = '#00ff00';
                this.name.strokeThickness = 3;
            }
            else {
                this.name.stroke = '#000000';
                this.name.strokeThickness = 3;
            }
        }
        else {
          game.physics.arcade.collide(this.sprites[0], world);
          if(force == 0) {
              if(this.isMoving) {
                  this.stateChanged = true;
              }
              this.isMoving = false;
          }
          else {
              this.isMoving = true;
              this.stateChanged = true;
          }
        }
        this.sprites[0].body.velocity.set(0);
        if (force != 0)
        {
            var vel = force * this.maxSpeed;
            this.sprites[0].body.velocity.x = Math.cos(rotation) * vel;
            this.sprites[0].body.velocity.y = Math.sin(rotation) * vel;

            if(rotation >= -Math.PI / 4 && rotation <= Math.PI / 4) {
                for(var i in this.sprites) {
                    this.sprites[i].play('right');
                }
            }
            else if(rotation >= Math.PI * .75 || rotation <= -Math.PI * 75) {
                for(var i in this.sprites) {
                    this.sprites[i].play('left');
                }
            }
            else if (rotation < 0) {
                for(var i in this.sprites) {
                    this.sprites[i].play('up');
                }
            }
            else {
                for(var i in this.sprites) {
                    this.sprites[i].play('down');
                }
            }
        }
        else if (!moving)
        {
            for(var i in this.sprites) {
                this.sprites[i].animations.stop();
            }
        }
        this.name.x = this.sprites[0].body.x-((this.name.width-this.sprites[0].body.width)/2);
        this.name.y = this.sprites[0].body.y+this.sprites[0].body.height;
        for(var i in this.sprites) {
            this.sprites[i].body.x = this.sprites[0].body.x;
            this.sprites[i].body.y = this.sprites[0].body.y;
        }

        if(this.message != undefined) {
            this.messageLife += dt;
            if(this.messageLife <= this.MAX_MESSAGE_LIFE) {
                this.message.x = this.sprites[0].body.x-((this.message.width-this.sprites[0].body.width)/2);
                this.message.y = this.sprites[0].body.y;
            }
            else {
                this.message.destroy();
                this.message = undefined;
            }
        }


        var distanceTravelled = this.lastPosition.distance(currentPoint);
        this.distanceSinceLastFootstep += distanceTravelled;
        this.lastPosition = currentPoint;
        if(this.distanceSinceLastFootstep > 30) {
            var footprintX = this.sprites[0].body.x+(this.sprites[0].body.width/2);
            var footPrintY = this.sprites[0].body.y+this.sprites[0].body.height-15;
            footprints.push(new Footprint(this.game, footprintX, footPrintY, rotation));
            this.distanceSinceLastFootstep = 0;
        }
    }
};

