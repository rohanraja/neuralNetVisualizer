function SvgElement(){

}

SvgElement.prototype.fadeOut = function(){
  $(this.node_d3).attr("opacity", "0.1");
}

SvgElement.prototype.fadeIn = function(){
  $(this.node_d3).attr("opacity", "1");
}

var network ;

fadeGenerator = function(link_ref){
  return function(){

    network.connections[0].fadeOut();
    network.connections[1].fadeOut();    
    $('.node').attr('opacity', 0.1);

    link_ref.fadedHighlight();

    $('.pathHoverHelpers').attr("opacity", 0);    

  }
}

SvgElement.prototype.hoverFade = function(){
  
  onHoverOut = function(){
    
    $('#nnet_svg').children().attr('opacity', 1);
    network.connections[0].fadeIn();
    network.connections[1].fadeIn();
     $('.node').attr('opacity', 1);
     $('.pathHoverHelpers').attr("opacity", 0);


  };

  $(this.node_d3).hover(fadeGenerator(this), onHoverOut) ;

}


var inheritsFrom = function (child, parent) {
    
    child.prototype = Object.create(parent.prototype);
};

