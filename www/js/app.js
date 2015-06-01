var app = angular.module('myApp', ['ionic']);

app.factory('mylocalstorageservice', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    pushObjectToArray: function(key, element) {
		

	    console.log("array to be added : " + JSON.stringify(element));
      // retrieve array object as Json based on key
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('old array: ' + JSON.stringify(arrayobj));

      // initialize the collection if not already exist
      if("{}" == JSON.stringify(arrayobj)) {
        console.log('initialize object array');
        arrayobj = [];
      }

      // push new element at the end of json array
      arrayobj.push(element);
      console.log('new array: ' + JSON.stringify(arrayobj));

      // set object array back to localstorage
      $window.localStorage[key] = JSON.stringify(arrayobj);

      // retrieve again and test
      var testobj = JSON.parse($window.localStorage[key] || '{}');
      //console.log('test array: ' + JSON.stringify(testobj));      
      console.log('\ntest array: ');      
    },
    updateObjectToArray: function(key, element, elementId) {
      console.log('In updateObjectToArray');
      // retrieve array object as Json based on key
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('old array: ' + JSON.stringify(arrayobj));

      // update element at position elementId in arrayobj
      console.log("elementId to replace: " + elementId);
      //console.log("element at position " + elementId-1 + ": " + JSON.stringify(arrayobj[elementId - 1]));
      //arrayobj[elementId-1] = element;

      for (var i in arrayobj) {
        //console.log("\nfuel[" + i + "] = " + JSON.stringify(arrayobj[i]));
        if(arrayobj[i].id == elementId) {
          console.log("old element to be replaced: " + JSON.stringify(arrayobj[i]));
          console.log("new element to replace: " + JSON.stringify(element));
          arrayobj[i] = element;
        }
      };

      // set object array back to localstorage
      $window.localStorage[key] = JSON.stringify(arrayobj);

      // retrieve again and test
      var testobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('test array: ' + JSON.stringify(testobj));
    },
    removeObjectFromArray: function(key, elementId) {
      console.log('In removeObjectFromArray');
      // retrieve array object as Json based on key
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('old array: ' + JSON.stringify(arrayobj));

      // remove element at position elementId in arrayobj
      console.log("elementId to replace: " + elementId);
      //console.log("element at position " + elementId-1 + ": " + JSON.stringify(arrayobj[elementId - 1]));
      //arrayobj[elementId-1] = element;

      //temporary array to hold new values
      var tempobj = [];

      for (var i in arrayobj) {
        //console.log("\nfuel[" + i + "] = " + JSON.stringify(arrayobj[i]));
        if(arrayobj[i].id != elementId) {
          tempobj.push(arrayobj[i]);
        }
      };

      // set object array back to localstorage
      $window.localStorage[key] = JSON.stringify(tempobj);

      // retrieve again and test
      var testobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('test array: ' + JSON.stringify(testobj));
    }
  }
}]);


app.run(function(mylocalstorageservice) {
 // reset localstorage
 // mylocalstorageservice.setObject('fuels', []);
   // var fuels = [
   //     {
   //         id: 1,
   //         "vehicle": {
   //           "name": "Honda"
   //         },
   //         "date": 1432090170403,
   //         "odometer": 23842,
   //         "litres": 12,
   //         "litrerate": 12,
   //         "total": 12,
   //         "fulltank": true,
   //         "location": "Wellington"
   //     },
   //     {
   //         id: 2,
   //         "vehicle": {
   //           "name": "Honda"
   //         },
   //         "date": 1432090170403,
   //         "odometer": 23942,
   //         "litres": 12,
   //         "litrerate": 12,
   //         "total": 12,
   //         "fulltank": false,
   //         "location": "Auckland"
   //     },
   //     {
   //         id: 3,
   //         "vehicle": {
   //           "name": "Honda"
   //         },
   //         "date": 1432090170403,
   //         "odometer": 23989,
   //         "litres": 12,
   //         "litrerate": 12,
   //         "total": 12,
   //         "fulltank": false,
   //         "location": "Wellington"
   //     }
   //   ];

   // mylocalstorageservice.setObject('fuels', fuels);

//   var fuel_element = {
//           id: 4,
//           "vehicle": {
//             "name": "Honda"
//           },
//           "date": 1432090170403,
//           "odometer": 65000,
//           "litres": 12,
//           "litrerate": 12,
//           "total": 12,
//           "fulltank": false,
//           "location": "Auckland"
//       };

//   mylocalstorageservice.pushObjectToArray('fuels', fuel_element);

});

app.service('FuelsService', function($q, mylocalstorageservice) {
  return {
    getFuels: function() {
        console.log("In FuelsService.getFuels");
        var fuels = mylocalstorageservice.getObject('fuels');
        console.log("fuels: " + JSON.stringify(fuels));
        return fuels
    },
    getFuel: function(fuelId) {
      console.log("In FuelsService.getFuel");
      var fuels = mylocalstorageservice.getObject('fuels');
      var dfd = $q.defer()
      fuels.forEach(function(fuel) {
        console.log("fuelId: "+fuelId + ", fuel.id = " + fuel.id);
        if (fuel.id == fuelId) {
            console.log("fuel details resolved");
            dfd.resolve(fuel)
        }
      })
      return dfd.promise
    }
  }
})


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      controller: 'TabsCtrl',
      templateUrl: 'tabs.html'
    })
    .state('tabs.statistics', {
      url: '/statistics',
      views: {
        'statistics-tab': {
          templateUrl: 'statistics.html',
          controller: 'StatisticsTabCtrl'
        }
      }
    })  
    .state('tabs.fuels', {
      url: '/fuels',
      views: {
        'fuels-tab': {
          templateUrl: 'fuels.html',
          controller: 'FuelsController'//,
          // resolve: {
          //   fuels: function(FuelsService) {
          //       return FuelsService.getFuels()
          //   }
          // }
        }
      }
    }) 
    .state('tabs.editfuel', {
      url: '/fuels/:fuelId',
      views: {
        'fuels-tab': {
          templateUrl: 'editfuel.html',
          controller: 'EditFuelController',
          resolve: {
            fuel: function($stateParams, FuelsService) {
                console.log("inside tabs.fuel ");
                console.log("fuel.id = " + $stateParams.fuelId);
                return FuelsService.getFuel($stateParams.fuelId)
            }
          }
        }
      }
    })  
    .state('tabs.addfuel', {
      url: '/addfuel',
      views: {
        'fuels-tab': {
          templateUrl: 'addfuel.html',
          controller: 'AddFuelController',
          resolve: {
            fuel: function($stateParams, FuelsService) {
                return []
            }
          }
        }
      }
    })
  /*
    .state('tabs.more', {
      url: '/more',
      views: {
        'more-tab': {
          templateUrl: 'more.html',
          controller: 'MoreTabCtrl'
        }
      }
    })  
    */
   .state('about', {
      url: '/about',
      controller: 'AboutController',
      templateUrl: 'about.html'
    })  
   .state('donate', {
      url: '/donate',
      controller: 'DonateController',
      templateUrl: 'donate.html'
    })
  
  ;

  $urlRouterProvider.otherwise('/tab');
});

app.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {  
    console.log("In TabController...");
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }  
});

app.controller('StatisticsTabCtrl', function($scope, $ionicSideMenuDelegate) {
    console.log("In StatisticsController...");
});

app.controller('FuelsController', function($scope, mylocalstorageservice, $state, $interval) {
    console.log("In FuelsController...");
    
    //$scope.shouldShowDelete = false;
    $scope.listCanSwipe = true;
    $scope.refreshing = false;

    $scope.fuels = mylocalstorageservice.getObject('fuels');

    $scope.doRefresh = function() {
      console.log('Refreshing !!');
      $scope.fuels = mylocalstorageservice.getObject('fuels');
      $scope.$broadcast('scroll.refreshComplete');      
    };

    $scope.edit = function(fuel) {
      console.log('inside FuelsController.edit function' + JSON.stringify(fuel));
      $scope.fuel = fuel;
      $state.go('tabs.editfuel', {'fuelId': fuel.id});
    };

    $scope.delete = function(fuel) {
      console.log('inside FuelsController.delete function' + JSON.stringify(fuel));
      //$scope.fuel = fuel;
      //$state.go('tabs.editfuel', {'fuelId': fuel.id});
      mylocalstorageservice.removeObjectFromArray('fuels', fuel.id);
      $scope.fuels = mylocalstorageservice.getObject('fuels');
      $scope.$broadcast('scroll.refreshComplete');  
    };

  /*
    // auto refresh after certain interval
    var autoRefresh = function() {
      console.log('Refreshing !!');
      $scope.fuels = mylocalstorageservice.getObject('fuels');
      $scope.$broadcast('scroll.refreshComplete');
    };

    $interval( function() {
      console.log("auto refreshing !!!");
      autoRefresh();
    }, 5000);
  */

    //$http.get('js/fuels.json').success(function(data){
    //    $scope.fuels = data;
    //});
});

app.controller('EditFuelController', function($scope, fuel, mylocalstorageservice, $state) {
    console.log("In EditFuelController...");
    $scope.fuel = fuel;

    $scope.save = function(fuel) {
      mylocalstorageservice.updateObjectToArray('fuels', fuel, fuel.id);
      console.log("fuel details updated to fuels.. transfering page to tabs.fuels");
      //$scope.fuel = [];
      //$scope.fuels = mylocalstorageservice.getObject('fuels');
      $state.go('tabs.fuels');
    }

});

app.controller('AddFuelController', function($scope, $ionicSideMenuDelegate, mylocalstorageservice, $state) {
    console.log("In AddFuelController...");
    //$scope.fuel = [];
    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.save = function(fuel) {
	  console.log("save called for: " + JSON.stringify(fuel));
      mylocalstorageservice.pushObjectToArray('fuels', fuel);
      console.log("fuel details added to fuels.. transfering page to tabs.fuels")
      //$scope.fuel = [];
      //$scope.fuels = mylocalstorageservice.getObject('fuels');
      $state.go('tabs.fuels');
    }
    
});

/*
app.controller('MoreController', function($scope, $ionicSideMenuDelegate) {

});
*/
app.controller('AboutController', function($scope, $ionicSideMenuDelegate) {
    console.log("In AboutController...");
    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }
});

app.controller('DonateController', function($scope, $ionicSideMenuDelegate) {
    console.log("In DonateController...");
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }
});