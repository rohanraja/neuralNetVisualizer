var app = angular.module("mlTut");

app.controller("neuralnetCtrl", function($scope, nnet, nnetd3) {


  // input_layer = nnetd3.draw_layer(nnet.input_nodes, 0.15);
  // layer_middle = nnetd3.draw_layer(nnet.middle_nodes, 0.5);
  // output_layer = nnetd3.draw_layer(nnet.output_nodes, 0.85);
  //
  // nnetd3.createLink(nnet.input_nodes[0], nnet.middle_nodes[0]);
  //
  // // nnetd3.connectLayers(input_layer, layer_middle);
  // nnetd3.connectLayers(layer_middle, output_layer);

  
  // $('text').popover({
  //    'trigger':'focus'
  //   ,'title': 'Weight'
  //   ,'content': ''
  //   ,'container': 'body'
  //   ,'placement': 'top'
  //   ,'white-space': 'nowrap'
  //   ,'html':'true'
  //   ,'template': '<div class="popover weight_popover"><div class="arrow"></div>'
  //  +'<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>'
  //   +'<script tyle="text/javascript">$("#ex1").slider();</script></div>'
  //
  // });



  // nnetd3.draw_arc(input_layer[0].x, input_layer[0].y,
  //                  layer_middle[2].x, layer_middle[2].y 
  //   );


});
