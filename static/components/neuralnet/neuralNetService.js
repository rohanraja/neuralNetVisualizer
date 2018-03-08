var app = angular.module("mlTut");

nodeRadius = 15;    // Make one variable for this
arrowheadLength = 1;

app.service("nnet", function(){

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

  this.w_matrix_all = [w1,w2];

  
});
