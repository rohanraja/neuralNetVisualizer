var app = angular.module("mlTut");

nodeRadius = 25;    // Make one variable for this
arrowheadLength = 1;

function SvgElement(){

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

    var gap = this.leftFactor == 0.5 ? 180 : 200 ;

    var circles = [];
    var pos = { x: 0, y: 0 };

    var circle = layer_circles.selectAll("g").data(this.nodes);

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
    
    layer_left = this.svg_width * this.leftFactor;
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

inheritsFrom(Layer, SvgElement);


function Connection_NN(w_matrix, source_layer, target_layer){

  this.w_matrix = w_matrix;
  this.source_layer = source_layer;
  this.target_layer = target_layer;
  

  this.draw = function(){
    
    this.w_matrix.forEach(function(val, i){
      
      val.forEach(function(val_target, i_target){
        
       
      });

    });


  };
 
}


function NeuralNetwork(w_matrix_all){

  this.w_matrix_all = w_matrix_all;
  this.layers = [];
  
  var createLayer = function(numNodes, pos){
    var nodes = [];

    for(i=0; i<numNodes; i++)
    {
      n = new Node(0.5);
      nodes.push(n);
    }

    l = new Layer(nodes, pos);
    l.draw();
    return l;

  };

  this.w_matrix_all.forEach(function(val,i){
       
      if(i==0)
        createLayer(val.length, i);

      createLayer(val[0].length, i+1);

  });

}

app.service("nnet", function(){
  


SvgElement.prototype.svg = d3.select("#nnet_svg");
SvgElement.prototype.svg_width = parseInt($("#nnet_svg").css('width'));
SvgElement.prototype.svg_height = parseInt($("#nnet_svg").css('height'));
SvgElement.prototype.num_layers = 3;


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

  
  w1 = [
    [2,3,5,6],
    [9,2,1,2]  
  ];

  w2 = [
    [2,5],
    [4,6],
    [7,3],
    [9,9]
  ];

  var w_matrix_all = [w1,w2];

  var network = new NeuralNetwork(w_matrix_all);
  

  //conn_1 = new Connection_NN(w1, 0);
  //conn_1.draw();


});


