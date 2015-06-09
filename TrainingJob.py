__author__ = 'rohanraja'

class TrainingJob():

    def __init__(self):

        self.Name = ""
        self.Id = ""
        self.algoName = "NeuralNetwork"
        self.codeLanguage = "Python"

        self.loopFunction = None
        self.loopParams = None
        self.iterationsDone = 0

        self.endingConditions = {'maxIterations': 0, 'progressThreshold' : 100}



def testLoopFunc():

    i = 0

    while(i < 6):

        out = i*i
        print out

        i = i + 1



def setParams(inputParams, localNamespace):

    for key in inputParams:
        localNamespace()[key] = inputParams[key]
        #exec(key + " = inputParams['" + key + "']")


def getOutputParams(inputParams, localVars):

    outputParams = {}

    for (k,v) in localVars:
        if k in inputParams:
            outputParams[k] = v

    return outputParams

def LoopFunc(inputParams):

    for key in inputParams:
        exec(key + " = inputParams['" + key + "']")

    out = i*i
    i = i + 1
    print out

    outputParams = getOutputParams(inputParams, locals().items())

    return outputParams


def endCondition(inputParams):

    return inputParams['i'] < 5

def Looper(startInputParams, endConditionChecker):

    newInputParams = startInputParams


    while(endConditionChecker(newInputParams)):
        newInputParams = LoopFunc(newInputParams)



testInputParam = { 'i' : 0 }

print Looper(testInputParam, endCondition)

__author__ = 'rraja'
