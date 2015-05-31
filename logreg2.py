from scipy.optimize.optimize import fmin_cg, fmin_bfgs, fmin
import numpy as np
import pylab
import plotter
import json
def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

class SyntheticClassifierData():

    def __init__(self, N, d):
        """ Create N instances of d dimensional input vectors and a 1D
        class label (-1 or 1). """

        means = .05 * np.random.randn(2, d)

        self.X_train = np.zeros((N, d))
        self.Y_train = np.zeros(N)
        for i in range(N):
            if np.random.random() > .5:
                y = 1
            else:
                y = 0
            self.X_train[i, :] = np.random.random(d) + means[y, :]
            self.Y_train[i] = 2.0 * y - 1

        self.X_test = np.zeros((N, d))
        self.Y_test = np.zeros(N)
        for i in range(N):
            if np.random.randn() > .5:
                y = 1
            else:
                y = 0
            self.X_test[i, :] = np.random.random(d) + means[y, :]
            self.Y_test[i] = 2.0 * y - 1


class LogisticRegression():
    """ A simple logistic regression model with L2 regularization (zero-mean
    Gaussian priors on parameters). """

    def __init__(self, x_train=None, y_train=None, x_test=[], y_test=[],
                 alpha=.1, synthetic=False, socketWriter = None, inputData = None):

        try:
        # Set L2 regularization strength
            self.alpha = alpha

            # Set the data.
            self.set_data(x_train, y_train, x_test, y_test)

            # Initialize parameters to zero, for lack of a better choice.
            self.betas = np.zeros(self.x_train.shape[1])

            self.num = 0

            self.socketWriter = socketWriter
            self.inputData = inputData

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


    def afterIter(self, val):

        self.num = self.num + 1
        print self.num

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
        self.betas = fmin_bfgs(self.negative_lik, self.betas, fprime=dB, callback= self.onThetaIteration)

        return "Trained"

    def set_data(self, x_train, y_train, x_test, y_test):
        """ Take data that's already been generated. """

        self.x_train = np.array(x_train)
        if 0 in y_train :
            y_train = [2.0 * y - 1 for y in y_train]
        if 0 in y_test :
            y_test = [2.0 * y - 1 for y in y_test]

        self.y_train = np.array(y_train)
        self.x_test = np.array(x_test)
        self.y_test = np.array(y_test)
        self.n = self.y_train.shape[0]

        const = np.array([1] * self.n).reshape(self.n, 1)
        self.x_train = np.append(const, self.x_train, axis=1)


    def training_reconstruction(self):
        p_y1 = np.zeros(self.n)
        for i in range(self.n):
            p_y1[i] = sigmoid(np.dot(self.betas, self.x_train[i,:]))

        return p_y1


    def test_predictions(self):
        p_y1 = np.zeros(self.n)
        for i in range(self.n):
            p_y1[i] = sigmoid(np.dot(self.betas, self.x_test[i,:]))

        return p_y1


    def plot_training_reconstruction(self):
        pylab.plot(np.arange(self.n), .5 + .5 * self.y_train, 'bo')
        pylab.plot(np.arange(self.n), self.training_reconstruction(), 'rx')
        pylab.ylim([-.1, 1.1])


    def plot_test_predictions(self):
        pylab.plot(np.arange(self.n), .5 + .5 * self.y_test, 'yo')
        pylab.plot(np.arange(self.n), self.test_predictions(), 'rx')
        pylab.ylim([-.1, 1.1])

    def onThetaIteration(self, theta):

        self.betas = theta

        plotPathPoints = plotter.getPlottingPoints(0,
                                                   self.inputData['widthSvg'],
                                                   0,
                                                   self.inputData['heightSvg'],
                                                   self.HTheta,
                                                   10
                                                   )

        self.socketWriter(json.dumps(list([list(point) for point in plotPathPoints])))


    def HTheta(self,X, Y):

        return self.betas[0] + self.betas[1]*X + self.betas[2]*Y

if __name__ == "__main__":
    from pylab import *

    # Create 20 dimensional data set with 25 points -- this will be
    # susceptible to overfitting.
    data = SyntheticClassifierData(25, 20)

    # Run for a variety of regularization strengths
    alphas = [0, .001, .01, .1]
    for j, a in enumerate(alphas):

        # Create a new learner, but use the same data for each run
        lr = LogisticRegression(x_train=data.X_train, y_train=data.Y_train,
                                x_test=data.X_test, y_test=data.Y_test,
                                alpha=a)

        print "Initial likelihood:"
        print lr.lik(lr.betas)

        # Train the model
        lr.train()

        # Display execution info
        print "Final betas:"
        print lr.betas
        print "Final lik:"
        print lr.lik(lr.betas)

        # Plot the results
        subplot(len(alphas), 2, 2*j + 1)
        lr.plot_training_reconstruction()
        ylabel("Alpha=%s" % a)
        if j == 0:
            title("Training set reconstructions")

        subplot(len(alphas), 2, 2*j + 2)
        lr.plot_test_predictions()
        if j == 0:
            title("Test set predictions")

    show()

def testRun():



    data = SyntheticClassifierData(25, 2)

    # Run for a variety of regularization strengths
    alphas = [0, .001, .01, .1]
    for j, a in enumerate(alphas):

        # Create a new learner, but use the same data for each run
        lr = LogisticRegression(x_train=data.X_train, y_train=data.Y_train,
                                x_test=data.X_test, y_test=data.Y_test,
                                alpha=a)

        print "Initial likelihood:"
        print lr.lik(lr.betas)

        # Train the model
        lr.train()

        # Display execution info
        print "Final betas:"
        print lr.betas
        print "Final lik:"
        print lr.lik(lr.betas)

        # Plot the results
        pylab.subplot(len(alphas), 2, 2*j + 1)
        lr.plot_training_reconstruction()
        pylab.ylabel("Alpha=%s" % a)
        if j == 0:
            pylab.title("Training set reconstructions")

        pylab.subplot(len(alphas), 2, 2*j + 2)
        lr.plot_test_predictions()
        if j == 0:
            pylab.title("Test set predictions")

    pylab.show()

