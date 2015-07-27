var app = angular.module("mlTut");

app.controller("neuralnetCtrl", function($scope, nnet, nnetd3) {


  input_layer = nnetd3.draw_layer(nnet.input_nodes, 0.15);
  layer_middle = nnetd3.draw_layer(nnet.middle_nodes, 0.5);
  output_layer = nnetd3.draw_layer(nnet.output_nodes, 0.85);

  
  nnetd3.connectLayers(input_layer, layer_middle);
  nnetd3.connectLayers(layer_middle, output_layer);

  // nnetd3.draw_arc(input_layer[0].x, input_layer[0].y,
  //                  layer_middle[2].x, layer_middle[2].y 
  //   );


});
