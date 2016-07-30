cordova.define("cordova-plugin-smart-firebase.Firebase", function(require, exports, module) {
"use strict";

var exec = require("cordova/exec");

var Firebase = {

    /*
    register : function (onSuccess, onError, options) {
        cordova.exec( onSuccess, onError, "GCMPush", "register", [options]);
    },

    unregister: function (onSuccess, onError) {
        cordova.exec( onSuccess, onError, "GCMPush", "unregister", []);
    }
    */

    trackEvent: function(key, value, success, error) {
    	exec(success, error, "Firebase", "trackEvent", [key, value]);
	},

    getInstanceId: function(success, error) {
        exec(success, error, "Firebase", "getInstanceId", []);
    }

};

module.exports = Firebase;
});
