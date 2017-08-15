/* global Phaser */

(function (window, Phaser) {
  'use strict';

  /**
   * Virtual Joystick plugin for Phaser.io
   */

  Phaser.Plugin.VJoy = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);

    this.isInTheZone = isInsideTheZone.bind(this);

    this.input = this.game.input;
    this.imageGroup = [];

    this.imageGroup.push(this.game.add.sprite(0, 0, 'vjoy_cap'));
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
    singleDirection: false
  };

  
  Phaser.Plugin.VJoy.prototype.rotation = 0;
  Phaser.Plugin.VJoy.prototype.force = 0;
  Phaser.Plugin.VJoy.prototype.isDown = false;

  Phaser.Plugin.VJoy.prototype.inputEnable = function (x1, y1, x2, y2) {
    x1 = x1 || 0;
    y1 = y1 || 0;
    x2 = x2 || this.game.width;
    y2 = y2 || this.game.height;
    this.zone = new Phaser.Rectangle(x1, y1, x2, y2);
    this.input.onDown.add(createCompass, this);
    this.input.onUp.remove(removeCompass, this);
  };

  Phaser.Plugin.VJoy.prototype.inputDisable = function () {
    this.input.onDown.remove(createCompass, this);
    this.input.onUp.remove(removeCompass, this);
  };

  var initialPoint;

  var isInsideTheZone = function isInsideTheZone(pointer) {
    return this.zone.contains(pointer.position.x, pointer.position.y);
  };

  var createCompass = function createCompass(pointer) {
    if (this.pointer || !this.isInTheZone(pointer)) {
      return;
    }

    this.pointer = pointer;
    this.isDown = true;

    this.imageGroup.forEach(function (e) {
      e.visible = true;
      e.bringToTop();

      e.cameraOffset.x = pointer.x;
      e.cameraOffset.y = pointer.y;

    }, this);

    this.preUpdate = setDirection.bind(this);

    initialPoint = this.input.activePointer.position.clone();
  };

  var removeCompass = function () {
    this.imageGroup.forEach(function (e) {
      e.visible = false;
    });
    this.isDown = false;
    this.force = 0;

    this.preUpdate = empty;
    this.pointer = null;
  };

  var empty = function () {
  };

  var setDirection = function () {
    if (!this.isInTheZone(this.pointer)) {
      return;
    }

    if (!this.pointer.active || this.input.activePointer.isUp) {
      removeCompass.bind(this)();
      return;
    }

    var d = initialPoint.distance(this.pointer.position);
    var maxDistanceInPixels = this.settings.maxDistanceInPixels;

    var deltaX = this.pointer.position.x - initialPoint.x;
    var deltaY = this.pointer.position.y - initialPoint.y;

    if (this.settings.singleDirection) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaY = 0;
        this.pointer.position.y = initialPoint.y;
      } else {
        deltaX = 0;
        this.pointer.position.x = initialPoint.x;
      }
    }

    var angle = initialPoint.angle(this.pointer.position);
    this.rotation = angle;
    this.force = (d < maxDistanceInPixels ? d: maxDistanceInPixels)/maxDistanceInPixels;

    if (d > maxDistanceInPixels) {
      deltaX = Math.cos(angle) * maxDistanceInPixels;
      deltaY = Math.sin(angle) * maxDistanceInPixels;
    }

    this.imageGroup.forEach(function (e, i) {
      e.cameraOffset.x = initialPoint.x + (deltaX) * i / 3;
      e.cameraOffset.y = initialPoint.y + (deltaY) * i / 3;
    }, this);
  };

  Phaser.Plugin.VJoy.prototype.preUpdate = empty;

}.call(this, window, Phaser));
