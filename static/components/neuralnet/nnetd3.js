var app = angular.module("mlTut");

app.service("nnetd3", function(){


  var svg_nn = d3.select("#nnet_svg");
  var svg_width = parseInt(svg_nn.style('width'));
  var svg_height = parseInt(svg_nn.style('height'));

  this.draw_layer = function(nodes, left_factor){

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
    
    layer_left = svg_width * left_factor;
    group_height = layer_circles.node().getBBox().height  ; 
    layer_top = (svg_height - group_height)/ 2 ;

    layer_circles.attr("transform", "translate("+ layer_left +"," + layer_top + ")");

    return layer_circles ;

  };


});
  


