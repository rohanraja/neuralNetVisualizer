
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

function HypoFunction (pTrueVal, pNumParams) {
    	
    this.trueVal = pTrueVal ; 
    this.numParams = pNumParams;

    this.theta = [];

    this.prepareFunction = function()
    {
    	for(i=0;i<pNumParams;i++)
    	{
    		this.theta.push(0);
    	}
    };

    this.getVal = function(inparray)
    {
    	var outSum = 0;

    	if(this.theta.length != inparray.length)
    		return 0;

    	for(i=0;i<3;i++)
    	{
    		outSum = outSum + this.theta[i] * inparray[i];
    	}

    	return sigmoid(outSum);
    };

    this.prepareFunction();
}

