'use strict';
var chalk = require('chalk');

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
  return {
    validateAndRun: function() {
      this.ui.write('The specified command ' + chalk.green(commandName) +
               ' is invalid, for available options see ' +
                chalk.green('ember help') + '.\n');
    }
  };
};
