from scipy.optimize.optimize import fmin_cg, fmin_bfgs, fmin
import numpy as np
import pylab
import plotter
import json
#import featureMapper
import time

import NeuralNetwork as nn
import myFminBFGS

def sigmoid(x):
    try:
        #print np.exp(-x)
        return 1.0 / (1.0 + np.exp(-x))
    except :
        return 0


class NeuralNetworkTrainer():

    def __init__(self, x_train=None, y_train=None, x_test=[], y_test=[],
                 alpha=0.0003, synthetic=False, socketWriter = None, inputData = None):

        try:
        # Set L2 regularization strength
            self.alpha = alpha

            self.inputData = inputData

            self.degree = int(self.inputData['degree'])
            self.divFactor = np.max(x_train) #int(self.inputData['divFactor'])
            self.alpha = float(self.inputData['alpha'])

            # Set the data.
            self.set_data(x_train, y_train)

            self.num = 0

            self.socketWriter = socketWriter

            self.setNN()


            pass

        except:
            pass


    def setNN(self):

        self.NN = nn.NeuralNetwork(hiddenLayerSize=int(self.degree))

        self.betas = self.NN.linearize(self.NN.W)

        self.nnCost = lambda W : self.NN.costFn(self.NN.deLinearize(W), self.x_train, self.y_train)

        self.nnCostPrime = lambda W : self.NN.costFnPrime(self.NN.deLinearize(W), self.x_train, self.y_train)

        self.initialCost = self.nnCost(self.betas)

    def train(self):

        print "Initial Likelihood : ", self.initialCost

        import dill

        #nns = dill.source.getsource(self.NN)
        #print nns, "************"
        #print dill.dump(self.NN , open('/Users/rohanraja/Dropbox/Distributed Computing Startup/persist/Test.dat', 'w'))

        nnCost = lambda W : self.NN.costFn(self.NN.deLinearize(W), self.x_train, self.y_train)
        nnCostPrime = lambda W : self.NN.costFnPrime(self.NN.deLinearize(W), self.x_train, self.y_train)
        self.betas = fmin_bfgs(self.nnCost, self.betas, fprime=self.nnCostPrime ,callback= self.onThetaIteration)
        # self.betas = myFminBFGS.fminLooped(self.nnCost, self.betas, fprime=self.nnCostPrime ,callback= self.onThetaIteration)
        #dill.dumps(nnnCost)

        #self.betas = myFminBFGS.fminLooped(nnCost, self.betas, fprime=nnCostPrime ,callback=self.onThetaIteration)
        #self.betas = myFminBFGS.fminLooped(self.nnCost, self.betas, fprime=self.nnCostPrime ,callback= self.onThetaIteration)

        return "Trained"

    def set_data(self, x_train, y_train):
        """ Take data that's already been generated. """

        self.x_train = np.array(x_train)

        self.xMean = np.mean(self.x_train, axis=0)
        self.xStd = np.std(self.x_train, axis=0)

        if 0 in y_train :
            y_train = [2.0 * y - 1 for y in y_train]

        self.y_train = np.array(y_train)

        self.n = self.y_train.shape[0]

        self.x_train = self.x_train / self.divFactor

    def onThetaIteration(self, theta):

        self.betas = theta
        self.n += 1

        cost = self.nnCost(theta)

        print "LikelyHood is : ", cost

        pointsDiv = 3.0

        plotPathPoints = plotter.getPlottingPoints(0,
                                                   float(self.inputData['widthSvg']) / self.divFactor,
                                                   0,
                                                   float(self.inputData['heightSvg']) / self.divFactor,
                                                   self.predMatrix,
                                                   pointsDiv/self.divFactor
                                                   )

        result = {}

        result['plotPath'] = list([list(point*self.divFactor) for point in plotPathPoints])
        result['cost'] = cost
        result['percentComplete'] = 100 - ((cost *100) / self.initialCost)
        weights = ( self.NN.deLinearize(theta) )
        weights = [w.tolist() for w in weights]
        result['weights'] = weights
        
        self.socketWriter(json.dumps(result))

    def predMatrix(self,X ,Y):

        xr = X.ravel()
        yr = Y.ravel()
        xr.resize((X.ravel().shape[0],1))
        yr.resize((Y.ravel().shape[0],1))

        listXY = np.concatenate((xr,yr), 1)

        listYhat = self.NN.forward(self.NN.deLinearize(self.betas), listXY)

        #ZBool = listYhat[:,0] > listYhat[:,1]

        #ZList = np.array([-1 if zbool else 1 for zbool in ZBool]) # ToDo : Optimize this statement
        #ZList = np.array([l[0] for l in listYhat]) # ToDo : Optimize this statement

        Z = np.reshape(listYhat[:,0], X.shape)

        return Z

