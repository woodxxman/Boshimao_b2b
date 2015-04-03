angular.module('starter.services', ['ngResource'])
.constant('baseURI', '')
.constant('MAXQUANTITY', 10)
// http://localhost:8080/SiaderSystemv2
.factory('ShopProducts', ['$resource', 'baseURI', function($resource, baseURI) {
  var currentCatalog = 2;
  var products = $resource(baseURI+'/rest/shop_products', {}, {
       query: {method:'GET', params:{catalogId:currentCatalog}, isArray:true}
      }).query();
  
  return {
    setCatalogId: function(catalogId){
      currentCatalog = catalogId;
    },
    get: function(productId) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].product.id === parseInt(productId)) {
          return products[i];
        }
      }
      return null;
    },
    query: function() {
      return products;
    },
    updateProduct: function(){
      products = $resource(baseURI+'/rest/shop_products', {}, {
       query: {method:'GET', params:{catalogId:currentCatalog}, isArray:true}
      }).query();
    }
  }
}])
.factory('Catalogs', ['$resource', 'baseURI', function($resource, baseURI) {
  return $resource(baseURI+'/rest/catalog?leaf=1');
}])
.factory('Cart', ['MAXQUANTITY', function(MAXQUANTITY) {
  var cart = [];
  var pids = [];
  var quantityOption = [];
  for (var i = 1; i <= MAXQUANTITY; i++) {
     quantityOption.push(i);
  }
  
  return {
    addCartItem: function(product){
      var listIndex = pids.indexOf(product.product.id);
      if(listIndex==-1){
        var item = {pid:product.product.id,name:product.product.name,quantity:1,price:product.product.price,pack:product.product.pack};
        cart.push(item);
        pids.push(product.product.id);
      }else{
        if(cart[listIndex].quantity<MAXQUANTITY){
          cart[listIndex].quantity = cart[listIndex].quantity+1;
        }
      }
    },
    remove: function(cartItem) {
      pids.splice(pids.indexOf(cartItem.pid), 1);
      cart.splice(cart.indexOf(cartItem), 1);
    },
    query: function() {
      return cart;
    },
    getQuantityOption: function(){
      return quantityOption;
    },
    clearCart: function(){
      cart = [];
    }
  };
}])
.factory('FilterInfo', [function() {

  var searchStr = '';
  var maxPrice = 50;
  
  return {
    getSearchStr: function() {
      return searchStr;
    },
    setSearchStr: function(value) {
      searchStr = value;
    },
    getMaxPrice: function() {
      return maxPrice;
    },
    setMaxPrice: function(value) {
      maxPrice = value;
    },
    reset: function(){
      searchStr = '';
      maxPrice = 50;
    }
  };
}])
.factory('PreOrder', ['$resource', 'baseURI', function($resource, baseURI) {
  return $resource(baseURI+'/rest/preorders');
}])
.factory('$localstorage', ['$window', function($window) {
  return {
    put: function(key, value) {
      $window.localStorage[key] = value;
    },
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
    clearAll: function(){
      $window.localStorage.clear();
    }
  }
}]);
