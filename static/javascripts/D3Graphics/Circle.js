function Circle(px, py, r , c, op)
{
	this.x = px;
	this.y = py;
	this.radius = typeof r !== 'undefined' ? r : 10;
	this.color = typeof c !== 'undefined' ? c : "black";
	this.opacity = typeof op !== 'undefined' ? op : 1.0;
}