'use strict';

var assign    = require('lodash-node/modern/objects/assign');
var quickTemp = require('quick-temp');
var Command   = require('../models/command');

var buildWatcher = require('../utilities/build-watcher');

module.exports = Command.extend({
  aliases: ['test', 't'],

  availableOptions: [
    { name: 'config-file', type: String,  default: './testem.json' },
    { name: 'server',      type: Boolean, default: false},
  ],

  run: function(options) {
    var bind        = this;
    var cwd         = quickTemp.makeOrRemake(bind, '-testsDist');
    var testOptions = assign({}, options);


    if (options.server) {
      var testServer  = this.tasks.testServer;

      testServer.ui = this.ui;
      testServer.analytics = this.analytics;
      testOptions.watcher = buildWatcher();

      return testServer.run(testOptions);
    } else {
      var test        = this.tasks.test;
      var build       = this.tasks.build;

      build.ui        = this.ui;
      build.analytics = this.analytics;
      test.ui         = this.ui;
      test.analytics  = this.analytics;

      return build.run({ environment: 'development', outputPath: cwd })
        .then(function() {
          return test.run(testOptions);
        })
        .finally(function() {
          quickTemp.remove(bind, '-testsDist');
        });
    }
  }
});
