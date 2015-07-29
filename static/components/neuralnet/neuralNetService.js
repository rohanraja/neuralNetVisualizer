var app = angular.module("mlTut");

nodeRadius = 25;    // Make one variable for this
arrowheadLength = 1;

function SvgElement(){
  this.svg = d3.select("#nnet_svg");
  this.svg_width = parseInt(svg_nn.style('width'));
  this.svg_height = parseInt(svg_nn.style('height'));

  this.num_layers = 3;

}

SvgElement.prototype.fadeOut = function(){
  $(this.node_d3).attr("opacity", "0.2");
}

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function Node(a_value){

  this.a_value = a_value ;
  var node_d3, pos ;

}

inheritsFrom(Node, SvgElement);

adjustCircleRadiusLink = function(link_arc){


  angle = Math.atan2(link_arc.target.y - link_arc.source.y, link_arc.target.x - link_arc.source.x);

  link_arc.source.x += Math.cos(angle) * (nodeRadius + arrowheadLength);
  link_arc.target.x -= Math.cos(angle) * (nodeRadius + arrowheadLength);

  link_arc.source.y += Math.sin(angle) * (nodeRadius + arrowheadLength);
  link_arc.target.y -= Math.sin(angle) * (nodeRadius + arrowheadLength);

  return link_arc;       
};

function Link(node1, node2, weight){
  
  this.source_node = node1;
  this.target_node = node2;
  
  this.weight = 0.23;

  this.createLink = function(){
    
    link_arc = {};

    link_arc.source = JSON.parse(JSON.stringify(this.source_node.pos)) ;
    link_arc.target = JSON.parse(JSON.stringify(this.target_node.pos)) ;

    link_arc = adjustCircleRadiusLink(link_arc);

    node1.fadeOut();
    

  };

  this.draw = function(){


  };

}


function Layer(nodeList, position){

  this.nodes = nodeList;
  this.position = position;

  leftFactors = [0.15, 0.5, 0.85];
  this.leftFactor = leftFactors[position];

  this.draw = function(){
  
    var layer_circles = this.svg.append("g");

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
    
    nodeEnter.append("text")
      .attr("dy", "5")
      .attr("text-anchor", "middle")
      .text(function(d){return d.a_value});
    
    layer_left = this.svg_width * left_factor;
    group_height = layer_circles.node().getBBox().height  ; 
    layer_top = (this.svg_height - group_height)/ 2 ;

    layer_circles.attr("transform", "translate("+ layer_left +"," + layer_top + ")");
    

    for(i=0; i<circles.length; i++){
        
      circles[i].x += layer_left ;
      circles[i].y += layer_top ;
      
    }

    return circles;


  };

}


function Connection_NN(w_matrix, initial_position){

  this.w_matrix = w_matrix;

  this.draw = function(){
    
    source_nodes = [];
    target_nodes = [];

    this.w_matrix.forEach(function(val, i){

      source_node = new Node(0);
      source_nodes.push(source_node);
      
      val.forEach(function(val_target, i_target){
        
        if(i==0)
        {
          target_node = new Node(0);
          target_nodes.push(target_node);
        }
        else
          target_node = target_nodes[i_target];

        
        
      });

    });
    
    source_layer = new Layer(source_nodes, initial_position);
    target_layer = new Layer(target_nodes, initial_position+1);
    
    console.log(source_layer);


  };
 
}

inheritsFrom(Layer, SvgElement);

app.service("nnet", function(){
  

 this.input_nodes = [

    new Node(0.7),
    new Node(0.9)

 ];

 this.output_nodes = [

    new Node(0.7),
    new Node(0.9)

 ];
  
  this.middle_nodes = [

    new Node(0.7),
    new Node(0.9),
    new Node(0.4),
    new Node(0.1)

  ];

  layer_0 = new Layer(this.input_nodes, 0);
  layer_1 = new Layer(this.middle_nodes, 1);
  layer_2 = new Layer(this.output_nodes, 2);


  // layer_0.draw();

  
  w1 = [
    [2,3,5,6],
    [9,2,1,2]  
  ];

  conn_1 = new Connection_NN(w1, 0);
  conn_1.draw();


});


