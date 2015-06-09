__author__ = 'rohanraja'

import pickle

def saveParams(inputParams, fileName):
    pass

def loadParams(fileName):
    pass

def filterUnpickles(inputParams):

    outputParams = {}

    for key in inputParams:

        try:
            pickle.dumps(inputParams[key])
            outputParams[key] = inputParams[key]
        except:
            pass

    return outputParams