angular.module('courses').controller('LoginController', ['$scope', '$http', 

  function($scope, $http) {
    
    $scope.formError = false;
    $scope.inputError = false;
    $scope.username = "";
    $scope.password = "";

    $scope.logIn = function(){

        $scope.formError = false;
        $scope.inputError = false;

        if($scope.username === undefined || $scope.password == undefined || $scope.username == "" || $scope.password == ""){
            $scope.formError = true;
            return;
        }

        $http.post('/api/auth/authorize', {username: $scope.username, password: $scope.password})
            .then(function(response){
                if(response.status === 200)
                    window.location.href = "/admin/" + $scope.username;
                else
                    window.location.href = "/user/" + $scope.username;
            },
            function(response){
                if(response.status !== 200){
                    console.log(response.status);
                    $scope.inputError = true;
                }
            });

    };

  }

]);