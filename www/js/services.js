angular.module('starter.services', ['ngResource'])
.constant('baseURI', 'https://www.jasonsystem.de/version2')
.constant('MAXQUANTITY', 10)
.constant('API_key','JASONSYSTEMAPI')
// https://www.jasonsystem.de/version2
// http://localhost:8080/SiaderSystemv2
.factory('HomeInfo', ['$resource', 'baseURI', function($resource, baseURI) {
  return $resource(baseURI+'/rest/ADContents');
}])
.factory('ShopProducts', ['$resource', 'baseURI', '$ionicLoading', function($resource, baseURI, $ionicLoading) {
  var currentCatalog = 2;
  var currentCatalogName="";
  var ShopProductsResource = $resource(baseURI+'/rest/shop_products', {}, {
       query: {
          method:'GET', 
          isArray:true,
          timeout: 20000
        }
      });
  var ShopProductResource = $resource(baseURI+'/rest/shop_products/:SPId');
  //get all products from the serve
  // var products = [];
  // ShopProductsResource.query({},function(data){
  //   products = data;
  // });
  
  return {
    setCatalogId: function(catalogId){
      currentCatalog = catalogId;
    },
    getCatalogId: function(){
      return currentCatalog;
    },
    setCatalogName: function(catalogName){
      currentCatalogName = catalogName;
    },
    getCatalogName: function(){
      return currentCatalogName;
    },
    singleResource: function() {
      // ShopProductResource.get({SPId: ShopProductId}, function(data){
      //   console.log("get shop_product");
      //   console.log(data);
      //   return null;
      // });
      return ShopProductResource;
      // for (var i = 0; i < products.length; i++) {
      //   if (products[i].product.id === parseInt(productId)) {
      //     return products[i];
      //   }
      // }
      
    },
    resource: function(){
      return ShopProductsResource;
    }
    // query: function() {
    //   return products;
    // },
    // updateProduct: function(){
    //   console.log();
    //   ShopProductsResource.query({catalogId:currentCatalog},
    //     function(){
    //       products = 
    //       return 
    //     },function(){
    //       return null;
    //     }
    //   );
    // }
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
        var item = {spid:product.id, pid:product.product.id,name:product.product.name,quantity:1,price:product.product.price,pack:product.product.pack};
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
.factory('PreOrder', ['$resource', 'baseURI', 'API_key', function($resource, baseURI, API_key) {
  return $resource(baseURI+'/rest/preorders',{},{
    save: {method: "POST", headers: {"API_key": API_key}}
  });
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
