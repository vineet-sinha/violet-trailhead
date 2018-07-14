'use strict';

var violetSrvr = require('violet/lib/violetSrvr')('/alexa');
violetSrvr.listAppsAt('/');
var srvrInstance = violetSrvr.createAndListen(process.env.PORT || 8080);

violetSrvr.loadScript('gameNight.js', 'trailhead');


console.log('Waiting for requests...');
