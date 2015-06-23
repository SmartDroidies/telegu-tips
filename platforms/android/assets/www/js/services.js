/* Services */
var telegutipsServices = angular.module('telegutipsServices', ['ngResource']);
telegutipsServices.factory('Tips', ['$resource',
	function($resource){
		var url =  cordova.file.dataDirectory + "/tips.json";
		return $resource( url, {}, {
			query: { method: "GET", isArray: true }
		});
}]);

//Factory for loading the feed from Local Storage
telegutipsServices.factory ('StorageService', function () {
	var storageFactory = {}; 
	//Collect all tips 
	storageFactory.collectTips = function() {
		//console.log('Collecting Tips from Local Storage');
		var data =  window.localStorage.getItem("tips");
		return JSON.parse(data);
	}
	
	//Collect tips by category
	storageFactory.collectTipsByCat = function(ctgry) {
		var data =  window.localStorage.getItem("tips");
		var allTipsJSON = JSON.parse(data);
		var filtered = [];
		for (var i = 0, len = allTipsJSON.length; i < len; i++) {
			var bCtgryMatch = false;
			var tip = allTipsJSON[i];
			for (var j = 0, length = tip.category.length; j < length; j++) {
				if(tip.category[j] == ctgry) {
					bCtgryMatch = true;
				}
			}
			if(bCtgryMatch == true) {
				filtered.push(tip);
			}
		};
		var sortedFiltered = _.sortBy(filtered, "post_date").reverse();
		return sortedFiltered;
	}
	
	return storageFactory;
}); 

/* Cache Services */
var cacheServices = angular.module('cacheService', []);
cacheServices.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
			return $cacheFactory('tips-cache');
		}
	]);




//Factory for managing articles
telegutipsServices.factory ('ArticleService', function (StorageService, _, cacheService) {
	var factory = {}; 
	
	//Fetch All Articles 
	factory.fetchArticles = function() {
		var key = 'sd-tt-articles';
		var tips = cacheService.get(key);
		if(!tips) {
			tips = StorageService.collectTips();
			if(tips) {
				cacheService.put(key, tips);
			}
		}
		return tips;
	}

	//Fetch Articles By Category
	factory.fetchArticlesByCategory = function(category) {
		var key = 'CTGRY' + category;
		var tipsByCtgry = cacheService.get(key);
		if(!tipsByCtgry) {
			var tipsAll = StorageService.collectTips();
			if(tipsAll) {
				var filtered = [];
				if(category) {
					tipsByCtgry = _.filter(tipsAll, function(item) {  
						var bCtgryMatch = false;
						for (var j = 0, length = item.category.length; j < length; j++) {
							if(item.category[j] == category) {
								bCtgryMatch = true;
							}
						}
						return bCtgryMatch; 
					});
				}	
				tipsByCtgry = _.sortBy(tipsByCtgry, "post_date").reverse();
				//console.log("Filtered Article Length : " + tipsByCtgry.length);
				cacheService.put(key, tipsByCtgry);
			}
		}
		return tipsByCtgry;
	}
	
	// Collect all Articles for a category
    factory.collectArticles = function(category) {
		var self = this;
		var articles = self.fetchArticles();
		if(articles) {
			if(category) {
				articles = _.filter(articles, function(item) { 
					var bCtgryMatch = false;
					for (var j = 0, length = item.category.length; j < length; j++) {
						if(item.category[j] == category) {
							bCtgryMatch = true;
						}
					}
					return bCtgryMatch; 
				});
			}	
			articles = _.sortBy(articles, "post_date").reverse();
			console.log("Filtered Article Length : " + articles.length);
		}
		console.log('Service Method to Collect Article by Category : ' + category);
		return articles;
    }
	
	// Collect indexed Article for a category
	factory.collectArticle = function(category, index) {
		var self = this;
		var article;
		var articles = self.fetchArticlesByCategory(category);
		article = articles[index];
		article.position = parseInt(index) + 1;
		article.size = articles.length;
		return article;
    }
	
	//Collect Stats for all category 
	factory.collectStats = function() {
		var self = this;
		var articles = self.fetchArticles();
		var stats ;
		if(articles) {
			stats = {'health' : _.chain(articles).filter(function(item){ return item.cat_ID == '1';}).size().value(), 
				'fitness' : _.chain(articles).filter(function(item){ return item.cat_ID == '25';}).size().value(),
				'beauty' : _.chain(articles).filter(function(item){ return item.cat_ID == '5';}).size().value(),
				'remedy' : _.chain(articles).filter(function(item){ return item.cat_ID == '406';}).size().value(),
				'general' : _.chain(articles).filter(function(item){ return item.cat_ID == '878';}).size().value()};	
		}
		return stats;
    }
    return factory;
}); 
