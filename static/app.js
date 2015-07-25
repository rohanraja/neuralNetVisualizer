
var app = angular.module('mlTut', ['ngRoute']) ;

app.config(['$routeProvider',function ($routeprovider) {
      
      $routeprovider.
        when('/logreg', {
            templateUrl: '/static/partials/logreg.html',
            controller: 'logregCtrl'
        });
  }]);
