from scipy.optimize.optimize import fmin_cg, fmin_bfgs, fmin
import numpy as np
import pylab
import plotter
import json
import featureMapper
import time
import myFminBFGS


def sigmoid(x):
    try:
        #print np.exp(-x)
        return 1.0 / (1.0 + np.exp(-x))
    except :
        return 0
class LogisticRegression():
    """ A simple logistic regression model with L2 regularization (zero-mean
    Gaussian priors on parameters). """

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

            # Initialize parameters to zero, for lack of a better choice.
            self.betas = np.zeros(self.x_train.shape[1])

            self.num = 0

            self.socketWriter = socketWriter

        except:
            pass

    def negative_lik(self, betas):
        return -1 * self.lik(betas)

    def lik(self, betas):
        """ Likelihood of the data under the current settings of parameters. """

        # Data likelihood
        l = 0
        for i in range(self.n):
            l += np.log(sigmoid(self.y_train[i] * \
                             np.dot(betas, self.x_train[i,:])))

        # Prior likelihood
        for k in range(1, self.x_train.shape[1]):
            l -= (self.alpha / 2.0) * self.betas[k]**2

        return l

    def train(self):
        """ Define the gradient and hand it off to a scipy gradient-based
        optimizer. """

        # Define the derivative of the likelihood with respect to beta_k.
        # Need to multiply by -1 because we will be minimizing.
        dB_k = lambda B, k : (k > 0) * self.alpha * B[k] - np.sum([ \
                                     self.y_train[i] * self.x_train[i, k] * \
                                     sigmoid(-self.y_train[i] *\
                                             np.dot(B, self.x_train[i,:])) \
                                     for i in range(self.n)])

        # The full gradient is just an array of componentwise derivatives
        dB = lambda B : np.array([dB_k(B, k) \
                                  for k in range(self.x_train.shape[1])])

        # Optimize

        self.initialCost = self.negative_lik(self.betas)

        self.betas = fmin_bfgs(self.negative_lik, self.betas, fprime=dB, callback= self.onThetaIteration)
        # self.betas = myFminBFGS.fminLooped(self.negative_lik, self.betas, fprime=dB, callback= self.onThetaIteration)

        return "Trained"

    def set_data(self, x_train, y_train):
        """ Take data that's already been generated. """

        self.x_train = np.array(x_train)

        self.xMean = np.mean(self.x_train, axis=0)
        self.xStd = np.std(self.x_train, axis=0)
        #self.x_train = (self.x_train - self.xMean) / self.xStd

        if 0 in y_train :
            y_train = [2.0 * y - 1 for y in y_train]


        self.y_train = np.array(y_train)

        self.n = self.y_train.shape[0]

        mappedX = []

        self.x_train = self.x_train / self.divFactor

        for x in self.x_train :
            mapX = featureMapper.mapFeature(x[0], x[1], self.degree)
            mappedX.append(mapX)

        self.x_train = np.array(mappedX)


    def predict(self, x, y):

        features = featureMapper.mapFeature(x,y, self.degree)

        return -1 if np.dot(self.betas , np.array(features)) > 0 else 1

    def onThetaIteration(self, theta):

        self.betas = theta

        cost = self.negative_lik(theta)

        print("LikelyHood: ", cost)

        plotPathPoints = plotter.getPlottingPoints(0,
                                                   float(self.inputData['widthSvg']) / self.divFactor,
                                                   0,
                                                   float(self.inputData['heightSvg']) / self.divFactor,
                                                   self.HTheta,
                                                   6.0/ self.divFactor
                                                   )

        result = {}

        result['plotPath'] = list([list(point*self.divFactor) for point in plotPathPoints])
        result['cost'] = cost
        result['percentComplete'] = 100 - ((cost *100) / self.initialCost)
        result['weights'] = []


        self.socketWriter(json.dumps(result))


    def HTheta(self,X, Y): # ToDo - Optimize for speed

        Z = np.random.random(X.shape)

        for i in range(Z.shape[0]):
            for j in range(Z.shape[1]):

                features = featureMapper.mapFeature(X[i,j], Y[i,j], self.degree)
                Z[i,j] = np.dot(self.betas , np.array(features))

        return Z#self.betas[0] + self.betas[1]*X + self.betas[2]*Y


    def predMatrix(self,X ,Y):

        Z = np.random.random(X.shape)

        for i in range(Z.shape[0]):
            for j in range(Z.shape[1]):

                Z[i,j] = self.predict(X[i,j], Y[i,j])

        return Z
