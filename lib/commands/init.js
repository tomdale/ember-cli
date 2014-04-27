'use strict';

var path        = require('path');
var Command     = require('../models/command');
var Blueprint   = require('../blueprint');

module.exports = Command.extend({
  description: 'Creates a new ember-cli project in the current folder.',
  works: 'everywhere',

  availableOptions: [
    { name: 'dry-run', type: Boolean, default: false },
    { name: 'verbose', type: Boolean, default: false },
    { name: 'blueprint', type: path, default: Blueprint.main }
  ],

  aliases: ['i'],

  run: function(options) {
    var cwd     = process.cwd();
    var rawName = path.basename(cwd);
    var ui      = this.ui;

    if (rawName === 'test') {
      ui.write('Due to an issue with `compileES6` an application name of `test` cannot be used.');
      throw undefined;
    }

    var installBlueprint = this.tasks.installBlueprint;
    var npmInstall       = this.tasks.npmInstall;
    var bowerInstall     = this.tasks.bowerInstall;
    var blueprintOpts = { dryRun: options.dryRun, blueprint: options.blueprint };

    return installBlueprint.run(ui, blueprintOpts)
      .then(function() {
        if (!options.dryRun) {
          return npmInstall.run(ui, { verbose: options.verbose });
        }
      })
      .then(function() {
        if (!options.dryRun) {
          return bowerInstall.run(ui, { verbose: options.verbose });
        }
      });
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<app-name>'
    };
  }
});
