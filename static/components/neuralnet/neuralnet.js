var app = angular.module("mlTut");

app.controller("neuralnetCtrl", function($scope, nnet, nnetd3) {

  $scope.numNodes = 5;
  


  input_layer = nnetd3.draw_layer(nnet.input_nodes, 0.15);
  layer_middle = nnetd3.draw_layer(nnet.middle_nodes, 0.5);
  output_layer = nnetd3.draw_layer(nnet.output_nodes, 0.85);


});
