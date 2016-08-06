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

    event: function(key, value, success, error) {
    	exec(success, error, "Firebase", "event", [key, value]);
	},

    exception: function(message, success, error) {
        exec(success, error, "Firebase", "exception", [message]);
    },

    getInstanceId: function(success, error) {
        exec(success, error, "Firebase", "getInstanceId", []);
    }

};

module.exports = Firebase;