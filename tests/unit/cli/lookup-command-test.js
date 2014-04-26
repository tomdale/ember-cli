'use strict';
/*jshint expr: true*/

var expect         = require('chai').expect;
var lookupCommand  = require('../../../lib/cli/lookup-command');
var Command  = require('../../../lib/models/command');
var through        = require('through');
var UI             = require('../../../lib/ui');

var commands = {
  serve: new Command({
    name: 'serve',
    aliases: ['s'],
    works: 'everywhere',
    availableOptions: [
      { name: 'port', key: 'port', type: Number, default: 4200, required: true }
    ],
    run: function() {},
    usageInstructions: function() {}
  })
};

describe('cli/lookup-command.js', function() {
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

  it('lookupCommand() should find commands by name and aliases.', function() {
    // Valid commands

    expect(lookupCommand(commands, 'serve')).to.exist;
    expect(lookupCommand(commands, 's')).to.exist;
  });
  it('lookupCommand() should return UnknownCommand object when command name is not present.', function() {
    var command = lookupCommand(commands, 'something-else');
    command.ui = ui;
    command.validateAndRun([]);
    expect(output.shift()).to.match(/command.*something-else.*is invalid/);
  });
});
