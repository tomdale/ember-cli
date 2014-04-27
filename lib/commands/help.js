'use strict';

var Command = require('../models/command');
var chalk = require('chalk');

module.exports = Command.extend({
  name: 'help',
  works: 'everywhere',
  description: 'Outputs the usage instructions for all commands or the provided command',

  aliases: [undefined, 'h', 'help', '-h', '--help'],

  _displayHelpForCommand: function(commandName) {
    var command = this.commands[commandName];

    // If the requested command doesn't exist, display an error message.
    if (!command) {
      this.ui.write(chalk.red('No help entry for \'' + commandName + '\'\n'));
    } else {
      this.ui.write(command.usageInstructions() + '\n');
    }
  },

  run: function(options) {
    var args = options.args;

      // If any additional args were passed to the help command,
    // attempt to look up the command for each of them.
    if (args.length > 1) {
      this.ui.write('Requested ember-cli commands:\n\n');

      // Iterate through each arg beyond the initial 'help' command,
      // and try to display usage instructions.
      args.slice(1).forEach(this._displayHelpForCommand.bind(this));

    // Otherwise, display usage for all commands.
    } else {
      this.ui.write('Available commands in ember-cli:\n');

      Object.keys(this.commands).forEach(this._displayHelpForCommand.bind(this));
    }
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<command-name (Default: all)>'
    };
  }
});
