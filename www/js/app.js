var app = angular.module('myApp', ['ionic']);

app.factory('$localstorage', ['$window', function($window) {
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
    }
  }
}]);


app.run(function($localstorage) {
  var fuels = [
      {
          id: 1,
          "vehicle": {
            "name": "Honda"
          },
          "date": 1432090170403,
          "odometer": 23842,
          "litres": 12,
          "litrerate": 12,
          "total": 12,
          "fulltank": true,
          "location": "Wellington"
      },
      {
          id: 2,
          "vehicle": {
            "name": "Honda"
          },
          "date": 1432090170403,
          "odometer": 23942,
          "litres": 12,
          "litrerate": 12,
          "total": 12,
          "fulltank": false,
          "location": "Auckland"
      },
      {
          id: 3,
          "vehicle": {
            "name": "Honda"
          },
          "date": 1432090170403,
          "odometer": 23989,
          "litres": 12,
          "litrerate": 12,
          "total": 12,
          "fulltank": false,
          "location": "Wellington"
      }
    ];

  $localstorage.setObject('fuels', fuels);
});

app.service('FuelsService', function($q, $localstorage) {
  return {
    getFuels: function() {
        console.log("In FuelsService.getFuels");
        return $localstorage.getObject('fuels')
    },
    getFuel: function(fuelId) {
      console.log("In FuelsService.getFuel");
      var fuels = $localstorage.getObject('fuels');
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
          controller: 'FuelsController',
          resolve: {
            fuels: function(FuelsService) {
                return FuelsService.getFuels()
            }
          }
        }
      }
    }) 
    .state('tabs.fuel', {
      url: '/fuels/:fuelId',
      views: {
        'fuels-tab': {
          templateUrl: 'fuel.html',
          controller: 'FuelController',
          resolve: {
            fuel: function($stateParams, FuelsService) {
                return FuelsService.getFuel($stateParams.fuelId)
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
      controller: 'AboutCtrl',
      templateUrl: 'about.html'
    })  
   .state('donate', {
      url: '/donate',
      controller: 'DonateCtrl',
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

app.controller('FuelsController', function($scope, fuels) {
    console.log("In FuelsController...");
    $scope.fuels = fuels;
    //$http.get('js/fuels.json').success(function(data){
    //    $scope.fuels = data;
    //});
});

app.controller('FuelController', function($scope, fuel) {
    console.log("In FuelController...");
    $scope.fuel = fuel;
});

/*
app.controller('MoreController', function($scope, $ionicSideMenuDelegate) {

});
*/
app.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
    console.log("In AboutController...");
    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }
});

app.controller('DonateCtrl', function($scope, $ionicSideMenuDelegate) {
    console.log("In DonateController...");
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }
});