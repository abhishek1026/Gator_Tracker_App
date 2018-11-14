angular.module('courses').controller('RegisterController', ['$scope', '$http',

    function ($scope, $http) {

        $scope.formError = false;
        $scope.inputError = false;
        $scope.newUsername = "";
        $scope.newPassword = "";
        $scope.email = "";

        $scope.register = function () {

            $scope.formError = false;
            $scope.inputError = false;

            if ($scope.newUsername == undefined || $scope.newPassword == undefined || $scope.email == undefined ||
                $scope.newUsername == "" || $scope.newPassword == "" || $scope.email == "") {
                $scope.formError = true;
                return;
            }

            $http.post('/api/auth/create', { username: $scope.newUsername, password: $scope.newPassword, email: $scope.email })
                .then(function (response) {
                    console.log(response.data);
                    window.location.href = "/index.html";
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