var app = angular.module("mlTut");

app.controller("neuralnetCtrl", function($scope) {

  $scope.numNodes = 5;
  
  var svg_nn = d3.select("#nnet_svg");
  

  var draw_layer = function(nodes){

    var layer_circles = svg_nn.append("g");

    var circle = layer_circles.selectAll("g").data(nodes);

    var nodeEnter = circle.enter().append('g');
    nodeEnter.attr("transform", function(d, i) { return "translate(0, " + (i * 120 + d.radius) + ")" ; });
    
    var circleEnter = nodeEnter.append("circle");
    circleEnter.attr("r", function(d) { return d.radius })
    .style("fill", "purple")
    .style("opacity", function(d){ return d.a_value });
    
    nodeEnter.append("text")
      .attr("dy", "5")
      .attr("text-anchor", "middle")
      .text("20.76");
    
    return layer_circles ;

  };

  test_nodes = [

    {
      'radius': 30,
      'a_value': 0.7
    },
    {
      'radius': 30,
      'a_value': 0.2

    },
    {
      'radius': 30,
      'a_value': 1

    },
    {
      'radius': 30,
      'a_value': 0.5

    }

  ];

  layer_middle = draw_layer(test_nodes);

  svg_width = parseInt(svg_nn.style('width'));
  svg_height = parseInt(svg_nn.style('height'));
  
  group_height = layer_middle.node().getBBox().height  ; 
  
  layer_left = svg_width/ 2;
  layer_top = (svg_height - group_height)/ 2 ;

  layer_middle.attr("transform", "translate("+ layer_left +"," + layer_top + ")");

});
