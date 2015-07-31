function NeuralNetwork(w_matrix_all){

  SvgElement.prototype.svg = d3.select("#nnet_svg");
  SvgElement.prototype.svg_width = parseInt($("#nnet_svg").css('width'));
  SvgElement.prototype.svg_height = parseInt($("#nnet_svg").css('height'));
  SvgElement.prototype.num_layers = 3;


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
    
    // l.nodes.forEach(function(val){
    //   val.network = this;
    // });
    
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

      
      conn = new Connection_NN(val, layers[i], layers[i+1], this);
      connections.push(conn);
      

  });
  
  this.node_d3 = $('#nnet_svg').children();


  this.updateWeights = function(weights){

  SvgElement.prototype.network = this ;
    
    connections.forEach(function(val){

      val.remove();
      
    });

    connections = [];

    weights.forEach(function(val, i){
    
      conn = new Connection_NN(val, layers[i], layers[i+1], this);
      connections.push(conn);
    
    });

    SvgElement.prototype.network.connections = connections ;


  };

  this.remove = function(){

    $('#nnet_svg').html('');
  };


  SvgElement.prototype.fadeAllOut = function(){

    connections[0].fadeOut();
    connections[1].fadeOut();
    $('.pathHoverHelpers').attr("opacity", 0);    
    $('.node').attr('opacity', 0.1);
   
  };
  SvgElement.prototype.fadeAllIn = function(){

    connections[0].fadeIn();
    connections[1].fadeIn();
    $('.pathHoverHelpers').attr("opacity", 0);    
     $('.node').attr('opacity', 1);
   
  };



}


  inheritsFrom(Layer, SvgElement);
  inheritsFrom(Link, SvgElement);
  inheritsFrom(Node, SvgElement);
  inheritsFrom(Connection_NN, SvgElement);
  inheritsFrom(NeuralNetwork, SvgElement);

