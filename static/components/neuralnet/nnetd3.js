var app = angular.module("mlTut");

app.service("nnetd3", function(){


  var svg_nn = d3.select("#nnet_svg");
  var svg_width = parseInt(svg_nn.style('width'));
  var svg_height = parseInt(svg_nn.style('height'));

  var nodeRadius = 25;
  var arrowheadLength = 1 ;

  // ** Define arrow for links ** //
  
  svg_nn.append("svg:defs")
    .append("svg:marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  this.draw_layer = function(nodes, left_factor){

    var layer_circles = svg_nn.append("g");

    var gap = left_factor == 0.5 ? 180 : 200 ;

    var circles = [];
    var pos = { x: 0, y: 0 };

    var circle = layer_circles.selectAll("g").data(nodes);

    var nodeEnter = circle.enter().append('g');
    nodeEnter.attr("transform", function(d, i) { 
      pos =  { x: 0, y: 0 };
      pos.y = (i * gap + nodeRadius);
      circles.push(pos);
      d.pos = pos ;
      d.node_d3 = nodeEnter[0][i] ;   // Todo: Must exist a more elegant way to do this.

      return "translate(0, " + pos.y + ")" ; 
    
    })
    .attr("class", "node");
    
    var circleEnter = nodeEnter.append("circle");
    circleEnter.attr("r", function(d) { return nodeRadius })
    .style("fill", "purple")
    .style("opacity", function(d){ return d.a_value });
    
    // nodeEnter.append("text")
    //   .attr("dy", "5")
    //   .attr("text-anchor", "middle");
      // .text(function(d){return d.a_value});
    
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

  adjustCircleRadiusLink = function(link_arc){
  

      angle = Math.atan2(link_arc.target.y - link_arc.source.y, link_arc.target.x - link_arc.source.x);

      link_arc.source.x += Math.cos(angle) * (nodeRadius + arrowheadLength);
      link_arc.target.x -= Math.cos(angle) * (nodeRadius + arrowheadLength);
      
      link_arc.source.y += Math.sin(angle) * (nodeRadius + arrowheadLength);
      link_arc.target.y -= Math.sin(angle) * (nodeRadius + arrowheadLength);

      return link_arc;       
  };

  this.createLink = function(node1, node2){
    
    link_arc = {};

    link_arc.source = JSON.parse(JSON.stringify(node1.pos)) ;
    link_arc.target = JSON.parse(JSON.stringify(node2.pos)) ;

    link_arc = adjustCircleRadiusLink(link_arc);

    node1.fadeOut();
    

  };


  this.draw_arc = function(x1,y1,x2,y2, color, lid){

    angle = Math.atan2(y2 - y1, x2 - x1);
    X1 = x1 + Math.cos(angle) * (nodeRadius + arrowheadLength);
    X2 = x2 - Math.cos(angle) * (nodeRadius + arrowheadLength);
    Y1 = y1 + Math.sin(angle) * (nodeRadius + arrowheadLength);
    Y2 = y2 - Math.sin(angle) * (nodeRadius + arrowheadLength);

    var d1 = d3.svg.diagonal()
      .source( {"x":X1, "y":Y1} )
      .target( {"x":X2, "y":Y2} );


    svg_nn.append("path")
    .attr("stroke", color)
    .attr("stroke-width", "1px")
    .attr("class", "link")
    .attr("d", d1)
    .attr("id", "path"+lid)
    .attr("marker-end", "url(\#arrow)");



    svg_nn.append("text").
      style("font-size", "14px")
      .style("text-anchor", "middle")
      .append("textPath")
      .style("color", color)
      .attr("xlink:href", "#path"+ lid)
      .attr("startOffset", "64%")
      .text("0.234");
  };


  drawLine = this.draw_arc ;

  link_id = 0;
  this.connectLayers = function(l1,l2){
   colors = ["red", "green", "blue", "black", "gray", "yellow"]; 

    l1.forEach(function(val, i){
      
      color = colors[i];
      l2.forEach(function(val2){
          
        drawLine(val.x, val.y, val2.x, val2.y, color, link_id);
        link_id = link_id + 1;
        
      });
    });
  
  };

});
  


