'use strict';

var assign  = require('lodash-node/modern/objects/assign');
var Command = require('../models/command');

module.exports = Command.extend({
  aliases: ['server', 's'],

  availableOptions: [
    { name: 'port', type: Number, default: 4200 },
    { name: 'host', type: String, default: '0.0.0.0' },
    { name: 'proxy-port',  type: Number },
    { name: 'proxy-host',  type: String },
    { name: 'environment', type: String, default: 'development' }
  ],

  run: function(options) {
    options = assign({}, options, {
      liveReloadPort: options.port - 4200 + 35729
    });

    var serve = this.tasks.serve;

    serve.ui = this.ui;
    serve.analytics = this.analytics;

    return serve.run(options);
  }
});
