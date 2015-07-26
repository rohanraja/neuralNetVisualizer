var app = angular.module("mlTut");

app.controller("neuralnetCtrl", function($scope) {

  $scope.numNodes = 5;
  
  var svg_nn = d3.select("#nnet_svg");
  

  var draw_layer = function(nodes){

    var node_radius = 20;

    var layer_circles = svg_nn.append("g");

    var circle = layer_circles.selectAll("circle").data(nodes);
    
    var circleEnter = circle.enter().append("circle");
    
    circleEnter.attr("cx", 0);
    circleEnter.attr("cy", function(d, i) { return i * 120 + d.radius ; });
    circleEnter.attr("r", function(d) { return d.radius })
    .style("fill", "purple")
    .style("opacity", function(d){ return d.a_value });

    svg_width = parseInt(svg_nn.style('width'));
    svg_height = parseInt(svg_nn.style('height'));
    
    group_height = layer_circles.node().getBBox().height  ; 
    
    layer_left = svg_width/ 2;
    layer_top = (svg_height - group_height)/ 2 ;

    layer_circles.attr("transform", "translate("+ layer_left +"," + layer_top + ")");

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

  draw_layer(test_nodes);


});
