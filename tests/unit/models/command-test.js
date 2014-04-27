'use strict';
/*jshint expr: true*/

var expect         = require('chai').expect;
var UI             = require('../../../lib/ui');
var through        = require('through');
var Command        = require('../../../lib/models/command');

var serveCommand = new Command.extend({
  name: 'serve',
  aliases: ['s'],
  works: 'everywhere',
  availableOptions: [
    { name: 'port', key: 'port', type: Number, default: 4200, required: true }
  ],
  run: function() {},
  usageInstructions: function() {}
});

var developEmberCLICommand = new Command.extend({
  name: 'develop-ember-cli',
  works: 'everywhere',
  availableOptions: [
    { name: 'package-name', key: 'packageName', type: String, required: true }
  ],
  run: function() {},
  usageInstructions: function() {}
});

var insideProjectCommand = new Command.extend({
  name: 'inside-project',
  works: 'insideProject',
  run: function() {},
  usageInstructions: function() {}
});

var outsideProjectCommand = new Command.extend({
  name: 'outside-project',
  works: 'outsideProject',
  run: function() {},
  usageInstructions: function() {}
});

describe('models/command.js', function() {
  var output;
  var ui;

  before(function(){
    output = [];

    ui = new UI({
      inputStream: through(),
      outputStream: through(function(data) {
        output.push(data);
      })
    });
  });

  it('parseArgs() should parse the command options.', function() {
    expect(serveCommand.parseArgs(['--port', '80']).commandOptions).to.include({
      port: 80
    });
  });

  it('parseArgs() should find abbreviated command options.', function() {
    expect(serveCommand.parseArgs(['s', '-p', '80']).parsedArgs).to.include({
      port: 80
    });
  });

  it('parseArgs() should set default option values.', function() {
    expect(serveCommand.parseArgs([]).parsedArgs).to.include({
      port: 4200
    });
  });

  it('validateAndRun() should print a message if a required option is missing.', function() {
    developEmberCLICommand.validateAndRun([]);
    expect(output.shift()).to.match(/requires the option.*package-name/);
  });

  it('validateAndRun() should print a message if outside a project and command is not valid there.', function() {
    insideProjectCommand.ui = ui;
    insideProjectCommand.isWithinProject = false;
    insideProjectCommand.validateAndRun([]);
    expect(output.shift()).to.match(/You cannot use.*inside an ember-cli project/);
  });

  it('validateAndRun() should print a message if inside a project and command is not valid there.', function() {
    outsideProjectCommand.ui = ui;
    outsideProjectCommand.isWithinProject = true;
    outsideProjectCommand.validateAndRun([]);
    expect(output.shift()).to.match(/You cannot use.*inside an ember-cli project/);
  });
});
