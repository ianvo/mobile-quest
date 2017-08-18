/* global Phaser */

(function (window, Phaser) {
  'use strict';

  /**
   * Virtual Joystick plugin for Phaser.io
   */

  Phaser.Plugin.VJoy = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);


    this.input = this.game.input;
    this.imageGroup = [];

    //this.imageGroup.push(this.game.add.sprite(0, 0, 'vjoy_cap'));
    this.imageGroup.push(this.game.add.sprite(0, 0, 'vjoy_body'));
    this.imageGroup.push(this.game.add.sprite(0, 0, 'vjoy_body'));
    this.imageGroup.push(this.game.add.sprite(0, 0, 'vjoy_base'));

    this.imageGroup.forEach(function (e) {
      e.anchor.set(0.5);
      e.visible = false;
      e.scale.setTo(.5, .5);
      e.fixedToCamera = true;
    });
  };

  Phaser.Plugin.VJoy.prototype = Object.create(Phaser.Plugin.prototype);
  Phaser.Plugin.VJoy.prototype.constructor = Phaser.Plugin.VJoy;

  Phaser.Plugin.VJoy.prototype.settings = {
    maxDistanceInPixels: 50,
  };

  
  Phaser.Plugin.VJoy.prototype.rotation = 0;
  Phaser.Plugin.VJoy.prototype.force = 0;
  Phaser.Plugin.VJoy.prototype.isDown = false;

  Phaser.Plugin.VJoy.prototype.bringToTop = function () {

    this.imageGroup.forEach(function (e, i) {
        e.bringToTop();
    }, this);
  };

  Phaser.Plugin.VJoy.prototype.inputEnable = function (x, y) {
    this.center = new Phaser.Point(x, y);

    this.isDown = false;

    this.imageGroup.forEach(function (e) {
      e.visible = true;
      e.bringToTop();

      e.cameraOffset.x = x;
      e.cameraOffset.y = y;

    }, this);


    this.input.onDown.add(startTracking, this);
    this.input.onUp.add(stopTracking, this);
  };

  Phaser.Plugin.VJoy.prototype.inputDisable = function () {
    this.input.onDown.remove(startTracking, this);
    this.input.onUp.remove(stopTracking, this);
  };

  var startTracking = function startTracking(pointer) {
      if(this.center.distance(pointer.position) <= this.settings.maxDistanceInPixels) {
          this.pointer = pointer;
          this.isDown = true;
          this.preUpdate = setDirection.bind(this);
      }
  }

  var stopTracking = function stopTracking() {
    this.preUpdate = empty;
    this.isDown = false;
    this.force = 0;
    this.pointer = null;
    this.imageGroup.forEach(function (e, i) {
        e.cameraOffset.x = this.center.x;
        e.cameraOffset.y = this.center.y;
    }, this);
  }

  var empty = function () {
  };

  var setDirection = function () {
    var d = this.center.distance(this.pointer.position);
    var maxDistanceInPixels = this.settings.maxDistanceInPixels;

    var deltaX = this.pointer.position.x - this.center.x;
    var deltaY = this.pointer.position.y - this.center.y;

    var angle = this.center.angle(this.pointer.position);
    this.rotation = angle;
    this.force = (d < maxDistanceInPixels ? d: maxDistanceInPixels)/maxDistanceInPixels;

    if (d > maxDistanceInPixels) {
      deltaX = Math.cos(angle) * maxDistanceInPixels;
      deltaY = Math.sin(angle) * maxDistanceInPixels;
    }

    this.imageGroup.forEach(function (e, i) {
      e.cameraOffset.x = this.center.x + (deltaX) * i / 2;
      e.cameraOffset.y = this.center.y + (deltaY) * i / 2;
    }, this);
  };

  Phaser.Plugin.VJoy.prototype.preUpdate = empty;

}.call(this, window, Phaser));
