'use strict';

var assert        = require('../../helpers/assert');
var stub          = require('../../helpers/stub').stub;
var MockUI        = require('../../helpers/mock-ui');
var MockAnalytics = require('../../helpers/mock-analytics');
var ServeCommand;
var tasks;

describe('server command', function() {
  var ui;
  var analytics;

  before(function() {
    ServeCommand = require('../../../lib/commands/serve');
    ui = new MockUI();
    analytics = new MockAnalytics();
    tasks = {
      serve: {
        run: function() { }
      }
    };

    stub(tasks.serve, 'run');
  });

  after(function() {
    ServeCommand = null;
  });

  it('has correct options', function() {
    new ServeCommand({
      ui: ui,
      analytics: analytics,
      tasks: tasks,
      isWithinProject: true
    }).validateAndRun(['--port', '4000']);

    var serveRun = tasks.serve.run;
    var options = serveRun.calledWith[0][0];

    assert.equal(serveRun.called, 1, 'expected run to be called once');

    assert.equal(options.port,           4000,      'has correct port');
    assert.equal(options.liveReloadPort, 35529,     'has correct liveReload port');
  });
});
