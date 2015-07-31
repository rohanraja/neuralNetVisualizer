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

    link_ref.fadeAllOut();

    link_ref.fadedHighlight();

    $('.pathHoverHelpers').attr("opacity", 0);    

  }
}

hoverOutGen = function(link_ref){
  return function(){

    link_ref.fadeAllIn();

    // $('#nnet_svg').children().attr('opacity', 1);

  }
}

SvgElement.prototype.hoverFade = function(){
  
  $(this.node_d3).hover(fadeGenerator(this), hoverOutGen(this)) ;

}

SvgElement.prototype.remove = function(){

  $(this.node_d3).remove();

};

var inheritsFrom = function (child, parent) {
    
    child.prototype = Object.create(parent.prototype);
};

