function Connection_NN(w_matrix, source_layer, target_layer){

  this.w_matrix = w_matrix;
  this.source_layer = source_layer;
  this.target_layer = target_layer;
  
  allLinks = [];

  colors = ["purple", "Blue", "Green", "black", "Yellow"];

  this.draw = function(){
    
    this.w_matrix.forEach(function(val, i){

      source_node = source_layer.nodes[i];
      
      val.forEach(function(val_target, i_target){

        target_node = target_layer.nodes[i_target];
        link = source_node.createLink(target_node, val_target, colors[i]);
        allLinks.push(link);
       
      });

    });


    allLinks.forEach(function(val){
    
    allSvgs = allSvgs.add(val.node_d3);

    });
   this.node_d3 = allSvgs;


  };
  
  allSvgs = $();


  this.remove = function(){
    
    $(this.node_d3).remove();

  };

  this.draw();
 
}



