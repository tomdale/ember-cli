'use strict';

var assign    = require('lodash-node/modern/objects/assign');
var quickTemp = require('quick-temp');
var Command   = require('../models/command');

module.exports = Command.extend({
  aliases: ['test', 't'],

  availableOptions: [
    { name: 'config-file', type: String, default: './testem.json' },
  ],

  run: function(options) {
    var build       = this.tasks.build;
    var test        = this.tasks.test;

    var cwd         = quickTemp.makeOrRemake(this, '-testsDist');
    var testOptions = assign({}, options, { cwd: cwd });

    build.ui = this.ui;
    test.ui  = this.ui;

    build.analytics = this.analytics;
    test.analytics  = this.analytics;

    return build.run({
      environment: 'development',
      outputPath: cwd
    })
      .then(function() {
        return test.run(testOptions);
      });
  }
});
