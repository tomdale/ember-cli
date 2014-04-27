'use strict';

var assert          = require('../../helpers/assert');
var MockUI          = require('../../helpers/mock-ui');
var MockAnalytics   = require('../../helpers/mock-analytics');
var rewire          = require('rewire');
var stubPath        = require('../../helpers/stub').stubPath;
var InitCommand;

describe('init command', function() {
  var ui;
  var analytics;

  before(function() {
    ui = new MockUI();
    analytics = new MockAnalytics();
    InitCommand = rewire('../../../lib/commands/init');
    InitCommand.__set__('path', stubPath('test'));
  });

  it('doesn\'t allow to create an application named `test`', function() {
    assert.throw(function() {
      new InitCommand({
        ui: ui,
        analytics: analytics
      }).validateAndRun([]);
    }, undefined);

    assert.equal(ui.output, 'Due to an issue with `compileES6` an application name of `test` cannot be used.');
  });
});
