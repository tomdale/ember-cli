'use strict';

var chalk     = require('chalk');
var Command   = require('../models/command');
var path      = require('path');
var Blueprint = require('../blueprint');

module.exports = Command.extend({
  description: 'Creates a new folder and runs ' + chalk.green('ember init') + ' in it.',

  works: 'outsideProject',

  availableOptions: [
    { name: 'dry-run', type: Boolean, default: false },
    { name: 'verbose', type: Boolean, default: false },
    { name: 'blueprint', type: path, default: Blueprint.main }
  ],

  run: function(commandOptions, rawArgs) {
    var rawName = rawArgs[0];

    if (!rawName) {
      this.ui.write(chalk.yellow('The `ember new` command requires an ' +
               'app-name to be specified. For more details, use `ember help`.\n'));

      throw undefined;
    }

    if (rawName === 'test') {
      this.ui.write('Due to an issue with `compileES6` an application name of `test` cannot be used.');

      throw undefined;
    }

    var createAndStepIntoDirectory  = this.tasks.createAndStepIntoDirectory;
    var InitCommand                 = this.commands.init;

    delete environment.project;

    createAndStepIntoDirectory.ui = this.ui;
    createAndStepIntoDirectory.analytics = this.analytics;

    var initCommand = new InitCommand({
      ui: this.ui,
      analytics: this.analytics
    });

    return createAndStepIntoDirectory
      .run({
        directoryName: rawName
      })
      .then(initCommand.run.bind(null, commandOptions, rawArgs));
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<app-name>'
    };
  }
});
