function Layer(nodeList, position){

  this.nodes = nodeList;
  this.position = position;

  leftFactors = [0.15, 0.5, 0.85];
  this.leftFactor = leftFactors[position];

  this.draw = function(){
  
    var layer_circles = this.svg.append("g");


    var circles = [];
    var pos = { x: 0, y: 0 };

    var circle = layer_circles.selectAll("g").data(this.nodes);

    var midGap = this.svg_height / this.nodes.length ; 
    nodeRadius = this.nodes.length > 10 ? 10 : 15 ;

    var gap = this.leftFactor == 0.5 ? midGap : 150 ;

    var nodeEnter = circle.enter().append('g');
    nodeEnter.attr("transform", function(d, i) { 
      pos =  { x: 0, y: 0 };
      pos.y = (i * gap + nodeRadius);
      circles.push(pos);
      d.pos = pos ;
      d.node_d3 = nodeEnter[0][i] ;   // Todo: Must exist a more elegant way to do this.
      d.hoverFade();

      return "translate(0, " + pos.y + ")" ;  
    
    })
    .attr("class", "node");
    
    var circleEnter = nodeEnter.append("circle");
    circleEnter.attr("r", function(d) { return nodeRadius })
    .style("fill", "purple")
    .style("opacity", function(d){ return d.a_value });
    
    // nodeEnter.append("text")
    //   .attr("dy", "5")
    //   .attr("text-anchor", "middle")
    //   .text(function(d){return d.a_value});
    
    layer_left = this.svg_width * this.leftFactor;
    group_height = layer_circles.node().getBBox().height  ; 
    layer_top = (this.svg_height - group_height)/ 2 ;

    layer_circles.attr("transform", "translate("+ layer_left +"," + layer_top + ")");
    

    for(i=0; i<circles.length; i++){
        
      circles[i].x += layer_left ;
      circles[i].y += layer_top ;
      
    }

    this.node_d3 = layer_circles[0] ;

    return circles;


  };

}



