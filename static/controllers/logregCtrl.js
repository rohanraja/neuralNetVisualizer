var app = angular.module("mlTut", ['ui.bootstrap']);

app.controller("logregCtrl", function($scope) {

    $scope.message = "in controller";
    $scope.degree = 2;
    $scope.divFactor = 500;
    $scope.alpha = 0.00001;
    $scope.percentComplete = 0 ;

    $scope.plotPathfromVertices = function(data)
    {
    	console.log("Got New Vertices Array");
        resultData = JSON.parse(data.data);
        points = resultData.plotPath;
        $scope.cost = resultData.cost ;
        $scope.$apply('cost') ;
        $scope.percentComplete = resultData.percentComplete ;
        $scope.$apply('percentComplete') ;

        plotPathData(points);

    }

    $scope.onTrainClick = function()
    {
		var tuples = [];

		  $.each(jsonCircles, function(i, val){

		      tuples.push(new Tuple([val.x_axis,val.y_axis],val.category));
		  });


		  var dataSet = new DataSet(tuples,2);
		  trainer = new LogTrainer(dataSet,2, $scope.plotPathfromVertices);
		  trainer.degree = $scope.degree;
		  trainer.divFactor = $scope.divFactor;
		  trainer.alpha = $scope.alpha;
		  trainer.train();
    }


    
});