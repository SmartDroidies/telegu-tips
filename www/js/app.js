'use strict';
/* App Module */
angular.module('telugutipsApp', ['ngRoute', 'ngSanitize', 'ngMaterial', 'jm.i18next', 'underscore', 'chitkalu.controllers'])

.config(['$routeProvider', 
	function ($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl : 'partials/home.html',
			controller : 'HomeCtrl',
			controllerAs: 'homeCtrl'
		/* }).when('/tips/:cat', {
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
			templateUrl : 'partials/disclaimer.html', */
		}).otherwise({
			redirectTo : '/home'
		});
	}
])

/*
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
      window.Firebase.trackEvent("App Share", device.uuid);
      var platform = device.platform;
      if(platform == 'Android') {
        window.plugins.socialsharing.share('Try this great Tamil App - ', '5000+ Tamil Tips', 'www/images/banner.png','https://play.google.com/store/apps/details?id=com.smart.droid.tamil.tips');
      } else if(platform == "iOS") {
        window.plugins.socialsharing.share('Try this great Tamil App - ', 'Kuripugal',null,'https://itunes.apple.com/app/id1072440433');
      } else {
        alert('Share not supported for : ' + platform);
      } 
    }

    //Rate US
    $rootScope.rateus = function () {        
      window.Firebase.trackEvent("App Rating", device.uuid);
      var version = device.platform;
      if(version == "Android") {
        var url = "market://details?id=com.smart.droid.tamil.tips";
            window.open(url,"_system");   
      } else if(platform == "iOS") {
        var url = "itms-apps://itunes.apple.com/app/id1072440433";
            window.open(url);   
      } else {
        alert('Rate Me not supported for : ' + platform);
      } 
    };  

    //Feedback
    $rootScope.feedback = function () {        
      window.Firebase.trackEvent("App Feedback", device.uuid);
      //FIXME - Collect Version Dynamically
      window.plugin.email.open({
        to:      ['tips2stayhealthy@gmail.com'],
        subject: 'Feedback on Tamil Kuripugal V0.3.3',
        body:    '',
        isHtml:  true
      });
    };

    //Feedback
    $rootScope.disclaimer = function () {        
      window.Firebase.trackEvent("App Displaimer", device.uuid);
      $mdDialog.show({
        contentElement: '#disclaimer',
        parent: angular.element(document.body)
      });
    };

    var deviceUUID = device.uuid;
    //$log.debug("Device Id : " + deviceUUID + " -  Test Device : " + testDevice);
    if(deviceUUID == testDevice) {
      $rootScope.isTestDevice = true;
    }

})
*/

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

/*	
telugutipsApp.config(function ($translateProvider) {
        $translateProvider.translations('en', {
          TITLE: 'Telugu Tips',
          HOME: 'Home',
		  HEALTH_TIPS: 'Health Tips',
		  BEAUTY_TIPS: 'Beauty Tips',
		  KURAL: 'Kural',
          BUTTON_LANG_EN: 'english',
          BUTTON_LANG_DE: 'german',
          TIP:'Tip'
        });
        $translateProvider.translations('te', {
          TITLE: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41 \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
          HOME: '\u0c39\u0c4b\u0c2e\u0c4d',
		  HEALTH_TIPS: '\u0c06\u0c30\u0c4b\u0c17\u0c4d\u0c2f\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
		  COOKING_TIPS: '\u0c35\u0c02\u0c1f\u0c3f\u0c02\u0c1f\u0c3f \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41', 
		  BEAUTY_TIPS: '\u0c05\u0c02\u0c26\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
		  HOME_TIPS: '\u0c07\u0c02\u0c1f\u0c3f \u0c2e\u0c46\u0c30\u0c41\u0c17\u0c41\u0c26\u0c32\u0c15\u0c41 \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
		  HOME_REMEDIES: '\u0c07\u0c02\u0c1f\u0c4d\u0c32\u0c4b \u0c09\u0c02\u0c21\u0c47 \u0c14\u0c37\u0c26\u0c3e\u0c32\u0c41',
		  EXERCISE_TIPS: '\u0c2f\u0c4b\u0c17\u0c3e \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
		  UNREAD_TAB: '\u0c1a\u0c26\u0c35\u0c28\u0c3f \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
		  CATEGORY_TAB: '\u0c35\u0c3f\u0c2d\u0c3e\u0c17\u0c3e\u0c32\u0c41',
		  FAVOURITE_TAB: '\u0c07\u0c37\u0c4d\u0c1f\u0c2e\u0c48\u0c28 \u0c1a\u0c3f\u0c1f\u0c4d\u0c15\u0c3e\u0c32\u0c41',
          BUTTON_LANG_EN: 'englisch',
          BUTTON_LANG_DE: 'deutsch'
        });
        $translateProvider.preferredLanguage('te');
      });
*/