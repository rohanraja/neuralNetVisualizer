function FeatureMapper (pPolyDegree) {
    
    this.polyDegree = pPolyDegree ;

    this.mapFeature = function(pTrainingData)
    {
    	var retTrainingData = pTrainingData ;

    	
    	for(i=0; i<retTrainingData.samples.length ; i++)
    	{
    		retTrainingData.samples[i].inputVector.push(1); 
    	}

    	retTrainingData.numParams = retTrainingData.numParams + 1 ;

    	return retTrainingData;
    };
    
}
