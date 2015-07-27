var app = angular.module("mlTut");

app.service("nnetd3", function(){


  var svg_nn = d3.select("#nnet_svg");
  var svg_width = parseInt(svg_nn.style('width'));
  var svg_height = parseInt(svg_nn.style('height'));

  this.draw_layer = function(nodes, left_factor){

    var layer_circles = svg_nn.append("g");

    var circles = [];
    var pos = { x: 0, y: 0 };

    var circle = layer_circles.selectAll("g").data(nodes);

    var nodeEnter = circle.enter().append('g');
    nodeEnter.attr("transform", function(d, i) { 
      pos =  { x: 0, y: 0 };
      pos.y = (i * 120 + d.radius);
      circles.push(pos);
      d.pos = pos ;
      return "translate(0, " + pos.y + ")" ; 
    
    })
    .attr("class", "node");
    
    var circleEnter = nodeEnter.append("circle");
    circleEnter.attr("r", function(d) { return d.radius })
    .style("fill", "purple")
    .style("opacity", function(d){ return d.a_value });
    
    nodeEnter.append("text")
      .attr("dy", "5")
      .attr("text-anchor", "middle")
      .text(function(d){return d.a_value});
    
    layer_left = svg_width * left_factor;
    group_height = layer_circles.node().getBBox().height  ; 
    layer_top = (svg_height - group_height)/ 2 ;

    layer_circles.attr("transform", "translate("+ layer_left +"," + layer_top + ")");
    

    for(i=0; i<circles.length; i++){
        
      circles[i].x += layer_left ;
      circles[i].y += layer_top ;
      
    }

    return circles;

  };


  this.connectCircles = function(c1, c2)
  {
    r1 = c1.getBoundingClientRect().left;

  };

  this.getCirclePosition = function(c){



  };


  this.createLink = function(node1, node2){



  };

  this.draw_line = function(x1,y1,x2,y2, color){
    
    if(color == undefined)
      color = "black";

    var lines = svg_nn.append("line")
            .style("stroke", color) 
            .attr("x1", function(d) { return x1 })
            .attr("y1", function(d) { return y1 })
            .attr("x2", function(d) { return x2 })
            .attr("y2", function(d) {  return y2 })
            .attr("stroke-width", "2")
            .attr("class", "link");
    

    var text = svg_nn.append("text")
    .attr("x", (x1+x2)/2)
    .attr("y", (y1+y2)/2)
    .attr("text-anchor", "middle")
    .text("0.234");


  }

  drawLine = this.draw_line ;

  this.connectLayers = function(l1,l2){
   colors = ["red", "green", "blue", "black", "gray", "yellow"]; 
    l1.forEach(function(val, i){
      
      color = colors[i];
      l2.forEach(function(val2){
          
        drawLine(val.x, val.y, val2.x, val2.y, color);
        
      });
    });
  
  };

});
  


