'use strict';

var nopt          = require('nopt');
var chalk         = require('chalk');
var path          = require('path');
var camelize      = require('../utilities/string').camelize;
var getCallerFile = require('../utilities/get-caller-file');

var allowedWorkOptions = {
  insideProject: true,
  outsideProject: true,
  everywhere: true
};

module.exports = Command;

function Command(options) {
  this.ui = options.ui;
  this.analytics = options.analytics;
  this.isWithinProject = options.isWithinProject;

  this.name = this.name || path.basename(getCallerFile(), '.js');
  this.key  = this.key || camelize(this.name);

  this.aliases = this.aliases || [];

  // Works Property
  if (!allowedWorkOptions[this.works]) {
    throw new Error('The "' + this.name + '" command\'s works field has to ' +
                    'be either "everywhere", "insideProject" or "outsideProject".');
  }

  // Options property
  this.availableOptions = this.availableOptions || [];
  this.availableOptions.forEach(function(option) {
    if (!this.name || !this.type) {
      throw new Error('The command "' + this.name + '" has an option ' +
                      'without the required type and name fields.');
    }

    if (this.name !== this.name.toLowerCase()) {
      throw new Error('The "' + this.name + '" option\'s name of the "' +
                       this.name + '" command contains a capital letter.');
    }

    option.key = camelize(this.name);
    option.required = option.required || false;
  });
}

Command.__proto__ = require('./core-object');

Command.prototype.description = null;
Command.prototype.works = 'insideProject';
Command.prototype.constructor = Command;
Command.prototype.usageInstructions = function() { };

Command.prototype.validateAndRun = function(commandArgs) {
  var parsedArgs = this.parseArgs(commandArgs);

  if (this.isValid(parsedArgs)) {
    this.analytics.track({
      name:    'ember ',
      message: this.name
    });

    return this.run(parsedArgs);
  } else {
    this.reportValidationErrors();
  }
};

Command.extend = function(options) {
  function Class() {
    Command.apply(this, arguments);
  }

  Class.prototype = Object.create(Command.prototype);
  assign(Class.prototype, options);
  Class.prototype.constructor = Class;

  return Class;
};

Command.prototype.parseArgs = function(commandArgs) {
  var knownOpts       = {}; // Parse options
  var commandOptions  = {}; // Set defaults and check if required options are present
  var ui = this.ui;
  var commandName = this.name;
  var parsedOptions;

  var assembleAndValidateOption = function(option) {
    if (parsedOptions[option.name] === undefined) {
      if (option.default !== undefined) {
        commandOptions[option.key] = option.default;
      } else if (option.required) {
        ui.write('The specified command ' + chalk.green(commandName) +
                 ' requires the option ' + chalk.green(option.name) + '.\n');
        return false;
      }
    } else {
      commandOptions[option.key] = parsedOptions[option.name];
    }
    return true;
  };

  if (this.works === 'insideProject') {
    if (!this.isWithinProject) {
      this.ui.write('You have to be inside an ember-cli project in order to use ' +
               'the ' + chalk.green(this.name) + ' command.\n');
      return null;
    }
  }

  if (this.works === 'outsideProject') {
    if (this.isWithinProject) {
      this.ui.write('You cannot use the '+  chalk.green(this.name) +
               ' command inside an ember-cli project.\n');
      return null;
    }
  }

  this.availableOptions.forEach(function(option) {
    knownOpts[option.name] = option.type;
  });

  parsedOptions = nopt(knownOpts, {}, commandArgs, 0);

  if (!this.availableOptions.every(assembleAndValidateOption)) {
    return null;
  }

  this.parsedArgs = parsedOptions;
};

Command.prototype.isValid = function(/* parsedArgs */) {
  return true;
};

Command.prototype.run = function(commandArgs) {
  throw new Error('command must implement run' + commandArgs.toString());
};

Command.prototype.usageInstructions = function() {
  var docs = this._usageInstructions();

  if (typeof docs === 'string') {
    return docs;
  } else {
    var output = 'ember ' + this.name;

    if (docs && docs.anonymousOptions) {
      output += ' ' + chalk.yellow(docs.anonymousOptions);
    }

    if (this.availableOptions.length > 0) {
      output += chalk.yellow(' <options...>');
    }

    output += '\n';

    if (this.description) {
      output += '  ' + this.description + '\n';
    }

    if (this.availableOptions.length > 0) {
      this.availableOptions.forEach(function(option) {
        output += chalk.cyan('  --' + option.name);

        if (option.required) {
          output += chalk.cyan(' (Required)');
        }

        if (option.default !== undefined) {
          output += chalk.cyan(' (Default: ' + option.default + ')');
        }

        if (option.description) {
          output += ' ' + option.description;
        }

        output += '\n';
      });
    }

    return output;
  }
};
