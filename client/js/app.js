/* register the modules the application depends upon here*/
angular.module('courses', []);
angular.module('listings', []);

/* register the application and inject all the necessary dependencies */
var app = angular.module('directoryApp', ['courses', 'listings']);
