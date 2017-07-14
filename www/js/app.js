// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'firebase', 'starter.controllers', 'starter.services', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  var ready = false;
  initFire();
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (navigator.splashscreen) {
        console.warn('Hiding splash screen');
        // We're done initializing, remove the splash screen
        navigator.splashscreen.hide();
    }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('confirm', {
    url: '/confirm',
    templateUrl: 'templates/confirm.html',
    controller: 'ConfirmCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.store-detail', {
    url: '/stores/:storeId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/store-detail.html',
        controller: 'StoreDetailCtrl'
      }
    }
  })

  .state('tab.offer-detail', {
    url: '/offers/:offerId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/offer-detail.html',
        controller: 'OfferDetailCtrl'
      }
    }
  })

  .state('tab.upload', {
    url: '/upload/:offerId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/upload.html',
        controller: 'UploadCtrl'
      }
    }
  })

  .state('tab.rewards', {
      url: '/rewards',
      views: {
        'tab-rewards': {
          templateUrl: 'templates/tab-rewards.html',
          controller: 'RewardsCtrl'
        }
      }
    })

    .state('tab.reward-detail', {
      url: '/rewards/:rewardId',
      views: {
        'tab-rewards': {
          templateUrl: 'templates/reward-detail.html',
          controller: 'RewardDetailCtrl'
        }
      }
    })

  .state('tab.bills', {
    url: '/bills',
    views: {
      'tab-bills': {
        templateUrl: 'templates/tab-bills.html',
        controller: 'BillsCtrl'
      }
    }
  })

  .state('tab.order-detail', {
    url: '/orders/:orderId',
    views: {
      'tab-account': {
        templateUrl: 'templates/order-detail.html',
        controller: 'OrderCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/register');

})

.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
});

function initFire(){
       var config = {
        apiKey: "AIzaSyAknjCMHJzLkuHzo2hVlmRZbIBiRhUFPWM",
        authDomain: "rewards-on-deals.firebaseapp.com",
        databaseURL: "https://rewards-on-deals.firebaseio.com",
        storageBucket: "rewards-on-deals.appspot.com",
        messagingSenderId: "939388628630"
      };
      firebase.initializeApp(config);
};