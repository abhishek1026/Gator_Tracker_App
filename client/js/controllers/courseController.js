angular.module('courses').controller('CoursesController', ['$scope', 'Locations', 'Courses',

  function ($scope, Locations, Courses) {
    /* Get all the courses, then bind it to the scope */
    Courses.getAll().then(function (response) {
      $scope.courses = response.data;
      $scope.isLoading = false;
      console.log('Succesfully grabbed Course Data!', response.data);
    }, function (error) {
      console.log('Unable to retrieve Course Data:', error);
    });

    $scope.detailedInfo = undefined;
    $scope.isSearching = false;
    $scope.isLoading = true;
    $scope.searchText = "";
    $scope.searchOption = 0;
    $scope.keyWord = "";
    let tempMarker = 0;

    function findCoordinates(code, buildings) {

      for (let i = 0; i < buildings.length; i++) {

        if (buildings[i].ABBREV === code) {
          return {
            lat: buildings[i].LAT,
            long: buildings[i].LON
          };
        }

      }

      return {};

    }

    $scope.updateMap = function (building) {

      let coordinates = findCoordinates(building, Locations.data);


      map.flyTo({
        center: [
          coordinates.long,
          coordinates.lat
        ],
        zoom: 16
      });

      map.addLayer({
        id: "markers" + tempMarker++,
        type: "symbol",
        /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{ "type": "Feature", "geometry": { "type": "Point", "coordinates": [coordinates.long, coordinates.lat] } }]
          }
        },
        layout: {
          "icon-image": "custom-marker",
        }
      });

    };

    $scope.updateResults = function () {

      $scope.isSearching = true;
      if ($scope.searchOption === 1) {
        Courses.getByCode($scope.searchText).then(function (response) {
          $scope.courses = response.data;
          console.log('Succesfully grabbed Course Data By Code!', response.data);
          $scope.isSearching = false;
        }, function (error) {
          console.log('Unable to retrieve Course Data By Code:', error);
          $scope.isSearching = false;
        });
      }
      else if ($scope.searchOption === 2) {
        Courses.getByTitle($scope.searchText).then(function (response) {
          $scope.courses = response.data;
          console.log('Succesfully grabbed Course Data By Title!', response.data);
          $scope.isSearching = false;
        }, function (error) {
          console.log('Unable to retrieve Course Data By Title:', error);
          $scope.isSearching = false;
        });
      }
      else {
        Courses.getByProfessor($scope.searchText).then(function (response) {
          $scope.courses = response.data;
          console.log('Succesfully grabbed Course Data By Professor!', response.data);
          $scope.isSearching = false;
        }, function (error) {
          console.log('Unable to retrieve Course Data By Professor:', error);
          $scope.isSearching = false;
        });
      }
    };

    $scope.setOption = function (option) {
      let optionVal = +option;
      $scope.searchOption = optionVal;
      $scope.keyWord = (optionVal == 1) ? "By Code" : (optionVal == 2) ? "By Title" : "By Professor";
    };

    $scope.showDetails = function (course) {
      $scope.detailedInfo = $scope.courses[$scope.courses.indexOf(course)];
    };
  }
]);