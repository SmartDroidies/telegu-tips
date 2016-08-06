'use strict';

/* Controllers */

/* Controllers */
angular.module('chitkalu.controllers', [])

.controller('HomeCtrl', function(Category, Storage, TipList, $location, $rootScope, $log) {
  this.categories = Category.getCategories();
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
      //navigator.splashscreen.hide();
    }, function(failure) {
      $log.debug("Failure Response : " + failure);
      console.timeEnd("Remote Tips Sync");
      $rootScope.syncing = false;
      $rootScope.syncfail = true;
      //navigator.splashscreen.hide();
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
.controller('TipsCtrl', function($routeParams, $log, $scope, $mdToast, $rootScope, $location, $anchorScroll, TipList) {


    // Create Tips model using a class - implement getItemAtIndex and getLength.
    var Tips = function(tips) {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 50;

      this.fetchNumItems_(tips);

      this.tips = tips;

    };

    // Required.
    Tips.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    Tips.prototype.getLength = function() {
      return this.numItems;
    };

    Tips.prototype.fetchPage_ = function(pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;
      var pageOffset = pageNumber * this.PAGE_SIZE;

      //$log.debug("Page Number : " + pageNumber);
      //$log.debug("Page Size : " + this.PAGE_SIZE);
      //$log.debug("Page Offset : " + pageOffset);
      //$log.debug("Total Count : " + _.size(this.tips));

      this.loadedPages[pageNumber] = this.tips.slice(pageOffset, pageOffset + this.PAGE_SIZE);

    };

    Tips.prototype.fetchNumItems_ = function(tips) {
      //$log.debug("Item Count : " + _.size(tips));
      this.numItems = _.size(tips);
    };

    // Display Tips
    this.displayTips = function (catId, favmode, searchtext) {

      window.Firebase.trackEvent("Category Tips Listing", catId);
      var tempTips = TipList.getTips(catId, favmode, searchtext);
      //Store the latest recipie list for navigation
      TipList.storeTempTips(tempTips);
      this.tips = new Tips(tempTips);
    } 

    //List only favourites
    this.viewFavourites = function () {  
      //this.favourites = true;      
      $rootScope.favourites = true;
      this.displayTips(this.categoryId, $rootScope.favourites);
      $mdToast.show($mdToast.simple().textContent('Entered favourites mode'));
    }  

    //List all tips
    this.viewAll = function () {        
      //this.favourites = false;      
      $rootScope.favourites = false;
      this.displayTips(this.categoryId, $rootScope.favourites);
      $mdToast.show($mdToast.simple().textContent('Exited favourites mode'));
    }  

    //Set Search Mode 
    this.viewSearch = function () {        
      this.searchmode = true; 
      $mdToast.show($mdToast.simple()
                    .textContent('Only Telugu search is curently supported')
                    .position('top')); 
    }  

    //Set Search Mode 
    this.closeSearch = function () {        
      this.searchmode = false; 
    } 

    //Display Search results
    this.search = function () {        
      //$log.debug("Search input : " + this.searchInput);
      //$scope.favourites = false;
      this.displayTips(this.categoryId, $rootScope.favourites, this.searchInput);
      $mdToast.show($mdToast.simple().textContent('Search results displayed')); 
    }  

    this.categoryId  = $routeParams.cat;
    //$log.debug("Favourites in scope : " + $rootScope.favourites);
    if($rootScope.favourites == undefined) {
    	$rootScope.favourites = false;  
    }
    
    this.gotoAnchor = function(index) {
      var newHash = 'anchor' + index;
      if ($location.hash() !== newHash) {
        $location.hash(newHash);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    };

    //$log.debug("Category Details : " + this.categoryId);
    this.displayTips(this.categoryId, $rootScope.favourites);
    if($rootScope.currindex) {
      $log.debug("Root Scope Current Index : " + $rootScope.currindex);  
      this.gotoAnchor($rootScope.currindex);

    }
    
})

.controller('TipCtrl', function($routeParams, $log, $location, $window, $mdBottomSheet, $timeout, $scope, $rootScope, $anchorScroll, $http, TipList, Favourite, Storage) {

  var ctr = this;
  //Display Recipie Details by Index ID
  this.displayIdxTip = function (indexId) {  
  	//FIXME - Show Interstitial Ad Here
    showInterstitial();    
    //console.time("Display Indexed Tips");
    if(indexId >= 0) {
      var tip = TipList.getIndexedTip(parseInt(indexId));
      if(tip) {
        tip.new = false;
        this.tip =  tip;
        this.index = indexId;
        $rootScope.currindex = indexId;
        //$log.debug(JSON.stringify(this.tip));
        Storage.updateRead(tip.id);
        //FIXME - Track in Analytis
        //window.analytics.trackView("Recipie View - " + $scope.recipie.title);
        //console.log("Prev & Next : " + $scope.recipie.prv + " - " + $scope.recipie.nxt);
      } else {
        $log.error("Could not find tip for : " + indexId);
        //FIXME - Report exception in Analytics
      }
    } else {
      console.log("Index is empty"); 
      //FIXME - Report exception in Analytics
    } 
    console.timeEnd("Display Indexed Tip");
  }  

  //Display Tip Details by Tip ID
  this.displayTip = function (id) {      
    showInterstitial();
    //$log.debug("Display Tip : " + id);
    var activeTip = TipList.getTip(id);
    if(activeTip) {
      this.tip = activeTip;  
      //FIXME - Track in Firebase Analytics 
      //window.analytics.trackView("Direct Recipie View - " + id);
    } else {
      $http.get(C_URL + '&id=' + id).
        then(function(data) {
          //$log.debug(JSON.stringify(data));
          if (!angular.isUndefined(data.data.tips) && data.data.tips.length > 0) {
            ctr.tip = data.data.tips[0];  
            //FIXME  - Track in Firebase Analytics
            //window.analytics.trackView("Remote Recipie View - " + id);
            //Storage.updateRead(tip.id);
          } else {
            $location.path('/home');  
          }
        })
    }
  }  

  //Display Next Tip
  this.next = function () {      
    $log.debug("Next Availability : " + this.tip.nxt);
    if(this.tip.nxt) {
      this.index = parseInt(this.index) + 1;
      this.displayIdxTip(this.index); 
      $window.scrollTo(0, 0);
    } else {
      window.plugins.toast.showWithOptions( { message: "No more tips", 
          duration: "short", 
          position: "bottom",
          addPixelsY: -70  
        }
      );
    }
  }  

  //Display Prev Tip
  this.prev = function () {      
    $log.debug("Prev Availability : " + this.tip.prv);
    if(this.tip.prv && this.index > 0) {
      this.index = parseInt(this.index) - 1;
      this.displayIdxTip(this.index); 
      $window.scrollTo(0, 0);
    } else {
      window.plugins.toast.showWithOptions( { message: "No more tips", 
          duration: "short", 
          position: "bottom",
          addPixelsY: -70  
        }
      );
    }
  }  

	//Add tip to favourite
	this.favourite = function ($event, tip) {         
		Favourite.addTip(tip.id);
		this.tip.favourite = true;
		//FIXME - Toast message here 
	};

	//Remove tip from favourite
	this.unfavourite = function ($event, tip) {         
		Favourite.removeTip(tip.id);
		this.tip.favourite = false;
		//FIXME	- Toast message here 		
	};

    //Show Bottom Scheet for sharing options
  this.showGridBottomSheet = function(tip) {
    var hashLocation = 'tip-head';
    //$log.debug("Hash Location :  " + $location.hash());
    if ($location.hash() !== hashLocation) {
      $location.hash(hashLocation);
    } else {
      // call $anchorScroll() explicitly,
      // since $location.hash hasn't changed
      $anchorScroll();
    }

    $mdBottomSheet.show({
      templateUrl: 'bottom-sheet-grid-template.html',
      controller: 'GridBottomSheetCtrl', 
      controllerAs: 'shareCtrl',
      clickOutsideToClose: true
    }).then(function(appToShare) {
       $log.debug("Clicked Item : " + appToShare);
       if(appToShare == 'WHATSAPP') {
          $scope.shareWhatsApp(tip);
       } else if (appToShare == 'FACEBOOK') {
          $scope.shareFB(tip);
       } else if (appToShare == 'TWITTER') {
          $scope.shareTweet(tip);
       } else {
         $log.debug("Upknown App for Share : " + appToShare);
     }
    });
  }

  //Share on WhatsApp
  $scope.shareWhatsApp = function(tip) {
    $mdBottomSheet.hide();
    $timeout(function() { 
      navigator.screenshot.URI(function(error,res) {
        if(error){
          console.error(error);
        } else {
          //FIXME - Capture Event in firebase
          //window.analytics.trackEvent('Share', 'Whatsapp', 'Tip', $scope.tip.id)
          window.plugins.socialsharing.shareViaWhatsApp("5000+ \u0ba4\u0bae\u0bbf\u0bb4\u0bcd \u0b95\u0bc1\u0bb1\u0bbf\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd - " + tip.title, res.URI, C_WEB_URL, function() {  }, function(errormsg){alert(errormsg) });
      }}, 100);      
    }, 500);
  }

  //Share on Twitter
  $scope.shareTweet = function(tip) {
    $mdBottomSheet.hide();
    //$location.hash('tip-head');
	  $timeout(function() { 
      navigator.screenshot.URI(function(error,res) {
        if(error){
          console.error(error);
        } else {
          //FIXME - Capture Event in firebase
          //window.analytics.trackEvent('Share', 'Whatsapp', 'Tip', $scope.tip.id)
          window.plugins.socialsharing.shareViaTwitter("Tamil Kuripugal - " + tip.title, res.URI, C_WEB_URL, function() {  }, function(errormsg){alert(errormsg) });
        }}, 100);
    }, 500);
  }

  //Share on Facebook
  $scope.shareFB = function(tip) {
    $mdBottomSheet.hide();
    //$location.hash('tip-head');
    $timeout(function() { 
    navigator.screenshot.URI(function(error,res) {
        if(error){
          console.error(error);
        } else {
          //FIXME - Capture Event in firebug
          //window.analytics.trackEvent('Share', 'Whatsapp', 'Tip', $scope.tip.id)
          window.plugins.socialsharing.shareViaFacebook("Tamil Kuripugal - " + tip.title, res.URI, C_WEB_URL, function() {  }, function(errormsg){alert(errormsg) });
      }}, 100);
	  }, 500);	      
  }

    /*
    //On Successful Share
    $scope.onSuccess = function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }

    $scope.onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
    }
    */

    var tipId =  $routeParams.id;
    var indexId =  $routeParams.index;
    if(indexId) {
      //$log.debug("Display Indexed tip: " + indexId);
      this.displayIdxTip(indexId);
    } else if (tipId) {
    	//$log.debug("Display Direct tip: " + tipId);
		  this.displayTip(tipId);
    } else {
      	//FIXME - Track exception in firebase analytics
      	$location.path("/home"); 
    }
})
.controller('GridBottomSheetCtrl', function($mdBottomSheet, $log) {
  
  this.shareOnApp = function(appName) {
    $log.debug('Share on app name : ' + appName);
    $mdBottomSheet.hide(appName);
  };
});
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

