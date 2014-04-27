'use strict';

var NewCommand;
var assert = require('../../helpers/assert');
var MockUI = require('../../helpers/mock-ui');
var MockAnalytics = require('../../helpers/mock-analytics');
var rewire = require('rewire');

describe('new command', function() {
  var ui;
  var analytics;

  before(function() {
    NewCommand = rewire('../../../lib/commands/new');
    ui = new MockUI();
    analytics = new MockAnalytics();
  });

  after(function() {
    NewCommand = null;
  });

  it('doesn\'t allow to create an application named `test`', function() {
    assert.throw(function() {
      new NewCommand({
        ui: ui,
        analytics: analytics
      }).validateAndRun(['test']);
    }, undefined);

    assert.equal(ui.output, 'Due to an issue with `compileES6` an application name of `test` cannot be used.');
  });
});
