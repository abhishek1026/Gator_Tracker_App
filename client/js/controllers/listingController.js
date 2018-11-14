angular.module('listings').controller('ListingsController', ['$scope', 'Listings', 
  function($scope, Listings) {
    $scope.listings = undefined;

    Listings.getAll().then(function(response) {
      $scope.listings = response.data;
      console.log('Succesfully grabbed Listing Data!', response.data);
    }, function(error) {
      console.log('Unable to retrieve listings! ', error);
      alert('Unable to retrieve listings!');
    });

    $scope.searchText = "";
    $scope.name = "";
    $scope.code = "";
    $scope.latitude = "";
    $scope.longitude = "";
    $scope.address = "";
    $scope.formError = false;
    $scope.postSuccess = false;
    $scope.putSuccess = false;

    $scope.addListing = function() {

      if($scope.formError == true){
        $scope.formError = false;
      }

      if($scope.putSuccess == true){
        $scope.putSuccess = false;
      }

      if($scope.postSuccess == true){
        $scope.postSuccess = false;
      }

      if($scope.name == "" || $scope.code == "" ||$scope.latitude == "" || $scope.longitude == "" || $scope.address == ""){
        $scope.formError = true;
        return;
      }

      var newListing = {
        name: $scope.name,
        code:  $scope.code,
        coordinates: {
          latitude: Number($scope.latitude),
          longitude: Number($scope.longitude)
        },
        address: $scope.address
      };

      var updatedListing = {
        name: $scope.name,
        code: $scope.code,
        latitude: Number($scope.latitude),
        longitude: Number($scope.longitude),
        address: $scope.address
      };

      if(listContains($scope.code)){
        $scope.listings.forEach(function(listing, i){
          if(listing.code == $scope.code){
            Listings.update(listing._id, updatedListing).then(function(response) {
              $scope.listings[i] = response.data;
              console.log('Succesfully updated listing! ', response.data);
              $scope.putSuccess = true;
            }, function(error) {
              console.log('Unable to update listing! ', error);
              alert('Unable to update listing!');
            });
          }
        });  
        
      }
      else{
        Listings.create(newListing).then(function(response) {
          $scope.listings.push(response.data);
          console.log(response.data);
          console.log('Succesfully created listing! ', response.data);
          $scope.postSuccess = true;
        }, function(error) {
          console.log('Unable to create listing! ', error);
          alert('Unable to create listing!');
        });
      }

      function listContains(code){
        var result = false;
        $scope.listings.forEach(function(listing){
          if(listing.code == code){
            result = true;
          }
        });
        return result;
      }

      $scope.name = $scope.code = $scope.address = $scope.latitude = $scope.longitude = "";

    };

    $scope.deleteListing = function(code) {

      if($scope.detailedInfo && $scope.detailedInfo.code == code){
        $scope.detailedInfo = null;
      }

      $scope.listings.forEach(function(listing, i){
        if(listing.code == code){
          Listings.delete(listing._id).then(function(response) {
            $scope.listings.splice(i, 1);
            console.log('Succesfully deleted listing! ', response.data);
          }, function(error) {
            console.log('Unable to delete listing! ', error);
            alert('Unable to delete listing!');
          });
        }
      });

    };

    $scope.showDetails = function(code) {

      var listObject = $scope.listings.filter(function(lo){
        return lo.code == code;
      })[0];

      $scope.detailedInfo = {
        name: (listObject.name) ? listObject.name : "N/A",
        code:  (listObject.code) ? listObject.code : "N/A",
        latitude: (listObject.coordinates) ? listObject.coordinates.latitude : "N/A",
        longitude: (listObject.coordinates) ? listObject.coordinates.longitude : "N/A",
        address: (listObject.address) ? listObject.address : "N/A"
      };

    };
  }
]);