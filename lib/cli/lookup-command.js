'use strict';
var chalk = require('chalk');
var Command = require('../models/command');

function UnknownCommand(commandName) {
  this.commandName = commandName;
}

UnknownCommand.prototype = Object.create(Command.prototype);
UnknownCommand.prototype.validateAndRun = function() {
  this.ui.write('The specified command ' + chalk.green(this.commandName) +
                ' is invalid, for available options see ' +
                chalk.green('ember help') + '.\n');
};

module.exports = function(commands, commandName){
  function aliasMatches(alias) {
    return alias === commandName;
  }

  for (var key in commands) {
    var command = commands[key];

    if (command.name === commandName || command.aliases.some(aliasMatches)) {
      return command;
    }
  }

  // if we didn't find anything, return an "UnknownCommand"
  return new UnknownCommand(commandName);
};
