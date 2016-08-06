var testDevice = 'b479b2f557b8eea7##';
var analyticsId = 'UA-71910213-5';
var GCMSenderId = '902409539351';
var interDisplayed = false;
//08022016
var platformios = "ios";
var platformand = "android";

var C_URL = 'http://telugu.tips2stayhealthy.com/?json=y';
var C_WEB_URL = 'http://telugu.tips2stayhealthy.com/';
var C_KEY_TIPS = "tips";
var C_CACHE_TIPS = "cache_tips";
var C_KEY_SYNCTIME =  "sync_time";
var C_KEY_DATAVERSION =  "data_version";
var C_CACHE_LIST = "cache-list-tips";
var C_KEY_FAVOURITE =  "favourite";
var C_DATA_VERSION = 2;

var C_APP_WHATSAPP =  "whatsapp";

// select the right Ad Id according to platform 
var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos 
	platform = platformand;
	admobid = {
		banner: 'ca-app-pub-8439744074965483/8900243253', 
		interstitial: 'ca-app-pub-8439744074965483/7423510059'
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios 
	platform = platformios;
	admobid = {
		banner: 'ca-app-pub-8439744074965483/2445856051', 
		interstitial: 'ca-app-pub-8439744074965483/8352788855'
	};
} 

//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {

	// Manage Ad
	initializeAd();

	//Initialize for Firebase Cloud Messaging
  	initializeFCM();

	//Offset Topd Margin for IOS
	offsetTop();
}

//Disclaimer
function disclaimer() {
	hidePopup();
	//showOverlay();
    $("#disclaimer").dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });	
}

//Load Initial Tips
function loadInitialTips() {
	var fileURL =  "files/initial-tips.json";
	var message = "Loading Initial Tips...";
	jQuery.getJSON(fileURL, function (data) {
		console.log( "Loading Initial Tips..");
	}).done(function(data) {
		window.localStorage.setItem("sync_time", data.time);
		window.localStorage.setItem("tips", JSON.stringify(data.tips));
		var element = angular.element($("#main"));
		element.scope().refresh();
		element.scope().$apply();
		downloadLatestTips();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.log("Show Error Message - " + textStatus);
	}).always(function() {
	});
}

// Function to download latest Tips JSON
function downloadLatestTips() {
	var message = "Synchronizing Latest Tips...";
	var fileTransfer = new FileTransfer();
	var uri = encodeURI("http://telugu.tips2stayhealthy.com/?json=y");
	var lastSyncTime = window.localStorage.getItem("sync_time");
	if(lastSyncTime) {
		uri = encodeURI("http://telugu.tips2stayhealthy.com/?json=y&ts=" + lastSyncTime);
	} 
	var fileURL = cordova.file.cacheDirectory + "/tips.json";
	//console.log("Download URL : " + uri);
	//ActivityIndicator.show(message);
	fileTransfer.download(uri, fileURL, function (entry) {
		//console.log("download complete: " + entry.toURL());
		//ActivityIndicator.hide();
		syncLocalStorage(fileURL);
	}, function (error) {
		console.log("download error source " + error.source);
		console.log("download error target " + error.target);
		console.log("Download Error : " + error.code + " - " + error.exception);
		console.log("http_status " + error.http_status);
		//ActivityIndicator.hide();
	},false);
}

//Sync Temp JSON
function syncLocalStorage(file) {
	//console.log("Temp JSON URL : " + file);
	jQuery.getJSON(file, function (data) {
		if (!angular.isUndefined(data)) {
			var localTips =  window.localStorage.getItem("tips");
			var localJSON = JSON.parse(localTips);
			var newJSON = [];
			//console.log("Initial Array Size : " + _.size(localJSON));
			$.each(data.tips, function(key, item) {
				//console.log(key + " - " + JSON.stringify(item));
				var newTip = false;
				_.find(localJSON,function(rw, rwIdx) { 
					if(rw.id == item.id) { 
						newTip = true; return true;
					}; 
				});
				//If new tip
				if(!newTip) {
					//console.log("New Object for : " + key + " - " + JSON.stringify(item));
					//console.log("Array Size : " + _.size(localJSON));
					localJSON.push(item);
					newJSON.push(item);
					//console.log("Modified Array Size : " + _.size(localJSON));
				} 
			});
			//console.log("New Array Size : " + _.size(newJSON));
			//console.log("Modified Array Size : " + _.size(localJSON));
			window.localStorage.setItem("tips", JSON.stringify(localJSON));
			var modifiedTime = data.time;
			if(typeof modifiedTime != 'undefined') {
				window.localStorage.setItem("sync_time", data.time);
			}
		}	
		//var element = angular.element($("#main"));
		//element.scope().collectStatistics();
		//element.scope().$apply();
		//console.log("Hide Indicator on download complete");
		//ActivityIndicator.hide();
	}).fail(function () {
		console.log("Show Error Message");
		//ActivityIndicator.hide();
	}).always(function () {
		//ActivityIndicator.hide();
	});
}

//Exit Implementation
document.addEventListener("backbutton", function() {
	if ( $('.ui-page-active').attr('id') == 'main') {
		exitAppPopup();
	} else {
		history.back();             
	}
}, false);

function exitAppPopup() {
    navigator.notification.confirm(
          'Exit Telugu Tips'
        , function(button) {
              if (button == 2) {
                  navigator.app.exitApp();
              } 
          }
        , 'Exit'
        , 'No,Yes'
    );  
    return false;
}

/* Ad initialization & display */

function initializeAd() {
  createBanner();
  prepareInter();
}

function createBanner() {
  var testFlag = isTestDevice();

  if(AdMob) AdMob.createBanner( {
    adId: admobid.banner, 
    position: AdMob.AD_POSITION.BOTTOM_CENTER, 
    autoShow: true, 
    isTesting: testFlag  
  } );
}

function prepareInter() {
  var testFlag = isTestDevice();
  if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false, isTesting: testFlag} );
}

function isTestDevice() {
	console.log("Test Device : " + device.uuid);
    var flgTestDevice = false;
    var deviceUUID = device.uuid;
    if(deviceUUID == testDevice) {
      console.log("Test Device : " + device.uuid);
      flgTestDevice = true;
    }
    //flgTestDevice = false;
    return flgTestDevice;
}

//Load AdMob Interstitial Ad
function showInterstitial() {
  if(interDisplayed > 2) {
    if(AdMob) {
      AdMob.showInterstitial();
      interDisplayed = 0;
    } 
  } else {
    interDisplayed = interDisplayed + 1;
    //console.log("Interstitial Displayed : " + interDisplayed);
  }    
}

function onInterstitialReceive (message) {
    //alert(message.type + " ,you can show it now");
    //admob.showInterstitial();//show it when received
}

function onReceiveFail (message) {
 	var msg=admob.Error[message.data];
    if(msg==undefined){
       msg=message.data;
    }
    //console.log("load fail: " + message.type + "  " + msg);
} 
//08022016
document.addEventListener("onAdDismiss", function(data) {
	//alert("Interstitial Ad Dismissed ");
	//console.log("Interstitial Ad Dismissed : " + data.adType);
	if (data.adType == 'interstitial') {
		//alert("Ad interstitial Dismiss");
		if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
	}
});
function showOverlay() {
	var overlay = jQuery('<div id="overlay"> </div>');
	overlay.appendTo(document.body);
}

function removeOverlay() {
    $("#overlay").remove();
}

//Offset Top Margin for IOS
function offsetTop() {
	var platform = device.platform;
	//console.log('Paltform : ' +  platform);
    if(platform === platformios && parseFloat(window.device.version) >= 7.0) {
        //console.log('Margin Top : ' +  document.body.style.marginTop);
        document.body.style.marginTop = "20px";
    }

	if(platform === platformios) {
		//$("#right-menu-cntrl").hide();
		//$("#setting-cntrl").hide();
    }	
}

//Initialize Firebase Clould Messaging
function initializeFCM() {
  window.Firebase.getInstanceId(successHandlerFCM, errorHandlerFCM, {});
}

//Success Handler for FCM Resgistration
function successHandlerFCM(result) {
  console.log("FCM Successfully Registered. Token: " + result);
}

//Failure Handler for FCM Resgistration
function errorHandlerFCM(error) {
	//FIXME - Firebase Analytics
  console.log("FCM Registration Error: " + error);
}

//GCM Notification Recieved
function onNotification(id) {
  //console.log("Event Received: " + id); 
  if(!isNaN(id)) {
      //FIXME - Track in Firebase
      //window.analytics.trackEvent('GCM', 'New Tip', 'Tip - ' + id)
      var landingPath = "#/tip/" + id;
      window.location = landingPath;
  }
}
