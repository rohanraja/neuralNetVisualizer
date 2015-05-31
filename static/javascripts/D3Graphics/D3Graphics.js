function D3Graphics(pSvgContainer)
{
	var svgContainer = pSvgContainer;

	drawRectangle = function(rect)
	{

		var rectangle = svgContainer.append("rect")
		                            .attr("x", rect.x)
		                            .attr("y", rect.y)
		                            .attr("fill", rect.color)
		                            .attr("width", rect.width)
		                            .attr("height", rect.height)
		                            .style("opacity", rect.opacty);
		return rectangle;
	};

	drawCircles = function(pcircle)
	{
		var circle = svgContainer.append("circle")
						   .attr("cx", function (d) { return d.x_axis; })
	                       .attr("cy", function (d) { return d.y_axis; })
	                       .attr("r", function (d) { return d.radius; })
	                       .style("fill", function(d) { return d.color; });
	};


}