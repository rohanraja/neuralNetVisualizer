var app = angular.module("mlTut");
// var app = angular.module("mlTut", ['ui.bootstrap']);

app.controller("logregCtrl", function($scope, nnet) {

    $scope.message = "in controller";
    $scope.degree = 4;
    $scope.divFactor = 500;
    $scope.alpha = 0.00001;
    $scope.percentComplete = 0 ;
    $scope.ml_algo = "nnet";

    $scope.plotPathfromVertices = function(data)
    {
    	console.log("Got New Vertices Array");
        resultData = JSON.parse(data.data);
        points = resultData.plotPath;
        $scope.cost = resultData.cost ;
        $scope.$apply('cost') ;
        $scope.percentComplete = resultData.percentComplete ;
        $scope.$apply('percentComplete') ;

        if($scope.network == undefined)
          $scope.network = new NeuralNetwork(resultData.weights);
        else
          $scope.network.updateWeights(resultData.weights);

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
      trainer.ml_algo = $scope.ml_algo;
		  trainer.train();
      if($scope.network != undefined)
      {  
          $scope.network.remove();
          $scope.network = undefined ;
      }

    }


     svgContainer = d3.select("#svggg").append("svg")
                                    .attr("width", widthSvg)
                                    .attr("height", heightSvg).on("click", mousemove)
                                    .style("border", "1px solid")
                                    .style("display", "inline");

     // $scope.network = new NeuralNetwork(nnet.w_matrix_all);

    
});
