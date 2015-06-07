__author__ = 'rohanraja'

import numpy as np

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))


def sigmoidPrime(x):
    return sigmoid(x) * (1 - sigmoid(x))



class NeuralNetwork:

    def linearize(self, W):

        return np.concatenate((W[0].ravel(), W[1].ravel()))

    def deLinearize(self, w):

        w1_end = self.inputLayerSize*self.hiddenLayerSize
        w1 = w[0:w1_end]
        W1 = np.reshape(w1, (self.inputLayerSize,self.hiddenLayerSize))

        w2_end = w1_end + self.outputLayerSize*self.hiddenLayerSize
        w2 = w[w1_end:w2_end]
        W2 = np.reshape(w2, (self.hiddenLayerSize,self.outputLayerSize))

        return [W1, W2]

    def __init__(self, hiddenLayerSize = 5):

        self.inputLayerSize = 2
        self.hiddenLayerSize = hiddenLayerSize
        self.outputLayerSize = 2


        self.W1 = np.random.randn(self.inputLayerSize, self.hiddenLayerSize)
        self.W2 = np.random.randn(self.hiddenLayerSize, self.outputLayerSize)

        self.W = [self.W1, self.W2]


    def forward(self, W, X):

        self.z2 = np.dot(X, W[0])
        self.a2 = sigmoid(self.z2)

        self.z3 = np.dot(self.a2, W[1])
        self.a3 = sigmoid(self.z3)

        return self.a3


    def costFn(self, W, X, Y):

        cost = 0.0
        m = X.shape[0]
        K = 2

        Y = np.array([ [1,0] if y == 1 else [0,1] for y in Y ])

        hTheta = self.forward(W,X)

        logs = []

        for i in range(m):
            hThetaI = hTheta[i]

            for k in range(K):

                hThetaI[k] = hThetaI[k] - 1e-15 if hThetaI[k] == 1.0 else hThetaI[k]
                hThetaI[k] = hThetaI[k] + 1e-15 if hThetaI[k] == 0.0 else hThetaI[k]

                #if(hThetaI[k] < 1 and np.log(1 - hThetaI[k]) != -np.inf and np.log(hThetaI[k]) != -np.inf):                                 # To deal with exceptionally large log vals

                cost += (float(Y[i,k])) * np.log(hThetaI[k])
                cost += (float (1 - Y[i,k])) * np.log(1 - hThetaI[k])


                #else:
                    #print "Ignoring the example"
                    #cost += 0
                    #print 'cost '  , cost


        return -1.0 *(cost/float(m))
        #return (cost*cost)/float(m)


    def costFnPrime(self, W, X, Y):

        self.yHat = self.forward(W,X)
        m = X.shape[0]

        Y = np.array([ [1,0] if y == 1 else [0,1] for y in Y ])

        delta3 = np.multiply(-(Y - self.yHat) , sigmoidPrime(self.z3))
        dJW2 = np.dot(self.a2.T , delta3)

        delta2 = np.dot(delta3, W[1].T)*sigmoidPrime(self.z2)
        dJW1 = np.dot(X.T, delta2)

        return self.linearize([dJW1, dJW2])


    def backPropogation(self, X, Y):

        m = X.shape[0]

        Delta1 = np.zeros_like(self.W[0])
        Delta2 = np.zeros_like(self.W[1])

        Delta = [Delta1, Delta2]


        for i in range(m):

            self.forward(self.W, X[i])

            dirDelta = []
            dirDelta.insert(0, self.a3 - Y[i])

            d2 = np.dot(dirDelta[0], np.transpose(self.W[1])) * sigmoidPrime(self.z2)

            #Delta[0] += d2

        return Delta
