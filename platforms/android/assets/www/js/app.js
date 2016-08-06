'use strict';
/* App Module */
angular.module('telugutipsApp', ['ngRoute', 'ngSanitize', 'ngMaterial', 'jm.i18next', 'underscore', 'chitkalu.controllers', 'chitkalu.services', 'chitkalu.cache','telegutipsFilters'])

.config(['$routeProvider', 
	function ($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl : 'partials/home.html',
			controller : 'HomeCtrl',
			controllerAs: 'homeCtrl'
		}).when('/tips/:cat', {
			templateUrl : 'partials/tips.html',
			controller : 'TipsCtrl',
			controllerAs: 'tipsCtrl'
	  }).when('/tip/detail/:index', {
	        templateUrl : 'partials/tip.html',
	        controller : 'TipCtrl',
	        controllerAs: 'tipCtrl'
		}).when('/tip/:id', {
		    templateUrl : 'partials/tip.html',
		    controller : 'TipCtrl',
		    controllerAs: 'tipCtrl'
		}).when('/disclaimer', {
			templateUrl : 'partials/disclaimer.html',
		}).otherwise({
			redirectTo : '/home'
		});
	}
])

//Global Functions
.run(function($rootScope, $log, $mdSidenav, $mdDialog, $location) {

  	//Toggle nav
    $rootScope.toggleNav = function () {   
        $mdSidenav('navbar')
          .toggle()
          .then(function () { $log.debug("toggle navbar is done"); } )
    }
    //Go Back
  	$rootScope.back = function () {        
  		window.history.back();
  	};  

    //Go Back
    $rootScope.home = function () {        
      $location.path("/home"); 
    };  

    //Share App
    $rootScope.share = function () {   
      window.Firebase.trackEvent("Menu Action", "App Share");
      var platform = device.platform;
      if(platform == 'Android') {
        window.plugins.socialsharing.share('Try this great Telugu App - ', '1500+ Telugu Tips', 'www/images/banner.png','https://play.google.com/store/apps/details?id=com.smart.droid.telegu.tips');
      } else if(platform == "iOS") {
      	$log.debug('IOS App Share');
        //window.plugins.socialsharing.share('Try this great Tamil App - ', 'Kuripugal',null,'https://itunes.apple.com/app/id1072440433');
      } else {
        alert('Share not supported for : ' + platform);
      } 
    }

    //Rate US
    $rootScope.rateus = function () {   
    	window.Firebase.trackEvent("Menu Action", "App Rating");     
      	var version = device.platform;
      	if(version == "Android") {
        	var url = "market://details?id=com.smart.droid.telegu.tips";
        	window.open(url,"_system");   
      	} else if(platform == "iOS") {
      		$log.debug('IOS App rate');
        	//var url = "itms-apps://itunes.apple.com/app/id1072440433";
        	//window.open(url);   
      	} else {
	        alert('Rate Me not supported for : ' + platform);
      	} 
    };  

    //Feedback
    $rootScope.feedback = function () {       
    	window.Firebase.trackEvent("Menu Action", "App Rating");      
		//FIXME - Collect Version Dynamically
		window.plugin.email.open({
			to:      ['tips2stayhealthy@gmail.com'],
			subject: 'Feedback on Telegu Tips',
			body:    '',
			isHtml:  true
		});
    };

    /*
    //Feedback
    $rootScope.disclaimer = function () {        
      window.Firebase.trackEvent("App Displaimer", device.uuid);
      $mdDialog.show({
        contentElement: '#disclaimer',
        parent: angular.element(document.body)
      });
    };
    */

    var deviceUUID = device.uuid;
    //$log.debug("Device Id : " + deviceUUID + " -  Test Device : " + testDevice);
    if(deviceUUID == testDevice) {
      $rootScope.isTestDevice = true;
    }

})

//Theme configure 
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		  .primaryPalette('pink')
		  .accentPalette('red')
    	.warnPalette('amber');
	});


//ng-i18next - use i18next with Angularjs
angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
    $i18nextProvider.options = {
        lng: 'te',
        useCookie: false,
        useLocalStorage: false,
        fallbackLng: 'en',
        resGetPath: 'locales/__lng__/__ns__.json',
        defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
    };
}]);


/*
telugutipsApp.config(function ($provide) {
  $provide.value('CAT_5', 'HEALTH_TIPS');
  $provide.value('CAT_3', 'COOKING_TIPS');
  $provide.value('CAT_10', 'TREATMENT');
  $provide.value('CAT_6', 'BEAUTY_TIPS');
  $provide.value('CAT_11', 'KURAL');
});
*/

/*
telugutipsApp.config(['$routeProvider', 
		function ($routeProvider) {
			$routeProvider.when('/home', {
				templateUrl : 'partials/home.html',
				controller : 'HomeCtrl'
			}).
			when('/tips/:cat', {
				templateUrl : 'partials/tips.html',
				controller : 'ListTipsCtrl'
			}).
			when('/tip/:id', {
				templateUrl : 'partials/tip.html',
				controller : 'CategoryTipCtrl'
			}).
			when('/tip/:cat/:index', {
				templateUrl : 'partials/tip.html',
				controller : 'CategoryTipCtrl'
			}).
			when('/tip/:cat/:id', {
				templateUrl : 'partials/tip.html',
				controller : 'CategoryTipCtrl'
			}).
			otherwise({
				redirectTo : '/home'
			});
		}
	]);
*/
