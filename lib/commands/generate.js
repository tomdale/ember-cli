'use strict';

var loom    = require('loom');
var Command = require('../models/command');

module.exports = Command.extend({
  works: 'insideProject',
  description: 'See http://git.io/1zCQ2A for available generators.',

  aliases: ['g'],

  run: function(options) {
    loom(options.args.slice(1).join(' '));
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<generator-name> <options...>'
    };
  }
});
