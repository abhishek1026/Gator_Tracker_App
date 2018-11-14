angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('/api/listings');
    },
	  create: function(listing) {
	  return $http.post('/api/listings', listing);
    },
    delete: function(id) {
	   return $http.delete(`/api/listings/${id}`);
    },
    update: function(id, listing) {
      return $http.put(`/api/listings/${id}`, listing);
    }
  };
  return methods;
});
