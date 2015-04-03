// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','pascalprecht.translate', 'ngMessages'])

.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if (window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.config(['$stateProvider','$urlRouterProvider','$translateProvider', '$ionicConfigProvider' ,function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {
$translateProvider.useStaticFilesLoader({
    prefix: 'lib/ionic/languages/locale-',
    suffix: '.json'
  });
$translateProvider.preferredLanguage('en_US')
.fallbackLanguage('en_US')
.useStorage('$localstorage');

// deutsche Sprache
// $translateProvider.translations('zh_CN', {
//   APP_HEADLINE:  '测试',
//   TAB_HOME:      '主页',
//   TAB_PRODUCTS:  '产品',
//   TAB_CART:      '购物篮',
//   NAV_ABOUT:     '关于'
// });

//   // englische Sprache
//   $translateProvider.translations('en_US', {
//     APP_HEADLINE:  'Awesome AngularJS App',
//     TAB_HOME:      'Home',
//     TAB_PRODUCTS:  'Products',
//     TAB_CART:      'Cart',
//     NAV_ABOUT:     'About'
//   });


  $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');

  $stateProvider
  .state('cart', {
    url: "/cart",
    templateUrl: "templates/cart.html",
    controller: 'CartCtrl'
  })
  
  .state('check-out', {
    url: "/check-out",
    templateUrl: "templates/check-out.html",
    controller: 'CheckOutCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'CatalogsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('account', {
    url: '/account',

        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'

  })

  .state('tab.products', {
    url: '/products',
    views: {
      'tab-products': {
        templateUrl: 'templates/tab-products.html',
        controller: 'ProductsCtrl'
      }
    }
  })

  // .state('filter', {
  //   url: "/filter",

  //       templateUrl: "templates/products-filter.html",
  //       controller: 'ProductsFilterCtrl'

  // })
  .state('product-detail', {
    url: '/product-detail/:productId',

        templateUrl: 'templates/product-detail.html',
        controller: 'ProductDetailCtrl'

  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

}])
.filter('sumOfValue', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum = sum + data[i][key];
        }
        return sum;
    }
})
.filter('totalSumPriceQty', function () {
    return function (data, key1, key2, key3) {
        if (typeof (data) === 'undefined' || typeof (key1) === 'undefined' || typeof (key2) === 'undefined' || typeof (key3) ==='undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum = sum + (data[i][key1] * data[i][key2]*data[i][key3]);
        }
        return sum;
    }
})
.filter('products', function() {
  return function(products, productName, maxPrice) {
    var out = [];
    var product;
    for (var i = 0; i < products.length; i++) {
      product = products[i].product;
      if(typeof (maxPrice) !== 'undefined'){
        if(product.name.toUpperCase().indexOf(productName.toUpperCase())!==-1&&product.price<=maxPrice){
          out.push(products[i]);
        }
      }else{
        if(product.name.toUpperCase().indexOf(productName.toUpperCase())!==-1){
          out.push(products[i]);
        }
      }
      
    }
    return out;
  };
});
