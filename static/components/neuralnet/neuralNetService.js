var app = angular.module("mlTut");

app.service("nnet", function(){
  

 this.input_nodes = [

    {
      'radius': 30,
      'a_value': 0.7
    },
    {
      'radius': 30,
      'a_value': 0.2

    },
 ];

 this.output_nodes = [

    {
      'radius': 30,
      'a_value': 0.7
    },
    {
      'radius': 30,
      'a_value': 0.2

    },
 ];
  
  this.middle_nodes = [

     {
      'radius': 30,
      'a_value': 0.7
    },   {
      'radius': 30,
      'a_value': 0.7
    },
    {
      'radius': 30,
      'a_value': 0.2

    },
    {
      'radius': 30,
      'a_value': 1

    },
    {
      'radius': 30,
      'a_value': 0.5

    }

  ];


});


