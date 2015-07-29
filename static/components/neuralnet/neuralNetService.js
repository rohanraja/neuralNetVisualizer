var app = angular.module("mlTut");

nodeRadius = 25;    // Make one variable for this
arrowheadLength = 1;

function SvgElement(){

}

SvgElement.prototype.fadeOut = function(){
  $(this.node_d3).attr("opacity", "0.1");
}

SvgElement.prototype.fadeIn = function(){
  $(this.node_d3).attr("opacity", "1");
}



var inheritsFrom = function (child, parent) {
    
    child.prototype = Object.create(parent.prototype);
};

function Node(a_value){

  this.a_value = a_value ;
  var node_d3, pos ;
  
  this.child_links = [];
  this.parent_links = [];

  this.createLink = function(target_node, weight){
    
    link = new Link(this, target_node, weight);
    target_node.parent_links.push(link);
    this.child_links.push(link);
    return link
  }

}




var lid = 0;

function Link(node1, node2, weight){
  
  this.source_node = node1;
  this.target_node = node2;
  
  this.weight = weight;
  
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

  };

  this.drawArc = function(){

    var d1 = d3.svg.diagonal()
      .source(this.link_positions.source)
      .target(this.link_positions.target);


    this.svg.append("path")
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .attr("class", "link link_"+lid)
    .attr("d", d1)
    .attr("id", "path"+lid)
    .attr("marker-end", "url(\#arrow)");



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

    this.node_d3 = layer_circles[0] ;

    return circles;


  };

}



function Connection_NN(w_matrix, source_layer, target_layer){

  this.w_matrix = w_matrix;
  this.source_layer = source_layer;
  this.target_layer = target_layer;
  
  allLinks = [];

  this.draw = function(){
    
    this.w_matrix.forEach(function(val, i){

      source_node = source_layer.nodes[i];
      
      val.forEach(function(val_target, i_target){

        target_node = target_layer.nodes[i_target];
        link = source_node.createLink(target_node, val_target);
        allLinks.push(link);
       
      });

    });


    allLinks.forEach(function(val){
    
    allSvgs = allSvgs.add(val.node_d3);

    });
   this.node_d3 = allSvgs;


  };
  
  allSvgs = $();



  

  this.draw();
 
}


function NeuralNetwork(w_matrix_all){

  this.w_matrix_all = w_matrix_all;
  layers = [];
  this.layers = layers;
  connections = [];
  this.connections = connections;
  
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
      {
        l = createLayer(val.length, i);
        layers.push(l);
      }
        

      l = createLayer(val[0].length, i+1);
      layers.push(l);

      
      conn = new Connection_NN(val, layers[i], layers[i+1]);
      connections.push(conn);
      

  });

}

app.service("nnet", function(){
  


SvgElement.prototype.svg = d3.select("#nnet_svg");
SvgElement.prototype.svg_width = parseInt($("#nnet_svg").css('width'));
SvgElement.prototype.svg_height = parseInt($("#nnet_svg").css('height'));
SvgElement.prototype.num_layers = 3;


inheritsFrom(Layer, SvgElement);
inheritsFrom(Link, SvgElement);
inheritsFrom(Node, SvgElement);
inheritsFrom(Connection_NN, SvgElement);


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
  
  network.layers[0].nodes[1].child_links[0].fadeOut()
  
  network.connections[1].fadeOut();

  network.layers[2].fadeOut();



});


