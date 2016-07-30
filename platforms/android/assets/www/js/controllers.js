'use strict';

/* Controllers */

/* Controllers */
angular.module('chitkalu.controllers', [])

.controller('HomeCtrl', function(Category, /* Storage, TipList, */ $location, $rootScope, $log) {
  this.categories = Category.getCategories();

/*	
  this.tipcount =  TipList.getTipCount();

  this.refresh = function() {
    this.tipcount =  TipList.getTipCount(); 
    $log.debug("Count Refreshed");   
  };

  this.clearStorage = function() {
    Storage.clearStorage();
    this.refresh();
  };

  this.updateStorage = function() {
    this.syncStorage();
  };

  //Method to take to recipie listing
	this.article = function (catId) {        
    	var newpath = "/tips/" + catId;
    	$location.path(newpath); 
  };  

  this.syncStorage = function() {
    console.time("Remote Tips Sync");
    $rootScope.syncing = true;
    var syncPromise = Storage.sync();
    syncPromise.then(function(success) {
      $log.debug("Success Response : " + success);
      console.timeEnd("Remote Tips Sync");
      $rootScope.syncing = false;
      $rootScope.synced = true;
      navigator.splashscreen.hide();
    }, function(failure) {
      $log.debug("Failure Response : " + failure);
      console.timeEnd("Remote Tips Sync");
      $rootScope.syncing = false;
      $rootScope.syncfail = true;
      navigator.splashscreen.hide();
    }, function(update) {
      $log.debug("Update Response : " + update);
    });
  }

	//Sync Tips from Server
	if(!$rootScope.synced) {
    Storage.checkDataVersion();
    this.syncStorage();
	}

	/*
	//Show Home Page
	$scope.displayView = function () {    

		$scope.screen = "HOME";
		$scope.title = "TITLE";

		if($rootScope.tab == 2) { 
			$scope.displayCategories();
		} else if ($rootScope.tab == 3) {
			$scope.favourite = Article.collectFavourites();	
		} else if ($rootScope.tab == 1) {
			$scope.newtips = Article.collectNewTips();
		} 	
	}; 
	
	$scope.loadTip = function () {       
		console.log('Take to Tip => ' + this.tipId);
	};	

	//Display Unread Articles View
	$scope.unreadView = function() {
		$scope.newtips = Article.collectNewTips();
		$rootScope.tab = 1;
    };

	//Display Articles Category
	$scope.ctgryView = function() {
		$scope.displayCategories();
		$rootScope.tab = 2;
    };

	//Display Favourite Articles
	$scope.favouriteView = function() {
		$scope.favourite = Article.collectFavourites();
		//console.log("Favourites : " + $scope.favourite.length);
		$rootScope.tab = 3;
    };
	*/
})


/*
telegutipsControllers.controller('HomeCtrl', ['$scope', 'ArticleService',  'CategoryService', 'StorageService', '$rootScope',
  function($scope, Article, categoryService, StorageService, $rootScope) {


	//Show Home Page
	$scope.displayView = function () {    

		$scope.screen = "HOME";
		$scope.title = "TITLE";

		if($rootScope.tab == 2) { 
			$scope.displayCategories();
		} else if ($rootScope.tab == 3) {
			$scope.favourite = Article.collectFavourites();	
		} else if ($rootScope.tab == 1) {
			$scope.newtips = Article.collectNewTips();
		} 	
	}; 

	//Show or Hide Menu
	$scope.showMenu = function () {       
		if($("#menu").is(":visible")) {
			hidePopup();
		} else {
			$("#menu").show(300);
			$("#setting").hide();
		}
	};	

	//Show or Hide Setting
	$scope.showSetting = function () {       
		if($("#setting").is(":visible")) {
			hidePopup();
		} else {
			$("#setting").show(300);
			$("#menu").hide();
		}
	};	


	//Display Unread Articles View
	$scope.unreadView = function() {
		$scope.newtips = Article.collectNewTips();
		//console.log('Unread Array Size : ' + _.size($scope.newtips));
		$rootScope.tab = 1;
    };

	//Display Articles Category
	$scope.ctgryView = function() {
		$scope.displayCategories();
		$rootScope.tab = 2;
    };

	//Display Favourite Articles
	$scope.favouriteView = function() {
		$scope.favourite = Article.collectFavourites();
		//console.log("Favourites : " + $scope.favourite.length);
		$rootScope.tab = 3;

    };

	//Show Home Page
	$scope.displayCategories = function () {    

		var promise =  categoryService.collectCategories();
		promise.then (
  			function(data) {
			 	$scope.categories = data.categories;
			 	//console.log("Data Collected " + JSON.stringify(data));
  			},
  			function(error) {
  				//FIXME - Display Error
    			console.log('No Categories Found.');
  			});
	}; 
	
	$scope.loadTip = function () {       
		console.log('Take to Tip => ' + this.tipId);
	};	

	$scope.refresh = function () {
		$scope.displayCategories();	
	}  

	//Set Default Tab to Category Listing
	if(!$rootScope.tab) {
		$rootScope.tab = 2;
	} 

	//Sync Local Data
	if(!$rootScope.synced) {
		//console.log("Requesting for Sync");
		StorageService.syncDate();
		$rootScope.synced = true;
	}


	//Show Home
	$scope.displayView();

  }]
);

//Controller To Load Tips
telegutipsControllers.controller('ListTipsCtrl', ['$scope', 'ArticleService', 'CategoryService', '$routeParams',
  function($scope, Article, Category, $routeParams) {
	$scope.displayTips = function () {
		var categoryId = $routeParams.cat;
		
		//console.log("Tip Category : " + categoryId);
		var ctgry = Category.collectCategory(categoryId);
		if(ctgry) {
			window.analytics.trackView(ctgry.code);
			//console.log("Category : " + JSON.stringify(ctgry));
		}

		var tips = Article.fetchArticlesByCategory(categoryId);
		if (tips === undefined || tips === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Message
		} else {
			$scope.tips = tips;
		}
		$scope.category = ctgry;
		//UI Changes 
		//$("#main-title").text(ctgry.ctgryname);
		hidePopup();
	}
	
	//Loading the Tips
	$scope.displayTips();
}]);

telegutipsControllers.controller('TipCtrl', ['$scope', '$routeParams', 'StorageService', 'ArticleService', 'FavouriteService', '$http', '$location', '$interval',
  function($scope, $routeParams, Storage, Article, Favourite, $http, $location, $interval) {
	$scope.loadTip = function () {       
		var tipID =  $routeParams.id;
		//console.log("Load Tip : " + tipID);
	}	

	//Add tip to favourite
	$scope.favourite = function ($event, tip) {
		Favourite.addTip(tip.id);
		$scope.tip.favourite = true;
	};

	//Remove tip from favourite
	$scope.unfavourite = function ($event, tip) {         
		Favourite.removeTip(tip.id);
		$scope.tip.favourite = false;
	};

	//Collecting the details of the tip
	$scope.loadTip();
}]);

//Controller to display Tip Details
telegutipsControllers.controller('CategoryTipCtrl', ['$scope', '$routeParams', 'ArticleService', 'CategoryService', 'FavouriteService', 'StorageService', '$sce', '$http', '$location',
	function($scope, $routeParams, Article, Category, Favourite, Storage, $sce, $http, $location) {

	var appURL = "https://play.google.com/store/apps/details?id=com.smart.droid.telegu.tips";

	$scope.displaySelectedTip = function() {
		showInterstitial();
		var categoryId = $routeParams.cat;
		var idx = $routeParams.index;
		var tipid = $routeParams.id;
		if(tipid != undefined)  {
			//console.log("Display favourite tip detail : " + tipid);	
			$scope.displaySelectedTipDetail(tipid);
		} else {
			$scope.index = idx;
			$scope.categoryId = categoryId;
			$scope.displayTipDetail();
		}	
	}

	//Method to display selected tip detail
	$scope.displaySelectedTipDetail = function (tipid) {        
		var tip = Article.collectArticleByTipId(parseInt(tipid));
		//console.log("Tip Detail : " + tip);
		if(tip === undefined || tip == null) {
			$http.get('http://telugu.tips2stayhealthy.com/?json=y&id=' + tipid).
	    	    success(function(data) {
	    	    	//console.log("JSON Data : " + JSON.stringify(data));	
	    	    	if (!angular.isUndefined(data.tips) && data.tips.length > 0) {
	    	    		window.analytics.trackView("Notification - Remote Tip Viewed");
						var remoteTip = data.tips[0];
						remoteTip.poition = 0;
	            		$scope.tip = remoteTip;
	            		Storage.updateRead(remoteTip.id);
	            	} else {
	            		//console.log("JSON Data : " + JSON.stringify(data));
	            		$location.path('/home');  
	            	}
	    		})		
	    } else {
	    	tip.position = 0;
			$scope.tip = tip;
			window.analytics.trackView("Notification - Internal Tip Viewed");
			Storage.updateRead(tip.id);
		}	
	}	

	//Method to display tip detail
	$scope.displayTipDetail = function () {         
		var ctgry = Category.collectCategory($scope.categoryId);
		var tip = Article.collectArticle($scope.categoryId, $scope.index);
		if (tip === undefined || tip === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Error Message
		} else {
			//console.log(tip.content);
			tip.contentHtml = $sce.trustAsHtml(tip.content);
			$scope.tip = tip;
			window.analytics.trackView(ctgry.code + " Tip View");
		}
		$scope.category = ctgry;
		$scope.size = tip.size;
		//showInterstitial();
		hidePopup();
	}

	$scope.share = function ($event, tip) {         
		//console.log('Gesture ' + $event.type + ' - tip ' + JSON.stringify(tip));
		window.plugins.socialsharing.share('\n Download Telugu Tips App https://play.google.com/store/apps/details?id=com.smart.droid.telegu.tips', tip.title + ' Read More - ' + tip.link)
	};

	//Older Article  
	$scope.older = function () {
		$scope.index = ($scope.index < $scope.size) ? ++$scope.index : $scope.size;
		$scope.displayTipDetail();
	};

	//Newer Article  
	$scope.newer = function () {
		$scope.index = ($scope.index > 0) ? --$scope.index : 0;
		$scope.displayTipDetail();
	};

	$scope.share = function ($event, tip) {         
		//console.log('Gesture ' + $event.type + ' - tip ' + JSON.stringify(tip));
		window.plugins.socialsharing.share('\n Download Telugu Tips App https://play.google.com/store/apps/details?id=com.smart.droid.telegu.tips', tip.title + ' Read More - ' + tip.link)
	};

	//Add tip to favourite
	$scope.favourite = function ($event, tip) {
		Favourite.addTip(tip.id);
		$scope.tip.favourite = true;
	};

	//Remove tip from favourite
	$scope.unfavourite = function ($event, tip) {         
		Favourite.removeTip(tip.id);
		$scope.tip.favourite = false;
	};

	//Show or Hide Share Menu
	$scope.showShareMenu = function () {       
		if($("#share_menu").is(":visible")) {
			$("#share_menu").hide();
		} else {
			$("#share_menu").show(300);
		}
	};	


	//Share Via Whatsapp
	$scope.shareViaWhatsapp = function() {
		//console.log("Share Via Whatsapp");
		$("#share_menu").hide();
		navigator.screenshot.URI(function(error,res) {
	  		if(error){
	    		console.error(error);
	  		} else {
	  			//console.log(res.URI);
	  			window.analytics.trackEvent('Share', 'Whatsapp', 'Tip', $scope.tip.id)
	  			window.plugins.socialsharing.shareViaWhatsApp("Telugu Tips - " + $scope.tip.title, res.URI, appURL, function() {}, function(errormsg){alert(errormsg) });
	  		}}, 50);
	};

	//Share Via Facebook
	$scope.shareViaFacebook = function() {
		//console.log("Share Via Facebook");	 
		$("#share_menu").hide();
		navigator.screenshot.URI(function(error,res) {
	  		if(error){
	    		console.error(error);
	  		} else {
	  			//console.log(res.URI);
	  			window.analytics.trackEvent('Share', 'Facebook', 'Tip', $scope.tip.id)
	  			window.plugins.socialsharing.shareViaFacebook("Telugu Tips - " + $scope.tip.title, res.URI, appURL, function() { }, function(errormsg){alert(errormsg) });
	  		}}, 50);
	};

	//Share Via Facebook
	$scope.shareViaTwitter = function() {
		//console.log("Share Via Twitter");	 
		$("#share_menu").hide();
		navigator.screenshot.URI(function(error,res) {
	  		if(error){
	    		console.error(error);
	  		} else {
	  			//console.log(res.URI);
	  			window.analytics.trackEvent('Share', 'Twitter', 'Tip', $scope.tip.id)
	  			window.plugins.socialsharing.shareViaTwitter("Telugu Tips - " + $scope.tip.title, res.URI, appURL, function() { }, function(errormsg){alert(errormsg) });
	  		}}, 50);
	};


	//Loading the Tips
	$scope.displaySelectedTip();

}]);	
*/

