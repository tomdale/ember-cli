'use strict';
var assign = require('lodash-node/modern/objects/assign');
// TODO: bring with from IoC container module

function CoreObject(options) {
  assign(this, options);
}

module.exports = CoreObject;

CoreObject.prototype.constructor = CoreObject;

CoreObject.extend = function(options) {
  function Class() { }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(this.constructor.prototype);
  assign(Class.prototype, options);
  Class.prototype.constructor = Class;

  return Class;
};

