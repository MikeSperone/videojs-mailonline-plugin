'use strict';

var blackPosterFactory = require('./black-poster');

var Component = videojs.getComponent('Component');
var blackPosterComponent = blackPosterFactory(Component);
var BlackPoster = videojs.extend(Component, blackPosterComponent);
videojs.registerComponent('BlackPoster', BlackPoster);
