var testDevice = '9ff99ad5ec042ed6';
var analyticsId = 'UA-71910213-5';
var GCMSenderId = '902409539351';
var interDisplayed = false;

// select the right Ad Id according to platform 
var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos 
	admobid = {
		banner: 'ca-app-pub-8439744074965483/8900243253', 
		interstitial: 'ca-app-pub-8439744074965483/7423510059'
    };
} 

//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {

	window.analytics.startTrackerWithId(analyticsId);
	
	//console.log(cordova.file);
	//console.log(FileTransfer);

	// Manage Ad
	initializeAd();

    //Initialize for Google Cloud Messaging
    initializeGCM();


}

function hidePopup() {
	hideMenu();
	hideSetting();
}

function hideMenu() {
	$("#menu").hide(200);
}

function hideSetting() {
	$("#setting").hide(200);
}


//Share the app link with user
function share() {
	window.plugins.socialsharing.share('Try this great Telugu App - ', 'Telugu Tips',null,'https://play.google.com/store/apps/details?id=com.smart.droid.telegu.tips');
	hidePopup();
}

//Provide Feedback
function feedback() {
	window.plugin.email.open({
		to:      ['tips2stayhealthy@gmail.com'],
		subject: 'Feedback on Telugu Tips',
		body:    '',
		isHtml:  true
	});
	hidePopup();
}

//Rate App
function rate() {
	var version = device.platform;
	hidePopup();
	if(version == "Android") {
		var url = "market://details?id=com.smart.droid.telegu.tips";
        window.open(url,"_system");		
	} else {
		//var url = "https://play.google.com/store/apps/details?id=com.smart.droid.telugu.tips"
	}
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

/*
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
*/

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


function initializeAd() {

	if(!isTestDevice()) {
		if(AdMob) AdMob.createBanner( {
			adId: admobid.banner, 
			position: AdMob.AD_POSITION.BOTTOM_CENTER, 
			autoShow: true 
		} );
	}
			
	// preppare and load ad resource in background, e.g. at begining of game level 
	if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

}

function isTestDevice() {
    var flgTestDevice = false;
    var deviceUUID = device.uuid;
    if(deviceUUID == testDevice) {
      //console.log("Test Device : " + device.uuid);
      flgTestDevice = true;
    }
    //flgTestDevice = false;
    return flgTestDevice;
}

//Load AdMob Interstitial Ad
function showInterstitial() {
	if(!isTestDevice() && !interDisplayed) {
		if(AdMob) {
			AdMob.showInterstitial();
			interDisplayed = true;
		}	
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


//Initialize Google Clould Messaging
function initializeGCM() {
  window.GCMPush.register(successHandlerGCM, errorHandlerGCM, {
      "senderId" : GCMSenderId,
      "jsCallback" : "onNotification"
  });

}

//Success Handler for GCM Resgistration
function successHandlerGCM(result) {
  //console.log("GCM Successfully Registered. Token: " + result.gcm);
}

//Failure Handler for GCM Resgistration
function errorHandlerGCM(error) {
  console.log("GCM Registration Error: " + error);
}

//GCM Notification Recieved
function onNotification(id) {
  //console.log("Event Received: " + id);  
  if(!isNaN(id)) {
    //console.log("Go to quote : " + id);
    var landingPath = "#/tip/" + id;
    window.location = landingPath;
  }  
}



