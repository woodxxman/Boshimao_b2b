angular.module('starter.controllers', ['pascalprecht.translate'])

.controller('HomeCtrl', ['$scope', '$translate', 'HomeInfo', '$ionicSlideBoxDelegate', 'baseURI', '$ionicLoading', function($scope, $translate, HomeInfo, $ionicSlideBoxDelegate, baseURI, $ionicLoading) {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    showDelay: 0
  });
  $scope.baseURI = baseURI;
  $scope.data = {};
  $scope.data.slides = HomeInfo.query({locaiton:'home',type:1,status:1},
    function(){
    $ionicSlideBoxDelegate.update(); 
    $ionicLoading.hide();
  },function(){
    $ionicLoading.hide();
  });
  $scope.data.ADs = HomeInfo.query({locaiton:'home',type:2,status:1});
}])

.controller('AccountCtrl', function($scope, $translate, $localstorage, $ionicPopup, $ionicHistory, $state) {
  $scope.setting = {};
  var language = $translate.use();
   
  $scope.setting.languageOption = [
    {label:"中文", value:"zh_CN"},
    {label:"Polski", value:"pl_PL"},
    {label:"Englich", value:"en_US"}
  ];
  $scope.setting.currentLanguage = $scope.setting.languageOption[0];
  for (var i = $scope.setting.languageOption.length - 1; i >= 0; i--) {
    if($scope.setting.languageOption[i].value == language)
      $scope.setting.currentLanguage = $scope.setting.languageOption[i];
  };
  $scope.goBack = function(){
    $state.go('tab.home');
  };
  $scope.update = function(){
    $translate.use($scope.setting.currentLanguage.value).then(function (key) {
      //$state.go($state.current, {}, {reload: true});
    }, function (key) {
    });
  }
  $scope.clearStorage = function(){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Clear All Setting',
     template: 'Are you sure you want to clear all settings?',
     okText: 'Clear',
     okType: 'button-assertive'
   });
   confirmPopup.then(function(res) {
     if(res) {
        console.log($localstorage);
        $localstorage.clearAll();
        console.log($localstorage);
     } else {
       console.log('You are not sure');
     }
   });
  }
  //console.log($scope.setting.language);
})
.controller('CatalogsCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$ionicTabsDelegate', 'Catalogs', 'ShopProducts',function($scope, $rootScope, $ionicScrollDelegate, $ionicTabsDelegate, Catalogs, ShopProducts) {
  $scope.catalogs = Catalogs.query({catalogId:1});
  $scope.showCatalog = function(catalogId, catalogName){
    ShopProducts.setCatalogId(catalogId);
    ShopProducts.setCatalogName(catalogName);
    ShopProducts.updateProduct();
    $rootScope.$broadcast("catalogChanged");

    $ionicScrollDelegate.scrollTop();
    $ionicTabsDelegate.select(1);
  }
}])

.controller('ProductsCtrl', ['$scope', '$state', 'ShopProducts', 'Cart', 'baseURI', 'productsFilter', 'FilterInfo', '$rootScope', '$ionicModal', function($scope, $state, ShopProducts, Cart, baseURI, productsFilter, FilterInfo, $rootScope, $ionicModal) {
  $scope.baseURI = baseURI;
  $scope.title = "Product";
  $scope.products = ShopProducts.query();
  $scope.filter = {};
  $scope.filter.maxPrice = FilterInfo.getMaxPrice();
  $scope.filter.searchStr = FilterInfo.getSearchStr();
  $scope.filter.active = false;

  // update products when catalog changed
  $scope.$on('catalogChanged', function (event, data) {
    $scope.filter.active = false;
    $scope.filter.searchStr = '';
    $scope.title = ShopProducts.getCatalogName()
    $scope.products = ShopProducts.query();
  });
  $ionicModal.fromTemplateUrl('templates/products-filter.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.getNameFilter = function(){
    FilterInfo.setSearchStr($scope.filter.searchStr);
    $scope.products = productsFilter(ShopProducts.query(), $scope.filter.searchStr);
  }
  $scope.getFilter = function(){
    $scope.filter.active = true;
    FilterInfo.setSearchStr($scope.filter.searchStr);
    FilterInfo.setMaxPrice($scope.filter.maxPrice);
    $scope.products = productsFilter(ShopProducts.query(), $scope.filter.searchStr, $scope.filter.maxPrice);
    $scope.modal.hide();
  };
  $scope.clearSearchStr = function(){
    $scope.filter.searchStr = '';
    if($scope.filter.active)
      $scope.products = productsFilter(ShopProducts.query(), $scope.filter.searchStr, $scope.filter.maxPrice);
    else
      $scope.products = ShopProducts.query();
    
  }
  $scope.clearFilter = function(){
    FilterInfo.reset();
    $scope.filter.active = false;
    $scope.filter.maxPrice = FilterInfo.getMaxPrice();
    $scope.filter.searchStr = FilterInfo.getSearchStr();
    $scope.products = ShopProducts.query();
    $scope.modal.hide();
  }
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // $rootScope.$on('filterActive', function (event, data) {
  //   $scope.products = [];
  // });
  // //clear rootScope when scope destroyed
  // var destoryListener = $rootScope.$on('filterActive', function (event, data) {
  // });
  // // $scope $destroy
  // $scope.$on('$destroy', destoryListener);

  $scope.doRefresh = function() {
    ShopProducts.updateProduct();
    $scope.filter.active = false;
    $scope.filter.searchStr = '';
    $scope.products = ShopProducts.query();
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply()
  };
  $scope.addToCart = function(product) {
    Cart.addCartItem(product);
  //$scope.$broadcast('addToCart', product);
  };
  $scope.goFilter = function(){
    $state.go('filter');
  };
}])

.controller('ProductDetailCtrl', ['$scope', '$stateParams', '$ionicHistory', '$state', 'ShopProducts', 'Cart', 'baseURI', function($scope, $stateParams, $ionicHistory, $state, ShopProducts, Cart, baseURI) {
  $scope.baseURI = baseURI;
  $scope.productInfo = ShopProducts.get($stateParams.productId);
  if($scope.productInfo==null){
    $state.go('tab.products');
  }
  $scope.goBack = function(){
    if($ionicHistory.backView()!=null)
      $ionicHistory.goBack();
    else
      $state.go('tab.products');
  };
  $scope.goCart = function(){
    $state.go('cart');
  };
  $scope.addToCart = function(product) {
    Cart.addCartItem(product);
  };
}])
// .controller('ProductsFilterCtrl', function($scope, $ionicHistory, $state, $rootScope, FilterInfo) {
//   $scope.filter = {};
//   $scope.filter.maxPrice = FilterInfo.getMaxPrice();
//   $scope.filter.searchStr = FilterInfo.getSearchStr();
//   $scope.goBack = function(){
//     $state.go('tab.products');
//   };
//   $scope.getFilter = function(){
//     FilterInfo.setSearchStr($scope.filter.searchStr);
//     FilterInfo.setMaxPrice($scope.filter.maxPrice);
    
//     $state.go('tab.products');
//     $rootScope.$emit("filterActive");
//     //$state.go('tab.products');
//   };
// })
.controller('CartCtrl', ['$scope', '$ionicHistory', '$state', 'baseURI', 'Cart', function($scope, $ionicHistory, $state, baseURI, Cart) {
  $scope.baseURI = baseURI;
  $scope.cart = Cart.query();
  $scope.remove = function(cartItem){
    Cart.remove(cartItem);
  };
  $scope.data = {
    showDelete: false
  };
  $scope.goBack = function(){
    if($ionicHistory.backView()!=null)
      $ionicHistory.goBack();
    else
      $state.go('tab.home');
  };
  $scope.quantityOptions = Cart.getQuantityOption();
  $scope.getTotalSum = function(){
    var total = 0;
    for(var i = 0; i<$scope.cart.length; i++){
      var product = $scope.cart[i];
      total += (product.price * product.quantity * product.pack);
    }
    return total;
  };
  $scope.getTotalCarton = function(){
    var total = 0;
    for(var i = 0; i < $scope.cart.length; i++){
      var product = $scope.cart[i];
      total += product.quantity;
    }
    return total;
  };
  $scope.checkOut = function(){
    $state.go('check-out');
  };
}])
.controller('CheckOutCtrl', ['$scope', '$ionicHistory', '$state', '$ionicPopup','$timeout','$localstorage', 'baseURI', 'Cart', 'PreOrder', 'API_key', function($scope, $ionicHistory, $state, $ionicPopup,$timeout,$localstorage, baseURI, Cart, PreOrder, API_key) {
  $scope.baseURI = baseURI;
  $scope.cart = Cart.query();
  if($scope.cart.length<=0){
    $state.go('tab.home');
  }
  $scope.remove = function(cartItem){
    Cart.remove(cartItem);
  };
  $scope.data = {
    showDelete: false
  };
  $scope.goBack = function(){
    if($ionicHistory.backView()!=null)
      $ionicHistory.goBack();
    else
      $state.go('tab.home');
  };
  $scope.quantityOptions = Cart.getQuantityOption();
  $scope.getTotalSum = function(){
    var total = 0;
    for(var i = 0; i < $scope.cart.length; i++){
      var product = $scope.cart[i];
      total += (product.price * product.quantity * product.pack);
    }
    return total;
  };
  $scope.getTotalCarton = function(){
    var total = 0;
    for(var i = 0; i < $scope.cart.length; i++){
      var product = $scope.cart[i];
      total += product.quantity;
    }
    return total;
  };

  var customerName = $localstorage.get('customerName','');
  var telefon = $localstorage.get('telefon','');
  var address = $localstorage.get('address','');
  var message = $localstorage.get('message','');
  $scope.sendData = {
      name : customerName,
      telefon : telefon,
      address : address,
      message : message,
      cart: $scope.cart
  };
  $scope.saveInLocal = function(name, value){
    $localstorage.set(name, value);
  }

  $scope.confirm = function(form) {
    if(form.$valid){

      //send preorder
      var preorder = new PreOrder($scope.sendData);

      preorder.$save(
        function(u, responseHeaders) {
          
          //clear message
          $localstorage.set('message', '');
          //clear cart
          Cart.clearCart();
          $scope.cart = Cart.query();

          var myPopup = $ionicPopup.show({
            title: '<h2> <i class="icon balanced ion-ios-checkmark"></i></h2>',
            scope: $scope
          });
          $timeout(function() {
             myPopup.close(); 
             $state.go('tab.home');
          }, 1500);
          

        },
        function(responseHeaders){
          var myPopup = $ionicPopup.show({
            title: '<h2> <i class="icon assertive ion-ios-close"></i></h2>',
            scope: $scope
          });
          $timeout(function() {
             myPopup.close(); 
          }, 1500);
          //clear message
          $localstorage.set('message', '');
      });
    }else{
      return false;
    }   
  };
}])
.directive('fallbackSrc', function () {
  return{
    link: function postLink(scope, element, attrs) {
      element.bind('error', function () {
        angular.element(this).attr("src", attrs.fallbackSrc);
      });
    }
  }
});