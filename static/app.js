
var app = angular.module('mlTut', ['ngRoute']) ;

app.config(['$routeProvider',function ($routeprovider) {
      
       $routeprovider.
        when('/logreg', {
            templateUrl: '/static/partials/logreg.html',
            controller: 'logregCtrl'
        });
$routeprovider.
        when('/', {
            templateUrl: '/static/components/neuralnet/neuralnet.html',
            controller: 'neuralnetCtrl'
        });

$routeprovider.
        when('/nnets', {
            templateUrl: '/static/components/neuralnet/neuralnet.html',
            controller: 'neuralnetCtrl'
        });
  }]);
