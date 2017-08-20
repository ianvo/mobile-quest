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

    var hairValue = Math.random();
    var hairTint = valueToColor(hairValue);
    female[3].tint = hairTint;
    male[3].tint = hairTint;

    var skinValue = Math.random();
    var skinTint = valueToColor(skinValue);
    female[0].tint = skinTint;
    male[0].tint = skinTint;

    var shirtValue = Math.random();
    var shirtTint = valueToColor(shirtValue);
    female[4].tint = shirtTint;
    male[4].tint = shirtTint;

    var pantsValue = Math.random();
    var pantsTint = valueToColor(pantsValue);
    female[2].tint = pantsTint;
    male[2].tint = pantsTint;


    this.panel.add(new SlickUI.Element.Text(16,90, "Skin: ")).text.alpha = 0.5;
    var skinSlider = new SlickUI.Element.Slider(100,100, game.width - 150, skinValue);
    this.panel.add(skinSlider);

    this.panel.add(new SlickUI.Element.Text(16,160, "Hair: ")).text.alpha = 0.5;
    var hairSlider = new SlickUI.Element.Slider(100,170, game.width - 150, hairValue);
    this.panel.add(hairSlider);

    this.panel.add(new SlickUI.Element.Text(16,230, "Shirt: ")).text.alpha = 0.5;
    var shirtSlider = new SlickUI.Element.Slider(100,240, game.width - 150, shirtValue);
    this.panel.add(shirtSlider);

    this.panel.add(new SlickUI.Element.Text(16,300, "Pants: ")).text.alpha = 0.5;
    var pantsSlider = new SlickUI.Element.Slider(100,310, game.width - 150, pantsValue);
    this.panel.add(pantsSlider);

	this.panel.add(new SlickUI.Element.Text(10,350, "Pick your gender")).centerHorizontally().text.alpha = 0.5;

    var multiplier = 2;

    for(var i in female) {
    	female[i].height *= multiplier;
    	female[i].width *= multiplier;
    	female[i].anchor.setTo(0.5);
    	this.panel.add(new SlickUI.Element.DisplayObject(this.panel.width / 2 - 100, 430, female[i]));
    }

    for(var i in male) {
    	male[i].height *= multiplier;
    	male[i].width *= multiplier;
    	male[i].anchor.setTo(0.5);
    	this.panel.add(new SlickUI.Element.DisplayObject(this.panel.width / 2 + 100, 430, male[i]));
    }
    
    skinSlider.onDrag.add(function (value) {
    	skinValue = value;
    	var color = valueToColor(skinValue);
    	female[0].tint = color;
    	male[0].tint = color;
    });
    
    hairSlider.onDrag.add(function (value) {
    	hairValue = value;
    	var color = valueToColor(hairValue);
    	female[3].tint = color;
    	male[3].tint = color;
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
    });

    female[0].inputEnabled = true;
    female[0].events.onInputDown.add(function() {
		callback({
				g:0,
				n:"female",
				sk:skinValue,
				h:hairValue,
				sh:shirtValue,
				p:pantsValue});
    }, this);



    male[0].inputEnabled = true;
    male[0].events.onInputDown.add(function() {
		callback({
				g:1,
				n:"male",
				sk:skinValue,
				h:hairValue,
				sh:shirtValue,
				p:pantsValue});
    }, this);
};

function valueToColor(value) {
	value *= 6;
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
	else {					// 255     0      0      7/7
		r = 255;
		g = Math.round(255-((value-5)*255));
		b = 0;
		if(g < 127) {
			r = g*2;
		}
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