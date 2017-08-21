var CharacterCreator = function(game, callback) {
    slickUI.add(this.panel = new SlickUI.Element.Panel(8, 8, game.width - 16, game.height - 16));
    this.panel.add(new SlickUI.Element.Text(10,10, "Style yourself!")).centerHorizontally().text.alpha = 0.5;

    var female = [];
    female.push(game.make.sprite(0, 0, 'female_base', 131));
    female.push(game.make.sprite(0, 0, 'female_shoes', 131));
    female.push(game.make.sprite(0, 0, 'female_pants', 131));
    female.push(game.make.sprite(0, 0, 'female_shoulderl', 131));
    female.push(game.make.sprite(0, 0, 'female_shirt', 131));


    var male = [];
    male.push(game.make.sprite(0, 0, 'male_base', 131));
    male.push(game.make.sprite(0, 0, 'male_shoes', 131));
    male.push(game.make.sprite(0, 0, 'male_pants', 131));
    male.push(game.make.sprite(0, 0, 'male_xlongknot', 131));
    male.push(game.make.sprite(0, 0, 'male_shirt', 131));



    var skeleton = [];
    skeleton.push(game.make.sprite(0, 0, 'skeleton_base', 131));
    skeleton.push(game.make.sprite(0, 0, 'male_shoes', 131));
    skeleton.push(game.make.sprite(0, 0, 'male_pants', 131));
    skeleton.push(game.make.sprite(0, 0, 'male_xlongknot', 131));
    skeleton.push(game.make.sprite(0, 0, 'male_shirt', 131));


    var hairValue = Math.random();
    var hairTint = valueToColor(hairValue);
    female[3].tint = hairTint;
    male[3].tint = hairTint;
    skeleton[3].tint = hairTint;

    var skinValue = Math.random();
    var skinTint = valueToColor(skinValue);
    female[0].tint = skinTint;
    male[0].tint = skinTint;
    skeleton[0].tint = skinTint;

    var shirtValue = Math.random();
    var shirtTint = valueToColor(shirtValue);
    female[4].tint = shirtTint;
    male[4].tint = shirtTint;
    skeleton[4].alpha = 0;

    var pantsValue = Math.random();
    var pantsTint = valueToColor(pantsValue);
    female[2].tint = pantsTint;
    male[2].tint = pantsTint;
    skeleton[2].tint = pantsTint;

    skeleton[1].alpha = 0;


    this.panel.add(new SlickUI.Element.Text(16,50, "Skin: ")).text.alpha = 0.5;
    var skinSlider = new SlickUI.Element.Slider(100,60, game.width - 150, skinValue);
    this.panel.add(skinSlider);

    this.panel.add(new SlickUI.Element.Text(16,110, "Hair: ")).text.alpha = 0.5;
    var hairSlider = new SlickUI.Element.Slider(100,120, game.width - 150, hairValue);
    this.panel.add(hairSlider);

    this.panel.add(new SlickUI.Element.Text(16,170, "Shirt: ")).text.alpha = 0.5;
    var shirtSlider = new SlickUI.Element.Slider(100,180, game.width - 150, shirtValue);
    this.panel.add(shirtSlider);

    this.panel.add(new SlickUI.Element.Text(16,230, "Pants: ")).text.alpha = 0.5;
    var pantsSlider = new SlickUI.Element.Slider(100,240, game.width - 150, pantsValue);
    this.panel.add(pantsSlider);

	this.panel.add(new SlickUI.Element.Text(10,290, "Body")).centerHorizontally().text.alpha = 0.5;

    var multiplier = 2;
    smallHeight = female[0].height*.75;
    smallWidth = female[0].width*.75;
    largeHeight = female[0].height*1.50;
    largeWidth = female[0].width*1.50;

    for(var i in female) {
    	female[i].height = largeHeight;
    	female[i].width = largeWidth;
    	female[i].anchor.setTo(0.5);
    	this.panel.add(new SlickUI.Element.DisplayObject(this.panel.width / 2 - 100, 360, female[i]));

        female[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
        female[i].play('down');
    }

    for(var i in male) {
    	male[i].anchor.setTo(0.5);
    	male[i].height = smallHeight;
    	male[i].width = smallWidth;
    	this.panel.add(new SlickUI.Element.DisplayObject(this.panel.width / 2, 360, male[i]));

        male[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
    }

    for(var i in skeleton) {
    	skeleton[i].anchor.setTo(0.5);
    	skeleton[i].height = smallHeight;
    	skeleton[i].width = smallWidth;
    	this.panel.add(new SlickUI.Element.DisplayObject(this.panel.width / 2 + 100, 360, skeleton[i]));

        skeleton[i].animations.add('down', [131,132,133,134,135,136,137,138], 15, true);
    }
    
    skinSlider.onDrag.add(function (value) {
    	skinValue = value;
    	var color = valueToColor(skinValue);
    	female[0].tint = color;
    	male[0].tint = color;
    	skeleton[0].tint = color;
    });
    
    hairSlider.onDrag.add(function (value) {
    	hairValue = value;
    	var color = valueToColor(hairValue);
    	female[3].tint = color;
    	male[3].tint = color;
    	skeleton[3].tint = color;
    });
    
    shirtSlider.onDrag.add(function (value) {
    	shirtValue = value;
    	var color = valueToColor(shirtValue);
    	female[4].tint = color;
    	male[4].tint = color;
    });
    
    pantsSlider.onDrag.add(function (value) {
    	pantsValue = value;
    	var color = valueToColor(pantsValue);
    	female[2].tint = color;
    	male[2].tint = color;
    	skeleton[2].tint = color;
    });

    var bodyType = 0;
    female[0].inputEnabled = true;
    female[0].events.onInputDown.add(function() {
    	bodyType = 0;
    	startAnimations(female, largeHeight, largeWidth);
    	stopAnimations(male, smallHeight, smallWidth);
    	stopAnimations(skeleton, smallHeight, smallWidth);
    }, this);

    male[0].inputEnabled = true;
    male[0].events.onInputDown.add(function() {
    	bodyType = 1;
    	stopAnimations(female, smallHeight, smallWidth);
    	startAnimations(male, largeHeight, largeWidth);
    	stopAnimations(skeleton, smallHeight, smallWidth);
    }, this);

    skeleton[0].inputEnabled = true;
    skeleton[0].events.onInputDown.add(function() {
    	bodyType = 2;
    	stopAnimations(female, smallHeight, smallWidth);
    	stopAnimations(male, smallHeight, smallHeight);
    	startAnimations(skeleton, largeHeight, largeWidth);
    }, this);

    this.panel.add(button = new SlickUI.Element.Button(0,game.height-80, game.width, 50)).events.onInputUp.add(function () {
            callback({
				b:bodyType,
				n:"bleh",
				sk:skinValue,
				h:hairValue,
				sh:shirtValue,
				p:pantsValue});
        });
    button.add(new SlickUI.Element.Text(0,0, "Go!")).center();
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

CharacterCreator.prototype = {
	destroy: function() {
		this.panel.destroy();
	},
	bringToTop: function() {
		this.panel.bringToTop();
	}
};