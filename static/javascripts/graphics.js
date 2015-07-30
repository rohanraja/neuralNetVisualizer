
var jsonCircles = [];

var currentClass = 0 ;
classes = ["red", "blue"];

var trainer;


function addCircle(circle)
{

  var numCircles = 100;

  var radius = 50;

  jsonCircles.push({ "x_axis": circle[0], "y_axis": circle[1], "radius": 3, "color" : classes[currentClass], "category" : currentClass });


  for(i=0; i<numCircles; i++)
  {
      var angle = Math.random()*Math.PI*2;
      newx = circle[0] + Math.random()*Math.cos(angle)*radius;
      newy = circle[1] + Math.random()*Math.sin(angle)*radius;
      jsonCircles.push({ "x_axis": newx, "y_axis": newy, "radius": 3, "color" : classes[currentClass], "category" : currentClass });

  }


	drawCircles();
}

function drawCircles()
{
	var circles = svgContainer.selectAll("circle")
                          .data(jsonCircles)
                          .enter()
                          .append("circle");

var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; });
}

function mousemove(d, i) {
  addCircle(d3.mouse(this));
}

function changeClass()
{
	currentClass = 1 - currentClass;

  btnclasses = ['btn btn-danger', 'btn btn-primary'];

  $('#classbtn').attr('class', btnclasses[currentClass]);

}


function trainData()
{
  var tuples = [];

  $.each(jsonCircles, function(i, val){

      tuples.push(new Tuple([val.x_axis,val.y_axis],val.category));
  });


  var dataSet = new DataSet(tuples,2);
  trainer = new LogTrainer(dataSet,2);
  trainer.train();
}

function getData()
{

	return jsonCircles ;
}

var lineData ;

function drawSquare(x,y, color, size, opacty)
{
  size = typeof size !== 'undefined' ? size : 10;

  var rectangle = svgContainer.append("rect")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("fill", color)
                            .attr("width", size)
                            .attr("height", size)
                            .style("opacity", opacty);;
}

function drawHeatMat(gridPoints, size)
{
  // gridPoints - array of array of 3 - [[23,45,0] , [23,55,1] , [23,65,0]]

  heatColors = ["green", "pink", "yellow", "red"];

  for(i=0; i<gridPoints.length; i++)
  {
    drawSquare(gridPoints[i][0],gridPoints[i][1],heatColors[gridPoints[i][2]], size, gridPoints[i][3]);
  }

}

function plotPathData(points)
{

  $('#svggg path').remove();
  
  var lineFunc = d3.svg.line()
                                  .x(function(d) {
                                    return d[0];
                                  })
                                  .y(function(d) {
                                    return d[1];
                                  })
                                  .interpolate('linear');

        svgContainer.append('svg:path')
                              .attr('d', lineFunc(points))
                              .attr('stroke', 'blue')
                              .attr('stroke-width', 2)
                              .attr('fill', 'none');
        

}

function plotLines(a,b,c)
{

  $('path').remove();
  //The data for our line
  lineData = [ { "x": 0,  "y": -c/b },  { "x": widthSvg, "y": (-c -(a*widthSvg) )/b}];

//This is the accessor function we talked about above
  var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");

//The line SVG Path we draw
  var lineGraph = svgContainer.append("path")
                            .attr("d", lineFunction(lineData))
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");  
}

