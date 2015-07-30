function Node(a_value){

  this.a_value = a_value ;
  var node_d3, pos ;
  
  this.child_links = [];
  this.parent_links = [];

  this.createLink = function(target_node, weight, color){
    
    link = new Link(this, target_node, weight, color);
    target_node.parent_links.push(link);
    this.child_links.push(link);
    return link
  }

  this.fadedHighlight = function(){
    
    this.child_links.forEach(function(val){
      val.fadedHighlight();
    });
    this.parent_links.forEach(function(val){
      val.fadedHighlight();
    });

  };

}
