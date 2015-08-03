//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {
	//console.log(cordova.file);
	//console.log(FileTransfer);
	var lastSyncTime = window.localStorage.getItem("sync_time");
	if (lastSyncTime) {
		downloadLatestTips();
	} else {
		loadInitialTips();	
	}

	// Manage Ad
	//initializeAd();
	
	//Handle Menu 
	$( "#menu-cntrl" ).click(function() {
		if($("#menu").is(":visible")) {
			hidePopup();
			//$("#menu").hide(200);
		} else {
			$("#menu").show(300);
			$("#setting").hide(200);
		}
	});

	//Handle Menu 
	$( "#setting-cntrl" ).click(function() {
		if($("#setting").is(":visible")) {
			hidePopup();	
			//$("#setting").hide(200);
		} else {
			$("#setting").show(300);
			$("#menu").hide(200);
		}
	});


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
						/* console.log("Replace Existing Object for : " + rw.id); */
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


function initializeAd() {

	admob.initAdmob("ca-app-pub-8439744074965483/8900243253","ca-app-pub-8439744074965483/7423510059");
    document.addEventListener(admob.Event.onInterstitialReceive, onInterstitialReceive, false);
    document.addEventListener(admob.Event.onInterstitialFailedReceive,onReceiveFail, false);
    document.addEventListener(admob.Event.onBannerFailedReceive,onReceiveFail, false);

    admob.showBanner(admob.BannerSize.BANNER, admob.Position.BOTTOM_CENTER, null);

    admob.cacheInterstitial();

}

//Load AdMob Interstitial Ad
function showInterstitial(){
    admob.isInterstitialReady(function(isReady){
        if(isReady){
            admob.showInterstitial();
        }
    });
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


function showBannerAd() {
	//show banner at the bottom center
	if(typeof admob !== "undefined") {
		admob.showBanner(admob.BannerSize.BANNER, admob.Position.BOTTOM_CENTER, null);
	}	
}

function hideBannerAd() {
	//show banner at the bottom center
	if(admob) {
		admob.hideBanner();
	}	
}
