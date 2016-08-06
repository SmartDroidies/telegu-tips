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
})

//08022016
/* Managing an active list for navigation */
.service("TipList", function(Cache, $log, Favourite, $filter, filterFilter) {

	var currTS = new Date().getTime();
	var weekDisplayFormat = "EEEE 'at' h:mm a";
	var displayFormat = "d MMM 'at' h:mm a";
	var fullDateTimeFormat = "MMMM d, y h:mm a";
	return {

		getTips:function(category, favmode, searchtext) {
			var tips = this.getCacheTips();
			var catArr = null;
			var catTips = null;

			$log.debug("All Tips Count : " + _.size(tips));

			//Filter Category Tips
			if(category > 0) {
				 catTips = _.filter(tips, function(item) {  
					var bCtgryMatch = false;
					for (var j = 0, length = item.category.length; j < length; j++) {
						//console.log("Category for recipie : " + item.category[j]);
						if(Number(category) == item.category[j]) {
							bCtgryMatch = true;
						}
					}
					return bCtgryMatch; 
				});
			} else {
				catTips = tips;
			} 

			$log.debug("Category Tips Count : " + _.size(catTips));
			
			//Handle for favourite listing
			if(favmode) { 
				//Filter for Favourites 
				var arrFavourites = Favourite.getFavourites();
				//$log.debug("User Favourites : " + arrFavourites);
				if(_.size(arrFavourites) > 0) {
					catTips = _.filter(catTips, function(item) {  
						if(_.contains(arrFavourites, "" + item.id)) {
							return true;
							$log.debug("Favourite Found : " + item.title);	
						}
					});
				} 
			} 

			$log.debug("Favourite Tips Count : " + _.size(catTips));

			//Mark Favourites & Process Time Stamp
			var arrFavourites = Favourite.getFavourites();
			//$log.debug("User Favourites : " + arrFavourites);
			_.each(catTips, function(item) {  
				//Setting Favourite Flag
				if(_.contains(arrFavourites, "" + item.id)) {
					item.favourite = true;
				}

				if(item.post_date) {
					/*
					var timeDiffMS = currTS - (item.post_date * 1000); 
					var timeDiffHour = Math.floor(timeDiffMS / (1000 * 60 * 60));
					//$log.debug("Time Diff : " + timeDiffMS + " Milli Sec - " + timeDiffHour + " Hours");
					if(timeDiffHour > 23) {
						var tipDate = new Date(item.post_date * 1000);
						//$log.debug("Display Time in Date Format : " + tipDate.toGMTString());
						if(timeDiffHour/24 > 6) {
							item.posttime = $filter('date')(tipDate, displayFormat);	
						} else {
							item.posttime = $filter('date')(tipDate, weekDisplayFormat);	
						}
					} else {
						if(!timeDiffHour > 1) {
							item.posttime = "1 hr ago"
						} else {
							item.posttime = timeDiffHour + " hrs ago"
						}
					}
					*/
					var tipDate = new Date(item.post_date * 1000);
					item.pts = $filter('date')(tipDate, fullDateTimeFormat);
					//Setting Time Stamp
					//$log.debug("Post Time : " + item.post_date);
					//$log.debug("Current Time : " + currTS);
				}	
			});
	
			if(searchtext) {
				$log.debug("Searching for  : " + searchtext);
				catTips = filterFilter(catTips, {'title' : searchtext});
			}

			//Sort Tips by post date
			if(_.size(catTips) > 0) {
				catTips = _.sortBy(catTips, function(item) {
					return -item.post_date; 
				})
			}
			return catTips;
		},
		getCacheTips:function() {
			var cacheTips = Cache.get(C_CACHE_TIPS);
			if(!cacheTips) {
				cacheTips = this.getStorageTips();
				if(cacheTips) {
					Cache.put(C_CACHE_TIPS, cacheTips);
				}
			} else {
				//console.log("Returning Tips from cache");
			}
			return cacheTips;
		},
		getStorageTips:function() {
			//console.log("Collecting Tips from Local Storage");		
			var data =  window.localStorage.getItem(C_KEY_TIPS);
			if(!data) {
				$log.debug("Storage Tips : " + JSON.stringify(data));
				//FIXME - Capture Event in Analytics
				//window.analytics.trackException('Empty Storage Exception', false);
			}
			return JSON.parse(data);
		},
		storeTempTips:function(data) {
			Cache.put(C_CACHE_LIST, data);
		},
		getTempTips:function() {
			return Cache.get(C_CACHE_LIST);
		},
		getIndexedTip:function(indexId) {
			var cacheTips = Cache.get(C_CACHE_LIST);
			var tip;
			var listSize = _.size(cacheTips);
			if(listSize > 0) {
				tip = cacheTips[indexId];
				//$log.debug("Tip collected from cache :  " + tip.title);					
			}
			if(tip) {
				if(listSize > (indexId + 1)) {
					tip.nxt = true;	
				}
				if(indexId > 0) {
					tip.prv = true;		
				}
			}	
			return tip;
		},
		getTip:function(id) {
			var selectedTip = null;
			var tipsAll = this.getStorageTips();
			if(tipsAll) {
				selectedTip = _.find(tipsAll, function(item) {  
					return (item.id == id); 
				});
			}
			/*
			//console.log("Selected Tip : " + selectedTip);
			if(selectedTip != null)  { 
				selectedTip.favourite = FavouriteService.isFavourite(id);
			}
			*/
			return selectedTip;
		},
		getTipCount: function() {
			var data =  window.localStorage.getItem(C_KEY_TIPS);
			var count = 0;
			if(data) {
				count = _.size(JSON.parse(data));
			}
			return count;
		}
	};
})

/* Perform Operation for Storage Sync */
.service("Storage", function($http, $log, $q) {
	var syncCount = 0; 
	return {
		checkDataVersion:function() {
			var self = this;
			var dataVersion = window.localStorage.getItem(C_KEY_DATAVERSION);  
			$log.debug("Data Version Check : " + dataVersion + " - " + C_DATA_VERSION);
			if(!dataVersion || C_DATA_VERSION > dataVersion) {
				self.clearStorage();
			} else {
				$log.debug("Data Upto version : " + dataVersion + " - " + C_DATA_VERSION);
			}
		},
		sync:function() {
			var deferred = $q.defer();  
			var self = this;
			var uri = encodeURI(C_URL);
			var lastSyncTime = window.localStorage.getItem(C_KEY_SYNCTIME);
			if(lastSyncTime) {
				lastSyncTime = lastSyncTime - 18000;
				uri = encodeURI(C_URL + "&ts=" + lastSyncTime);
			} 
			$log.debug("Syncing Storage Tips from : " + uri);
			console.time("Collecting remote tips");
			$http.get(uri)
    			.then(function(response) {
    				//FIXME - Track Analytics Event
    				//console.log("Fresh Data - " + JSON.stringify(response.data));
    				self.updateStorage(response.data);
    				//FIXME - Return response with status
    				console.timeEnd("Collecting remote tips");
    				deferred.resolve("Sync Success");
    			}, function(response) {
    				//FIXME - Track Analytics Exception
    				//window.analytics.trackException('Data Sync Exception - ' + response, false);
					console.log("Sync Kuripugal Failed - " + response);
					console.timeEnd("Collecting remote tips");
					deferred.reject("Sync Failure");
    			});				
    		return deferred.promise;		
		},
		updateStorage:function(data) {
			var self = this;
			var localTips =  window.localStorage.getItem(C_KEY_TIPS);
			if(localTips) {
				//FIMXE - Capture Analytics Event
				this.syncStorage(data);
				//window.analytics.trackEvent('Local Storage', 'Synced');
			} else {
				var tipsCount = _.size(data.tips);
				var pagemode = data.pagemode;
				var page = data.page;
				window.Firebase.trackEvent("Data Sync", "Set 1");
				window.localStorage.setItem(C_KEY_TIPS, JSON.stringify(data.tips));
				window.localStorage.setItem(C_KEY_SYNCTIME, data.time);
				window.localStorage.setItem(C_KEY_DATAVERSION, C_DATA_VERSION);
				$log.debug("Page Mode - " + pagemode + " , Count  - " + tipsCount +  ", Page - " + page);
				//Setting it 499 so that the rest service can return any thing about 500
				if(pagemode == true && tipsCount > 499)  {
					page = parseInt(page) + 1;
					self.syncNext(page);
				}
				
			}
		},		
		syncNext:function(page) {
			var self = this;
			var activeuri = encodeURI(C_URL + "&page=" + page);	
			$log.debug("Syncing Storage Tips from : " + activeuri);
			syncCount = syncCount + 1;
			$http.get(activeuri)
    			.then(function(response) {
    				window.Firebase.trackEvent("Data Sync", "Set " + page);
    				var tipsCount = _.size(response.data.tips);
					var pagemode = response.data.pagemode;
					var page = response.data.page;
    				//FIXME - Add Data to storage
    				self.addToStorage(response.data);
					$log.debug("Page Mode - " + pagemode + " , Count  - " + tipsCount +  ", Page - " + page);
					//Setting it 499 so that the rest service can return any thing about 500
					if(pagemode == true && tipsCount > 499 && syncCount < 10)  {
						page = parseInt(page) + 1;
						self.syncNext(page);
					} else {
						$log.debug("End of Sync");
					}
    			}, function(response) {
    				//FIXME - Track Analytics Exception
    				//window.analytics.trackException('Data Sync Exception - ' + response, false);
					$log.debug("Sync Kuripugal Failed - Page " + page);
    			});				
		},
		addToStorage:function (data) {
			var localTips =  window.localStorage.getItem(C_KEY_TIPS);
			var localJSON = JSON.parse(localTips);
			var remoteTips = data.tips;
			//$log.debug("Union Of - " + _.size(localJSON)  + " , " + _.size(remoteTips));
			var unionTips = _.union(localJSON, remoteTips);
			$log.debug('Total Tip Size : ' + _.size(unionTips));
			window.localStorage.setItem(C_KEY_TIPS, JSON.stringify(unionTips));
			window.localStorage.setItem(C_KEY_SYNCTIME, data.time);
		},
		syncStorage:function(data) {
			var localKuripugal =  window.localStorage.getItem(C_KEY_TIPS);
			var localKurippuJSON = JSON.parse(localKuripugal);
			var initialKurippuSize = _.size(localKurippuJSON);
			//$log.debug("Modified Array Size : " + _.size(data.tips));		
			//$log.debug("Local Array Initial Size : " + initialKurippuSize);		

			if(_.size(data.tips) >  0) {
				$.each(data.tips, function(key, item) {
					var newKurippu = true;
					_.find(localKurippuJSON,function(rw, rwIdx) { 
						if(rw.id == item.id) { 
							//$log.debug("Replace Existing Object for : " + item.id); 
							localKurippuJSON[rwIdx] = item;
							newKurippu = false; 
							return true;
						}; 
					});
					//If new tip
					if(newKurippu) {
						//$log.debug("New Object for : " + key + " - " + item.id);
						item.new = true;
						localKurippuJSON.push(item);
					} 
				});
				var finalKurippuSize = _.size(localKurippuJSON);
				//$log.debug("Local Array Final Size : " + finalKurippuSize);		
				//Update Local storage only if new array is bigger or equal to current array size
				if(finalKurippuSize >= initialKurippuSize) {
					window.localStorage.setItem(C_KEY_TIPS, JSON.stringify(localKurippuJSON));
					var modifiedTime = data.time;
					if(typeof modifiedTime != 'undefined') {
						window.localStorage.setItem(C_KEY_SYNCTIME, modifiedTime);
					}
				}
			}
		},
		updateRead:function(id) {
			//console.log("Tip Id : " + id);
			var data =  window.localStorage.getItem("tips");
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
				window.localStorage.setItem("tips", JSON.stringify(tipsJSON));
			}
		},
		clearStorage: function() {
			window.localStorage.removeItem(C_KEY_TIPS);
			window.localStorage.removeItem(C_KEY_SYNCTIME);
			window.localStorage.removeItem(C_KEY_DATAVERSION);
			//FIXME - Firebase Analytics
		}	
	};
})

//Factory for managing favourite
.service ('Favourite', function () {

	return {
		addTip:function(tipID) {	
			var favourite = null;
			var favouriteStored = window.localStorage.getItem(C_KEY_FAVOURITE); 
			if(favouriteStored == null) {
				favourite = new Array();
				favourite.push(tipID);
			} else {
				favourite = new Array(favouriteStored);
				favourite.push(tipID);
			}
			if(favourite != null) {
				window.localStorage.setItem(C_KEY_FAVOURITE, favourite);	
			}
			//FIXME - Capture Analytics
		}, 
		removeTip:function(tipID) {
			var favourite = null;
			var favouriteStored = window.localStorage.getItem(C_KEY_FAVOURITE); 
			if(favouriteStored != null) {
				favourite = favouriteStored.split(",");
				var index = favourite.indexOf(tipID.toString());
				if (index > -1) {
	    			favourite.splice(index, 1);
				}			
			}
			//console.log("Favourite : " + favourite);	
			if(favourite != null) {
				window.localStorage.setItem(C_KEY_FAVOURITE, favourite);	
			}
			//FIXME - Capture Analytics
		},	
		getFavourites: function() {
			var favourite = null;
			var favouriteStored = window.localStorage.getItem(C_KEY_FAVOURITE); 
			if(favouriteStored != null) {
				favourite = favouriteStored.split(",");
			}
			return favourite;
		}
	};
});