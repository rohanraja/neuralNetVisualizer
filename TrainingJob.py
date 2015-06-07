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
        


