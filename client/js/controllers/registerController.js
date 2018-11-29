angular.module('courses').controller('RegisterController', ['$scope', '$http',

    function ($scope, $http) {

        $scope.formError = false;
        $scope.inputError = false;
        $scope.newUsername = "";
        $scope.newPassword = "";
        $scope.email = "";
        $scope.displayName ="";
        $scope.role = "";
        $scope.courses = "";

        $scope.login = function() {
            window.location.href = "/login";
        }

        $scope.updateSelect = function() {
            if($scope.isAdmin){
                $scope.role = "TA";
                return;
            }
            $scope.role = "Student";
        }

        $scope.register = function () {

            $scope.formError = false;
            $scope.inputError = false;

            if ($scope.newUsername == undefined || $scope.newPassword == undefined || $scope.email == undefined ||
                $scope.newUsername == "" || $scope.newPassword == "" || $scope.email == "" || $scope.displayName == undefined 
                || $scope.displayName == "" || $scope.role == undefined || $scope.role == "") {
                $scope.formError = true;
                return;
            }

            function fineTrim(arr) {

                result = [];

                for(let i = 0; i < arr.length; i++){
                    result.push(arr[i].trim());
                }

                return result;
            }

            if($scope.courses === undefined){
                $scope.courses = "";
            }

            let courses = fineTrim($scope.courses.split(","));

            $http.post('/api/auth/create', { username: $scope.newUsername, password: $scope.newPassword, email: $scope.email, 
                        isAdmin: $scope.isAdmin, name: $scope.displayName, role: $scope.role, courses: courses})
                .then(function (response) {
                    console.log(response.data);
                    window.location.href = "/login";
                },
                    function (response) {
                        if (response.status !== 200) {
                            console.log(response.status);
                            $scope.inputError = true;
                        }
                    });

        };

    }

]);