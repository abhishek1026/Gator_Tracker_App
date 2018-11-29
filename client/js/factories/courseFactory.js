angular.module('courses').factory('Courses', function($http) {
    var methods = {
      getAll: function() {
        return $http.get('/api/courses');
      },
      getByProfessor: function(professor, term) {
        return $http.get(`/api/courses/professor/${term}/${professor}`);
      },
      getByCode: function(code, term) {
         return $http.get(`/api/courses/code/${term}/${code}`);
      },
      getByTitle: function(title, term) {
        return $http.get(`/api/courses/title/${term}/${title}`);
      },
      grabTAs: function(code) {
        return $http.get(`/api/courses/TA/${code}`);
      }
    };
    return methods;
  });