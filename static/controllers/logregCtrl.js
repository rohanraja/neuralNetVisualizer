var app = angular.module("mlTut", []);

app.controller("logregCtrl", function($scope) {

    $scope.message = "in controller";
    $scope.degree = 2;
    $scope.divFactor = 100;

    $scope.onTrainClick = function()
    {
		var tuples = [];

		  $.each(jsonCircles, function(i, val){

		      tuples.push(new Tuple([val.x_axis,val.y_axis],val.category));
		  });


		  var dataSet = new DataSet(tuples,2);
		  trainer = new LogTrainer(dataSet,2);
		  trainer.degree = $scope.degree;
		  trainer.divFactor = $scope.divFactor;
		  trainer.train();
    }
    
});