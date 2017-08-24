var femaleHair = ['female_hair_shortbangs',
				  'female_hair_longbangs',
				  'female_hair_loose',
				  'female_hair_ponytail',
				  'female_hair_pixie',
				  'female_hair_bunches',
				  'female_hair_princess',
				  'female_hair_swoop',
				  'female_hair_shoulderl'];

var maleHair = ['male_hair_plain', 
				'male_hair_bedhead', 
				'male_hair_long', 
				'male_hair_messy1', 
				'male_hair_messy2', 
				'male_hair_mohawk', 
				'male_hair_page', 
				'male_hair_parted', 
				'male_hair_shorthawk', 
				'male_hair_xlongknot'];

var Character = function(panel, bodyType, skinTint, hairTint, shirtTint, pantsTint) {

	this.bodyType = bodyType;
	this.hair = [];
	this.hairIndex = 0;
	this.largeSize = 100;
	this.smallSize = 100;

	this.sprites = [];
	//setup sprites for various body types
	if(this.bodyType == 0) { //female
		this.sprites.push(game.make.sprite(0, 0, 'female_base', 131));
	    this.sprites.push(game.make.sprite(0, 0, 'female_shoes', 131));
	    this.sprites.push(game.make.sprite(0, 0, 'female_pants', 131));
	    this.sprites.push(game.make.sprite(0, 0, 'female_shirt', 131));

	    for(var i in femaleHair) {
			this.hair.push(game.make.sprite(0, 0, femaleHair[i], 131));
	    }
		this.sprites.push(this.hair[0]);
	}
	else { //male & skeleton use same clothing types
		if(this.bodyType == 1) {
			this.sprites.push(game.make.sprite(0, 0, 'male_base', 131));
		}
		else {
			this.sprites.push(game.make.sprite(0, 0, 'skeleton_base', 131));
		}

	    this.sprites.push(game.make.sprite(0, 0, 'male_shoes', 131));
	    this.sprites.push(game.make.sprite(0, 0, 'male_pants', 131));
	    this.sprites.push(game.make.sprite(0, 0, 'male_shirt', 131));


	    for(var i in maleHair) {
			this.hair.push(game.make.sprite(0, 0, maleHair[i], 131));
	    }

		if(this.bodyType == 2) { //skeletons don't have shoes or shirts
			this.sprites[1].alpha = 0;
			this.sprites[3].alpha = 0;
		}
	}

	for(var i in this.sprites) {
    	this.sprites[i].height = this.smallSize;
    	this.sprites[i].width = this.smallSize;
    	this.sprites[i].anchor.setTo(0.5);
    	panel.add(new SlickUI.Element.DisplayObject(panel.width/2, panel.height/2-5, this.sprites[i]));

        this.sprites[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
    }

    this.hairIndex = Math.floor(Math.random() * this.hair.length);
    for(var i in this.hair) {
    	this.hair[i].height = this.smallSize;
    	this.hair[i].width = this.smallSize;
    	this.hair[i].anchor.setTo(0.5);
    	panel.add(new SlickUI.Element.DisplayObject(panel.width/2, panel.height/2-5, this.hair[i]));

        this.hair[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
        if(i == this.hairIndex) {
        	this.hair[i].alpha = 1;
        }
        else {
        	this.hair[i].alpha = 0;
        }
    }

    this.skinValue = skinTint;
    this.hairValue = hairTint;
    this.shirtValue = shirtTint;
    this.pantsValue = pantsTint;

    this.tintSkin(skinTint);
    this.tintHair(hairTint);
    this.tintShirt(shirtTint);
    this.tintPants(pantsTint);
}

Character.prototype = {
	tintSkin: function(value) {
		this.skinValue = value;
		tint = valueToColor(value);
		this.sprites[0].tint = tint;
	},
	tintHair: function(value) {
		this.hairValue = value;
		tint = valueToColor(value);
		for(var i in this.hair) {
			this.hair[i].tint = tint;
		}
	},
	tintPants: function(value) {
		this.pantsValue = value;
		tint = valueToColor(value);
		this.sprites[2].tint = tint;
	},
	tintShirt: function(value) {
		this.shirtValue = value;
		tint = valueToColor(value);
		this.sprites[3].tint = tint;
	},
	cycleHair: function() {
		this.hairIndex = (this.hairIndex+1)%this.hair.length;
		for(var i in this.hair) {
			if(i == this.hairIndex) {
				this.hair[i].alpha = 1;
			}
			else {
				this.hair[i].alpha = 0;
			}
		}
	},
	select: function() {
		for(var i in this.sprites) {
	        this.sprites[i].play('down');
	    	this.sprites[i].height = this.largeSize;
	    	this.sprites[i].width = this.largeSize;
	    }
		for(var i in this.hair) {
	        this.hair[i].play('down');
	    	this.hair[i].height = this.largeSize;
	    	this.hair[i].width = this.largeSize;
	    }
	},
	unselect: function() {
		for(var i in this.sprites) {
	        this.sprites[i].animations.stop();
	    	this.sprites[i].height = this.smallSize;
	    	this.sprites[i].width = this.smallSize;
	    }
		for(var i in this.hair) {
	        this.hair[i].animations.stop();
	    	this.hair[i].height = this.smallSize;
	    	this.hair[i].width = this.smallSize;
	    }
	},
	toJSON: function() {
		return {
				b:this.bodyType,
				n:"bleh",
				sk:this.skinValue,
				h:this.hairValue,
				ht:this.hairIndex,
				sh:this.shirtValue,
				p:this.pantsValue
    		};
	}
};

var CharacterCreator = function(game, callback) {
    slickUI.add(this.panel = new SlickUI.Element.Panel(15, 15, game.width - 30, game.height - 30));
    this.panel.add(new SlickUI.Element.Text(10,10, "Style yourself!")).centerHorizontally().text.alpha = 0.5;

    var selected;

    var hairValue = Math.random();
    var skinValue = Math.random();
    var shirtValue = Math.random();
    var pantsValue = Math.random();

    this.panel.add(new SlickUI.Element.Text(16,50, "Skin: ")).text.alpha = 0.5;
    var skinSlider = new SlickUI.Element.Slider(100,60, game.width - 150, skinValue);
    this.panel.add(skinSlider);

    var hairIndex = 0;
    this.panel.add(hairButton = new SlickUI.Element.Button(0,100, 90, 50)).events.onInputUp.add(function () {
        	selected.cycleHair();
        });
    hairButton.add(new SlickUI.Element.Text(0,0, "Hair")).center();

    var hairSlider = new SlickUI.Element.Slider(100,120, game.width - 150, hairValue);
    this.panel.add(hairSlider);

    this.panel.add(new SlickUI.Element.Text(16,170, "Shirt: ")).text.alpha = 0.5;
    var shirtSlider = new SlickUI.Element.Slider(100,180, game.width - 150, shirtValue);
    this.panel.add(shirtSlider);

    this.panel.add(new SlickUI.Element.Text(16,230, "Pants: ")).text.alpha = 0.5;
    var pantsSlider = new SlickUI.Element.Slider(100,240, game.width - 150, pantsValue);
    this.panel.add(pantsSlider);

	this.panel.add(new SlickUI.Element.Text(10,290, "Body")).centerHorizontally().text.alpha = 0.5;

	var unselected = .3;
	this.panel.add(femaleWrapper = new SlickUI.Element.Button(this.panel.width/2-160, 330, 100, 100)).events.onInputUp.add(function () {
            selected = female;
            female.select();
            male.unselect();
            skeleton.unselect();
            femaleWrapper.alpha=1;
            maleWrapper.alpha=unselected;
            skeletonWrapper.alpha=unselected;
        });
	var female = new Character(femaleWrapper, 0, skinValue, hairValue, shirtValue, pantsValue);
	selected = female;
	female.select();

	this.panel.add(maleWrapper = new SlickUI.Element.Button(this.panel.width/2-55, 330, 100, 100)).events.onInputUp.add(function () {
            selected = male;
            female.unselect();
            male.select();
            skeleton.unselect();
            femaleWrapper.alpha=unselected;
            maleWrapper.alpha=1;
            skeletonWrapper.alpha=unselected;
        });
	var male = new Character(maleWrapper, 1, skinValue, hairValue, shirtValue, pantsValue);
	maleWrapper.alpha=unselected;

	this.panel.add(skeletonWrapper = new SlickUI.Element.Button(this.panel.width/2+50, 330, 100, 100)).events.onInputUp.add(function () {
            selected = skeleton;
            female.unselect();
            male.unselect();
            skeleton.select();
            femaleWrapper.alpha=unselected;
            maleWrapper.alpha=unselected;
            skeletonWrapper.alpha=1;
        });
	var skeleton = new Character(skeletonWrapper, 2, skinValue, hairValue, shirtValue, pantsValue);
	skeletonWrapper.alpha=unselected;
    
    skinSlider.onDrag.add(function (value) {
    	female.tintSkin(value);
    	male.tintSkin(value);
    	skeleton.tintSkin(value);
    });
    
    hairSlider.onDrag.add(function (value) {
    	female.tintHair(value);
    	male.tintHair(value);
    	skeleton.tintHair(value);
    });
    
    shirtSlider.onDrag.add(function (value) {
    	female.tintShirt(value);
    	male.tintShirt(value);
    	skeleton.tintShirt(value);
    });
    
    pantsSlider.onDrag.add(function (value) {
    	female.tintPants(value);
    	male.tintPants(value);
    	skeleton.tintPants(value);
    });

    this.panel.add(button = new SlickUI.Element.Button(0,this.panel.height-50, this.panel.width, 50)).events.onInputUp.add(function () {
            callback(selected.toJSON());
        });
    button.add(new SlickUI.Element.Text(0,0, "Go!")).center();
};

CharacterCreator.prototype = {
	destroy: function() {
		this.panel.destroy();
	},
	bringToTop: function() {
		this.panel.bringToTop();
	},
	selectHair: function(hairIndex) {
		var maleHairIndex = hairIndex%maleHair.length;
		for(var i in maleHair) {
			if(i == maleHairIndex) {
				male[3] = maleHair[maleHairIndex];
				maleHair[maleHairIndex].alpha = 1;
			}
			else {
				maleHair[maleHairIndex].alpha = 0;
			}
		}
		for(var i in male) {
			male[i].bringToTop();
		}
	}
};



function startAnimations(model, height, width) {
	for(var i in model) {
        model[i].play('down');
    	model[i].height = height;
    	model[i].width = largeWidth;
    }
}

function stopAnimations(model, height, width) {
	for(var i in model) {
        model[i].animations.stop();
    	model[i].height = height;
    	model[i].width = width;
    }
}

function valueToColor(value) {
	value *= 7;
	var r = 0;
	var g = 0;
	var b = 0;
	if (value <= 1) {	// 255		0      255    2/7
		r = 255;
		g = 0;
		b = Math.round(value*255);
	}
	else if (value <= 2) {	// 0        0      255    3/7
		r = Math.round(255-((value-1)*255));
		g = 0;
		b = 255;
	}
	else if (value <= 3) {	// 0       255    255    4/7
		r = 0;
		g = Math.round((value-2)*255);
		b = 255;
	}
	else if (value <= 4) {	// 0       255    0      5/7
		r = 0;
		g = 255;
		b = Math.round(255-((value-3)*255));
	}
	else if (value <= 5) {	// 255     255    0      6/7
		r = Math.round((value-4)*255);
		g = 255;
		b = 0;
	}
	else if(value <= 6) {					// 255     0      0      7/7
		r = 255;
		g = Math.round(255-((value-5)*255));
		b = 0;
		if(g < 127) {
			r = g*2;
		}
	}
	else {
		r = Math.round((value-6)*255);
		g = Math.round((value-6)*255);
		b = Math.round((value-6)*255);
	}
	return Phaser.Color.getColor(r, g, b);
}