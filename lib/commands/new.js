'use strict';

var chalk   = require('chalk');
var Command = require('../models/command');

module.exports = Command.extend({
  description: 'Creates a new folder and runs ' + chalk.green('ember init') + ' in it.',

  works: 'outsideProject',

  availableOptions: [
    { name: 'verbose', type: Boolean, default: false }
  ],

  run: function(options) {
    var args = options.args;
    var rawName = args[1];
    var ui      = this.ui;

    if (!rawName) {
      ui.write(chalk.yellow('The `ember new` command requires an ' +
               'app-name to be specified. For more details, use `ember help`.\n'));

      throw undefined;
    }

    if (rawName === 'test') {
      ui.write('Due to an issue with `compileES6` an application name of `test` cannot be used.');

      throw undefined;
    }

    var createAndStepIntoDirectory  = this.tasks.createAndStepIntoDirectory;
    var init                        = this.commands.init;

    createAndStepIntoDirectory.ui = this.ui;
    createAndStepIntoDirectory.analytics = this.analytics;

    init.ui = this.ui;
    init.analytics = this.analytics;

    return createAndStepIntoDirectory
      .run({
        directoryName: rawName
      })
      .then(init.run.bind(null, options));
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<app-name>'
    };
  }
});
