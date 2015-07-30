var lid = 0;

function Link(node1, node2, weight, color){
  
  this.source_node = node1;
  this.target_node = node2;
  
  this.weight = weight;

  this.color = color;
  
  adjustCircleRadiusLink = function(link_arc){


    angle = Math.atan2(link_arc.target.y - link_arc.source.y, link_arc.target.x - link_arc.source.x);

    link_arc.source.x += Math.cos(angle) * (nodeRadius + arrowheadLength);
    link_arc.target.x -= Math.cos(angle) * (nodeRadius + arrowheadLength);

    link_arc.source.y += Math.sin(angle) * (nodeRadius + arrowheadLength);
    link_arc.target.y -= Math.sin(angle) * (nodeRadius + arrowheadLength);

    return link_arc;       
  };

  getLinkPositions = function(){
    
    link_arc = {};

    link_arc.source = JSON.parse(JSON.stringify(this.source_node.pos)) ;
    link_arc.target = JSON.parse(JSON.stringify(this.target_node.pos)) ;

    link_arc = adjustCircleRadiusLink(link_arc);

    return link_arc;
    

  };

  this.draw = function(){
    
    this.link_positions = getLinkPositions();
    this.node_d3 = this.drawArc() ;
        
    this.hoverFade();
    

//     HoverFade = this.hoverFade;
    
//     $('.pathHoverHelpers').on("mouseover", fadeGenerator(this));

  };

  this.drawArc = function(){

    var d1 = d3.svg.diagonal()
      .source(this.link_positions.source)
      .target(this.link_positions.target);


    this.svg.append("path")
    .attr("stroke", this.color)
    .attr("stroke-width", "1px")
    .attr("class", "link link_"+lid)
    .attr("d", d1)
    .attr("id", "path"+lid)
    .attr("marker-end", "url(\#arrow)");

        this.svg.append("path")
    .attr("stroke", this.color)
    .attr("class", "pathHoverHelpers link_"+lid)
    .attr("stroke-width", "15px")
    .attr("d", d1)
    .attr("opacity", "0");

    this.svg.append("text").
      style("font-size", "14px")
      .style("text-anchor", "middle")
      .append("textPath")
      .attr("xlink:href", "#path"+ lid)
      .attr("startOffset", "64%")
      .attr("class", "link_"+lid)
      .text(this.weight);
      
    
    lid++;

    return $(".link_"+ (lid-1));

  };

  this.draw();

  this.fadedHighlight = function(){
    this.fadeIn();
    this.source_node.fadeIn();
    this.target_node.fadeIn();
  };

}


