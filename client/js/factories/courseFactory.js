angular.module('courses').factory('Courses', function($http) {
    var methods = {
      getAll: function() {
        return $http.get('/api/courses');
      },
      getByProfessor: function(professor) {
        return $http.get(`/api/courses/professor/${professor}`);
      },
      getByCode: function(code) {
         return $http.get(`/api/courses/code/${code}`);
      },
      getByTitle: function(title) {
        return $http.get(`/api/courses/title/${title}`);
      }
    };
    return methods;
  });