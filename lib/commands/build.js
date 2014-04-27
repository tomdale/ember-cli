'use strict';

var path    = require('path');
var Command = require('../models/command');

module.exports = Command.extend({
  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'output-path', type: path, default: 'dist/' }
  ],

  run: function(options) {
    this.tasks.build.ui   = this.ui;
    this.tasks.build.analytics = this.analytics;

    return this.tasks.build.run(options);
  }
});
