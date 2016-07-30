/* Cache Services */
var cacheServices = angular.module('chitkalu.cache', []);
cacheServices.factory('Cache', function ($cacheFactory) {
	return $cacheFactory('chitkalu-cache');
});

angular.module('chitkalu.services', [])

/* Manage Category */
.service("Category", function($http, $q, Cache) {


	var categories = [{"code": "HOME", "id": "0", "label": "pirivu.home", "order": "1"},
		{"code": "HEALTH_TIPS", "id":	"2", "imageUrl": "images/health_tips.png", "order": "2", "label": "pirivu.health"},
		{"code": "BEAUTY_TIPS", "id":	"1", "imageUrl": "images/beauty_tips.png", "order": "3", "label": "pirivu.beauty"},
		{"code": "HOME_REMEDIES", "id":	"5", "imageUrl": "images/home_remedies.png", "order": "4", "label": "pirivu.remedies"},
		{"code": "COOKING_TIPS", "id":	"4", "imageUrl": "images/cooking_tips.png", "order": "5", "label": "pirivu.cooking"},
		{"code": "HOME_TIPS", "id":	"3", "imageUrl": "images/home_tips.png", "order": "6", "label": "pirivu.home"},
		{"code": "EXERCISE_TIPS", "id":	"1061", "imageUrl": "images/exercise_tips.png", "order": "7", "label": "pirivu.exercise"}];

	return {
		getCategories: function() {
			var sorted = _.sortBy(categories, 'order'); 
			return sorted;
		}
	};
});



/*
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
	var keyTips =  "tips";
	var keySyncTime =  "sync_time";
	var keySyncVersion =  "sync_version";
	var synced;


	//Collect all tips 
	storageFactory.collectTips = function() {
		//console.log('Collecting Tips from Local Storage');
		var data =  window.localStorage.getItem(keyTips);
		return JSON.parse(data);
	}
	
	//Collect tips by category
	storageFactory.collectTipsByCat = function(ctgry) {
		var data =  window.localStorage.getItem(keyTips);
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

	//Update Read
	storageFactory.updateRead = function(id) {
		//console.log("Tip Id : " + id);
		var data =  window.localStorage.getItem(keyTips);
		var tipsJSON = JSON.parse(data);

		var tip = _.find(tipsJSON,function(rw, rwIdx) { 
			if(rw.id == id) { 
				//console.log ("Updating Read Status for  : " + id); 
				rw.new = false;
				tipsJSON[rwIdx] = rw;
				return true;
			}; 
		});

		//Tip is not empty
		if(tip != null) {
			window.localStorage.setItem(keyTips, JSON.stringify(tipsJSON));
		}

	}	

	//Collect all tips 
	storageFactory.syncDate = function() {
		var self = this;
		var fileURLVersion =  "files/version.json";	
		var version = window.localStorage.getItem(keySyncVersion);

		jQuery.getJSON(fileURLVersion, function (data) {
			//console.log("Loading Quotes from FileSystem");
		}).done(function(data) {
			//console.log("Version : " + JSON.stringify(data.quotes));
			var quotesVersion =  data.quotes;
			if(!version || quotesVersion > version) {
				self.loadInitialData(quotesVersion);
			} else {
				self.syncLatestData();	
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});
	}

	//Load Initial Data
	storageFactory.loadInitialData = function(version) {
		var self = this;
		var fileURL =  "files/initial-tips.json";
		jQuery.getJSON(fileURL, function (data) {
			//console.log("Loading Quotes from FileSystem");
		}).done(function(data) {
			//console.log("Updating Local Storage : " + data.version);
			window.localStorage.setItem(keySyncTime, data.time);
			window.localStorage.setItem(keyTips, JSON.stringify(data.tips));
			window.localStorage.setItem(keySyncVersion, version);
			//Sync Local Storage after loaading initial data
			self.syncLatestData();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});
	}	

	//Sync Latest Data from server
	storageFactory.syncLatestData = function() {
		//Syncing Remote Data
		var self = this;
		var uri = encodeURI("http://telugu.tips2stayhealthy.com/?json=y");
		var lastSyncTime = window.localStorage.getItem(keySyncTime);
		if(lastSyncTime) {
			lastSyncTime = lastSyncTime - 18000;
			uri = encodeURI("http://telugu.tips2stayhealthy.com/?json=y&ts=" + lastSyncTime);
		} 
		//console.log("Download URL : " + uri);
		jQuery.getJSON(uri, function (data) {
			//console.log("Loading Latest Articles from Server");
		}).done(function(data) {
			//console.log("Fresh Data - " + JSON.stringify(data));
			self.syncLocalStorage(data);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});
	}

	//Sync Temp JSON
	storageFactory.syncLocalStorage = function(remoteJSON) {	
		var localTips =  window.localStorage.getItem(keyTips);
		var localJSON = JSON.parse(localTips);
		var initialTipSize = _.size(localJSON);
		//console.log("Modified Array Size : " + _.size(remoteJSON.tips));		
		//console.log("Local Array Initial Size : " + initialTipSize);		
		if(_.size(remoteJSON) >  0) {
			$.each(remoteJSON.tips, function(key, item) {
				var newTip = true;
				_.find(localJSON,function(rw, rwIdx) { 
					if(rw.id == item.id) { 
						//console.log ("Replace Existing Object for : " + item.id); 
						localJSON[rwIdx] = item;
						newTip = false; 
						return true;
					}; 
				});
				//If new tip
				if(newTip) {
					//console.log("New Object for : " + key + " - " + JSON.stringify(item));
					item.new = true;
					localJSON.push(item);
				} 
			});
			var finalTipSize = _.size(localJSON);
			//console.log("Local Array Final Size : " + finalTipSize);		
			//Update Local storage only if new array is bigger or equal to current array size
			if(finalTipSize >= initialTipSize) {
				window.localStorage.setItem(keyTips, JSON.stringify(localJSON));
				var modifiedTime = remoteJSON.time;
				if(typeof modifiedTime != 'undefined') {
					window.localStorage.setItem(keySyncTime, remoteJSON.time);
				}
			}	
		}
	}

	return storageFactory;
}); 

var cacheServices = angular.module('cacheService', []);
cacheServices.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
			return $cacheFactory('tips-cache');
		}
	]);

//Factory for managing articles
telegutipsServices.factory ('ArticleService', function (StorageService, _, cacheService, FavouriteService) {
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

	//Fetch All Articles 
	factory.fetchStoredArticles = function() {
		var tips = StorageService.collectTips();
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

    //Collect Favourite Articles 
	factory.collectFavourites = function() {
		var self = this;
		var articles = self.fetchArticles();
		//console.log("Total Articles : " + articles.length);
		var favourites = FavouriteService.collectFavourite();
		//console.log("Favourite Articles : " + favourites);

		articles = _.filter(articles, function(item) { 
			var bFavourite = false;
			
			if(favourites != null) {
				var index = favourites.indexOf(item.id.toString());
				//console.log("Comparision : " + item.id + " : " + index);
				if (index > -1) {
	    			bFavourite = true;
	    			//console.log("Favourite Found : " + item.id);
				}			
			}
			return bFavourite; 
		});

		return articles;

	}

    //Collect New Tips 
	factory.collectNewTips = function() {
		var self = this;
		var articles = self.fetchStoredArticles();

		articles = _.filter(articles, function(item) { 
			//console.log("New Tips Search : " + item.id + " - " + item.new);
			return item.new; 
		});
		//console.log("New Tip Count : " + _.size(articles));
		return articles;
	}

	//Fetch Articles By Tip ID
	factory.collectArticleByTipId = function(id) {
		var selectedTip = null;
		var tipsAll = StorageService.collectTips();
		if(tipsAll) {
			selectedTip = _.find(tipsAll, function(item) {  
				//console.log("Comparision : " + item.id + " : " + id);
				return (item.id == id); 
			});
		}
		//console.log("Selected Tip : " + selectedTip);
		if(selectedTip != null)  { 
			selectedTip.favourite = FavouriteService.isFavourite(id);
		}
		return selectedTip;
	}

    return factory;
}); 

//Factory for managing category
telegutipsServices.factory ('CategoryService', function (_, cacheService, $http, $q) {
	var factory = {}; 

	//Load Categories into Cache
	factory.loadCategories = function() {
		//console.log('Load Categories From Filesystem');
		return $http.get('files/category.json');
	}

	//Collect Categories from cache
	factory.collectCategories = function() {
		var deferred = $q.defer();
		var key = 'tt-categories';
		var categories = cacheService.get(key);
		if(!categories) {
			var promise = this.loadCategories();
       		promise.then(
          		function(payload) { 
              		categories = payload.data;
					if(categories) {
						cacheService.put(key, categories);
					}
              		deferred.resolve({categories: categories});
					//console.log('Categories ' + JSON.stringify(categories));
          		},
          		function(errorPayload) {
          			console.log('Failure loading movie ' + errorPayload);
          			deferred.reject(errorPayload);
          		});
		} else {
			deferred.resolve({categories: categories});
		}
		return deferred.promise;
	} 

	//Collect Category for an ID
	factory.collectCategory = function(catID) {
		var key = 'tt-categories';
		var categories = cacheService.get(key);
		var category = {};
		if(categories) {
			category = _.find(categories, function(ctgry) { 
				return ctgry.id == catID; 
			});
		} 
		return category;
	} 

    return factory;
}); 

//Factory for managing favourite
telegutipsServices.factory ('FavouriteService', function () {
	var favouriteFactory = {}; 
	
	//Add Tip to favourite 
	favouriteFactory.addTip = function(tipID) {
		//console.log('Adding Tip to favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored == null) {
			favourite = new Array();
			favourite.push(tipID);
		} else {
			//console.log("Favourite Stored : " + favouriteStored);	
			favourite = new Array(favouriteStored);
			favourite.push(tipID);
		}
		//console.log("Favourite : " + favourite);	
		if(favourite != null) {
			window.localStorage.setItem("favourite", favourite);	
		}
	}

	//Remove Tip from favourite 
	favouriteFactory.removeTip = function(tipID) {
		console.log('Remove Tip from favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			console.log("Favourite Stored : " + favouriteStored);	
			favourite = favouriteStored.split(",");
			var index = favourite.indexOf(tipID.toString());
			if (index > -1) {
    			favourite.splice(index, 1);
			}			
		}
		console.log("Favourite : " + favourite);	
		if(favourite != null) {
			window.localStorage.setItem("favourite", favourite);	
		}
	}

	//Check for favourite 
	favouriteFactory.isFavourite = function(tipID) {
		//console.log('Check Favourite for : ' + tipID);
		var flgFavourite = false;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			//console.log("Favourite Stored : " + favouriteStored);	
			var favourites = favouriteStored.split(",");
			var stored = _.find(favourites, function(id) { 
				//console.log("Cmparisison : " + id + " - " +  tipID);
				return id == tipID; 
			});
			//console.log("Stored  ID : " + stored);
			if(stored) {
				flgFavourite = true;		
			}
		}
		//console.log("Favourite : " + flgFavourite);
		return flgFavourite;
	}

	//Collect favourites 
	favouriteFactory.collectFavourite = function(tipID) {
		//console.log('Adding Tip to favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			favourite = favouriteStored.split(",");
		}
		return favourite;
	}
	
	
	return favouriteFactory;
}); 
*/