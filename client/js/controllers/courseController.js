angular.module('courses').controller('CoursesController', ['$scope', 'Locations', 'Courses', '$http',

  function ($scope, Locations, Courses, $http) {
    /* Get all the courses, then bind it to the scope */
    Courses.getAll().then(function (response) {
      $scope.courses = response.data.courses;
      $scope.user = response.data.user;
      $scope.admins = response.data.admins;
      console.log($scope.user);
      $scope.LinkedInLink = $scope.user.linkedIn;
      $scope.TwitterLink = $scope.user.twitter;
      if (!$scope.user || $scope.user.isAdmin != $scope.isAdmin) {
        window.location.href = '/';
      }
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
    $scope.user = {};
    $scope.selectedTAs = [];
    let tempMarker = 0;
    $scope.admins = [];
    $scope.profileUpdating = false;
    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.adminDetails = undefined;
    $scope.OfficeHour = {};

    $scope.updateAdminDetails = function (admin) {
      $scope.adminDetails = $scope.admins[$scope.admins.indexOf(admin)];
      if ($scope.adminDetails.location) {
        updateMiniMap($scope.adminDetails.location.latitude, $scope.adminDetails.location.longitude);
      }
    };

    $scope.updateLocation = function () {

      if (!$scope.BuildingCode) {
        return;
      }
      $scope.profileUpdating = true;
      $scope.updateError = false;
      $scope.updateSuccess = false;

      let location = findCoordinates($scope.BuildingCode, Locations.data);

      if (!location) {
        $scope.updateError = true;
        $scope.profileUpdating = false;
        return;
      }
      let long = location.long;
      let lat = location.lat;

      $http.post("/api/profile/location", { lat: lat, long: long })
        .then(function (response) {
          console.log(response.data);
          $scope.profileUpdating = false;
          $scope.updateSuccess = true;
        }, function (response) {
          console.log(response.status);
          $scope.profileUpdating = false;
          $scope.updateError = true;
        });
    };

    $scope.updateLink = function () {
      $scope.profileUpdating = true;
      $scope.updateError = false;
      $scope.updateSuccess = false;

      $http.post("/api/profile/link", { linkedIn: $scope.LinkedInLink, twitter: $scope.TwitterLink })
        .then(function (response) {
          console.log(response.data);
          $scope.profileUpdating = false;
          $scope.updateSuccess = true;
        }, function (response) {
          console.log(response.status);
          $scope.profileUpdating = false;
          $scope.updateError = true;
        });
    };

    $scope.updateOH = function () {
      $scope.updateError = false;
      $scope.updateSuccess = false;
      let oh = $scope.OfficeHour;

      if (!oh || !(oh.alias && oh.day && oh.startTime && oh.startCode && oh.endTime && oh.endCode && oh.buildingCode && oh.buildingNumber)) {
        $scope.updateError = true;
        return;
      }

      $scope.profileUpdating = true;

      $http.post("/api/profile/OH", { oh: oh })
        .then(function (response) {
          console.log(response.data);
          $scope.profileUpdating = false;
          $scope.updateSuccess = true;
        }, function (response) {
          console.log(response.status);
          $scope.profileUpdating = false;
          $scope.updateError = true;
        });
    };

    $scope.showMyCourses = function () {
      let result = [];
      $scope.isSearching = true;
      $scope.user.courses.forEach(function (course) {
        Courses.getByCode(course, 2188).then(function (response) {
          result.push(response.data[0]);
        }, function (error) {
          console.log('Unable to retrieve Course Data By Code:', error);
        });
      });
      $scope.isSearching = false;
      $scope.courses = result;
    };

    function findCoordinates(code, buildings) {

      for (let i = 0; i < buildings.length; i++) {

        if (buildings[i].ABBREV === code) {
          return {
            lat: buildings[i].LAT,
            long: buildings[i].LON
          };
        }

      }

      return null;

    }

    $scope.logout = function () {
      $http.delete('/api/auth/logout').then(function (response) {
        if (response.status == 200)
          window.location.href = '/login';
      });
    }

    $scope.updateMiniMap = function (building) {
      let coordinates = findCoordinates(building, Locations.data);
      if (!coordinates) {
        return;
      }
      updateMiniMap(coordinates.lat, coordinates.long);
    }

    function updateMiniMap(lat, long) {

      mini_map.flyTo({
        center: [
          long,
          lat
        ],
        zoom: 18
      });

      mini_map.addLayer({
        id: "markers" + tempMarker++,
        type: "symbol",
        /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{ "type": "Feature", "geometry": { "type": "Point", "coordinates": [long, lat] } }]
          }
        },
        layout: {
          "icon-image": "custom-marker",
        }
      });

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
        Courses.getByCode($scope.searchText, $scope.term).then(function (response) {
          $scope.courses = response.data;
          console.log('Succesfully grabbed Course Data By Code!', response.data);
          $scope.isSearching = false;
        }, function (error) {
          console.log('Unable to retrieve Course Data By Code:', error);
          $scope.isSearching = false;
        });
      }
      else if ($scope.searchOption === 2) {
        Courses.getByTitle($scope.searchText, $scope.term).then(function (response) {
          $scope.courses = response.data;
          console.log('Succesfully grabbed Course Data By Title!', response.data);
          $scope.isSearching = false;
        }, function (error) {
          console.log('Unable to retrieve Course Data By Title:', error);
          $scope.isSearching = false;
        });
      }
      else {
        Courses.getByProfessor($scope.searchText, $scope.term).then(function (response) {
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
      if ($scope.detailedInfo.sections && $scope.detailedInfo.sections.length >= 1 && $scope.detailedInfo.sections[0].meetTimes && $scope.detailedInfo.sections[0].meetTimes.length >= 1) {
        $scope.updateMap($scope.detailedInfo.sections[0].meetTimes[0].meetBuilding);
      }

      Courses.grabTAs($scope.detailedInfo.code).then(
        function (res) {
          $scope.selectedTAs = res.data;
        },
        function (res) {
          console.log(response.status);
        });
    };

    $scope.resetMsg = function () {
      $scope.updateError = $scope.updateSuccess = false;
    }
  }
]);