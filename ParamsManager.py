__author__ = 'rohanraja'

import pickle

def saveParams(inputParams, fileName):
    pass

def loadParams(fileName):
    pass

def filterUnpickles(inputParams):

    outputParams = {}
    NonPicParams = {}

    for key in inputParams:

        try:
            pickle.dumps(inputParams[key])
            outputParams[key] = inputParams[key]
        except:
            NonPicParams[key] = inputParams[key]


    return outputParams, NonPicParams