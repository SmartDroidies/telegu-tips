'use strict';

/* Controllers */

var telegutipsControllers = angular.module('telegutipsControllers', []);

telegutipsControllers.controller('HomeCtrl', ['$scope', 'ArticleService',  '_',
  function($scope, Article) {
	//Show Home Page
	$scope.collectStatistics = function () {    
		var tips = Article.fetchArticles();
		//if (tips === undefined || tips === null) {
			//$scope.arokyam = _.chain(tips).filter(function(tip){ return _.contains(tip.category, 5);}).size().value();
			//$scope.samayal = _.chain(tips).filter(function(tip){ return _.contains(tip.category, 3);}).size().value();
			//$scope.naattu = _.chain(tips).filter(function(tip){ return _.contains(tip.category, 10);}).size().value();
			//$scope.azagu = _.chain(tips).filter(function(tip){ return _.contains(tip.category, 6);}).size().value();
			//$scope.kural = _.chain(tips).filter(function(tip){ return _.contains(tip.category, 11);}).size().value();
		//}
	}; 
	
	$scope.loadTip = function () {       
		console.log('Take to Tip => ' + this.tipId);
	};	

	$scope.refresh = function () {
		$scope.collectStatistics();	
	}  

	//Show Home
	$scope.collectStatistics();
  }]
);

//Controller To Load Tips
telegutipsControllers.controller('ListTipsCtrl', ['$scope', 'ArticleService', '$routeParams',
  function($scope, Article, $routeParams) {
	$scope.displayTips = function () {
		var categoryId = $routeParams.cat;
		//console.log("Tip Category : " + categoryId);
		/*
		var ctgry = Category.collectCategorty(categoryId);
		if(ctgry) {
			console.log("Category : " + ctgry.ctgryname);
		}
		*/
		var tips = Article.fetchArticlesByCategory(categoryId);
		if (tips === undefined || tips === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Message
		} else {
			$scope.tips = tips;
		}
		$scope.category = categoryId;
		//UI Changes 
		//$("#main-title").text(ctgry.ctgryname);
		hidePopup();
	}
	
	//Loading the Tips
	$scope.displayTips();
}]);

telegutipsControllers.controller('TipCtrl', ['$scope', '$routeParams', 'StorageService',  '$http', '$location', '$interval',
  function($scope, $routeParams, Storage, $http, $location, $interval) {
	$scope.loadTip = function () {       
		window.plugins.spinnerDialog.show();
		$("#footer").hide();
		$http.get('http://telugu.tips2stayhealthy.com/?json=y&id=' + $routeParams.id).
    	    success(function(data) {
    	    	//console.log("JSON Data : " + JSON.stringify(data));	
    	    	if (!angular.isUndefined(data.tips) && data.tips.length > 0) {
            		$scope.tip = data.tips[0];
            		window.plugins.spinnerDialog.hide();
            		$interval(showInterstitial, 5000);
            	} else {
            		//console.log("JSON Data : " + JSON.stringify(data));
            		window.plugins.spinnerDialog.hide();
            		$location.path('/home');  
            	}
    		})		
	}	
	
	//Collecting the details of the tip
	$scope.loadTip();
}]);

//Controller to display Tip Details
telegutipsControllers.controller('CategoryTipCtrl', ['$scope', '$routeParams', 'ArticleService', '$sce',
	function($scope, $routeParams, Article, $sce) {

	$scope.displaySelectedTip = function() {
		var categoryId = $routeParams.cat;
		var idx = $routeParams.index;
		$scope.index = idx;
		$scope.categoryId = categoryId;
		$scope.displayTipDetail();
	}

	//Method to display tip detail
	$scope.displayTipDetail = function () {         
		//console.log("Tip Category : " + $scope.categoryId);
		//var categoryId = $routeParams.cat;
		//var index = $routeParams.index;
		//console.log("Tip Category : " + categoryId);
		//var ctgry = Category.collectCategorty(categoryId);
		//if(ctgry) {
		//	console.log("Category : " + ctgry.ctgryname);
		//}
		var tip = Article.collectArticle($scope.categoryId, $scope.index);
		if (tip === undefined || tip === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Error Message
		} else {
			//console.log(tip.content);
			tip.contentHtml = $sce.trustAsHtml(tip.content);
			$scope.tip = tip;
		}
		$scope.category = $scope.categoryId;
		$scope.size = tip.size;
		showInterstitial();
		hidePopup();
	}


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
	
	//Loading the Tips
	$scope.displaySelectedTip();

}]);	


