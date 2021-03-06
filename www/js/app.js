var app = angular.module('myApp', ['ionic']);

app.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs, form) {
        form.$submitted = false;
        var fn = $parse(attrs.onValidSubmit);
        element.on('submit', function(event) {
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            if (form.$valid) {
              if (typeof fn === 'function') {
                fn(scope, {$event: event});
              }
            }
          });
        });
      }
    }
 
  }])
.directive('validated', ['$parse', function($parse) {
    return {
      restrict: 'AEC',
      require: '^form',
      link: function(scope, element, attrs, form) {
        var inputs = element.find("*");
        for(var i = 0; i < inputs.length; i++) {
          (function(input){
            var attributes = input.attributes;
            if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
              var field = form[attributes.name.value];
              if (field != void 0) {
                scope.$watch(function() {
                  return form.$submitted + "_" + field.$valid;
                }, function() {
                  if (form.$submitted != true) return;
                  var inp = angular.element(input);
                  if (inp.hasClass('ng-invalid')) {
                    element.removeClass('has-success');
                    element.addClass('has-error');
                  } else {
                    element.removeClass('has-error').addClass('has-success');
                  }
                });
              }
            }
          })(inputs[i]);
        }
      }
    }
  }])
;

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
    getNextId: function(key) {
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      var maxId = Math.max.apply(null,arrayobj.map(function(o){ return o.id; }));
      var nextId = parseInt(maxId) + 1;
      if(isNaN(nextId)) {
        nextId = 1;
      }
      console.log("maxId: " + maxId);
      console.log("nextId: " + nextId);
      return nextId;
    },
    getPreviousOdometer: function(key) {
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      // initialize the collection if not already exist
      if("{}" == JSON.stringify(arrayobj)) {
        arrayobj = [];
      }
      var arraylength = arrayobj.length;
      console.log("array length = " + arraylength);

      var previousOdometer = 0;
      if(arraylength > 0) {
        previousOdometer = arrayobj[arraylength-1].odometer;
      }

      console.log("previousOdometer = " + previousOdometer);
      return previousOdometer;
    },
    getPreviousFuelRate: function(key) {
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      // initialize the collection if not already exist
      if("{}" == JSON.stringify(arrayobj)) {
        arrayobj = [];
      }
      var arraylength = arrayobj.length;
      console.log("array length = " + arraylength);

      var previousFuelRate = 0;
      if(arraylength > 0) {
        previousFuelRate = arrayobj[arraylength-1].litrerate;
      }

      console.log("previousFuelRate = " + previousFuelRate);
      return previousFuelRate;
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
      console.log('test array: ' + JSON.stringify(testobj));
    },
    updateObjectToArray: function(key, element, elementId) {
      console.log('In updateObjectToArray');
      // retrieve array object as Json based on key
      var arrayobj = JSON.parse($window.localStorage[key] || '{}');
      console.log('old array: ' + JSON.stringify(arrayobj));

      // update element at position elementId in arrayobj
      console.log("elementId to replace: " + elementId);

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

  // var fuel_element = {
  //         id: 4,
  //         "vehicle": {
  //           "name": "Honda"
  //         },
  //         "date": 2013-09-08,
  //         "odometer": 65000,
  //         "litres": 12,
  //         "litrerate": 12,
  //         "total": 12,
  //         "fulltank": false,
  //         "location": "Auckland"
  //     };

  // mylocalstorageservice.pushObjectToArray('fuels', fuel_element);

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


app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(true);
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');

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
          controller: 'FuelsController'
        }
      }
    }) 
    .state('tabs.editfuel', {
      url: '/fuels/:fuelId',
      views: {
        'fuels-tab': {
          templateUrl: 'editfuel.html',
          controller: 'FuelController',
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
          controller: 'FuelController',
          resolve: {
            fuel: function($stateParams, FuelsService) {
                return {}
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

app.controller('FuelsController', function($scope, mylocalstorageservice, $state, $interval, $ionicActionSheet, $ionicListDelegate) {
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

    $scope.confirmDelete = function(fuelId) {
      // show ionic actionSheet to confirm delete operation
      // show() returns a function to hide the actionSheet
      var hideSheet = $ionicActionSheet.show({
        titleText: 'Are you sure that you\'d like to delete this fuel?',
        cancelText: 'Cancel',
        destructiveText: 'Delete',
        cancel: function () {
          // if the user cancel's deletion, hide the list item's delete button
          $ionicListDelegate.closeOptionButtons();
        },
        destructiveButtonClicked: function () {
          // delete expense by its id property            
          // $scope.expenses = ExpenseSvc.deleteExpense(expenseId);
          mylocalstorageservice.removeObjectFromArray('fuels', fuelId);
          $scope.fuels = mylocalstorageservice.getObject('fuels');
          $scope.$broadcast('scroll.refreshComplete');  

          // hide the confirmation dialog
          hideSheet();
        }
      });      
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

app.controller('FuelController', function($scope, fuel, mylocalstorageservice, $state, $ionicSideMenuDelegate) {
  console.log("In FuelController...");
  console.log("input fuel : " + JSON.stringify(fuel));

  // set fuel to scope
  $scope.fuel = fuel;

  var addOrEdit = '';

  // find if add or edit and initialize scope variables.
  if(fuel.id > 0) {
    console.log("id exist...  edit scenario");
    addOrEdit = 'edit';
    // set date formatter
    $scope.fuel.date = new Date(fuel.date);
  } else {
    console.log("id does not exist..  add scenario");
    addOrEdit = 'add';
    // set default values
    $scope.fuel = {};
    $scope.fuel.id = mylocalstorageservice.getNextId('fuels');
    $scope.fuel.date = new Date();
    $scope.fuel.vehicle = {};
    $scope.fuel.vehicle.name = "Honda";
    $scope.fuel.previousOdometer = mylocalstorageservice.getPreviousOdometer('fuels');
    $scope.fuel.litrerate = mylocalstorageservice.getPreviousFuelRate('fuels');
  }

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }

  $scope.save = function(fuel) {
    console.log("in FuelController.save function");
    if(addOrEdit == 'add') {
      // calculate tripkm
      fuel.tripkm = parseInt(fuel.odometer) - parseInt(fuel.previousOdometer);
      mylocalstorageservice.pushObjectToArray('fuels', fuel);
      console.log("fuel details added to fuels.. transfering page to tabs.fuels")
    } else if(addOrEdit == 'edit') {
      mylocalstorageservice.updateObjectToArray('fuels', fuel, fuel.id);
      console.log("fuel details updated to fuels.. transfering page to tabs.fuels");
    }
    // transfer to Fuels list
    $state.go('tabs.fuels');
  }

  $scope.changelitres = function() {
    console.log("change: litres..  update total");
    $scope.fuel.total = $scope.fuel.litrerate*$scope.fuel.litres;
  }

  $scope.changerate = function() {
    console.log("change: rate..  update total");
    $scope.fuel.total = $scope.fuel.litrerate*$scope.fuel.litres;
  }

  $scope.changetotal = function() {
    console.log("change: total.. ");
    if($scope.fuel.litrerate>0) {
      console.log("update litres");
      $scope.fuel.litres = $scope.fuel.total / $scope.fuel.litrerate;
    } else if ($scope.fuel.litres>0) {
      console.log("update litrerate");
      $scope.fuel.litrerate = $scope.fuel.total / $scope.fuel.litres;
    }      
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