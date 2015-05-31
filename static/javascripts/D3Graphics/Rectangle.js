function Rectangle(px, py, w, h, c, op)
{
	this.x = px;
	this.y = py;
	this.width = typeof w !== 'undefined' ? w : 10;
	this.height = typeof h !== 'undefined' ? h : 10;
	this.color = typeof c !== 'undefined' ? c : "black";
	this.opacity = typeof op !== 'undefined' ? op : 1.0;
}