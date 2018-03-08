import random
import numpy
import scipy.optimize


class LogisticRegression(object):
    # initialize

    def __init__(self, X, Y, alpha=0.0005, lam=0.0, printIter=True):

        x = numpy.array(X)
        m, n = x.shape
        # normalize data
        self.xMean = numpy.mean(x, axis=0)
        self.xStd = numpy.std(x, axis=0)
        #x = (x - self.xMean) / self.xStd

        # add const column to X
        const = numpy.array([1] * m).reshape(m, 1)

        self.X = numpy.append(const, x, axis=1)
        self.Y = numpy.array(Y)

        self.alpha = alpha
        self.lam = lam
        self.theta = numpy.array([0.0] * (n + 1))

        self.printIter = printIter
        print("lambda=", self.lam)

    # transform function
    def __sigmoid(self, x):
        # m,n = x.shape
        #z = numpy.array([0.0]*(m*n)).reshape(m,n)
        z = 1.0 / (1.0 + numpy.exp((-1) * x))
        return z

    # caluclate cost
    def __costFunc(self):
        "calculate cost"
        m, n = self.X.shape
        h_theta = self.__sigmoid(numpy.dot(self.X, self.theta))

        cost1 = (-1) * self.Y * numpy.log(h_theta)
        cost2 = (1.0 - self.Y) * numpy.log(1.0 - h_theta)

        cost = (
                   sum(cost1 - cost2) + 0.5 * self.lam * sum(self.theta[1:] ** 2)) / m
        return cost

    def costGradWrapper(self, theta, X, Y):

        cost = self.__costFunc()

        m, n = self.X.shape

        grad = numpy.array([0.0] * (n))

        h_theta = self.__sigmoid(numpy.dot(X, theta))
        diff = h_theta - Y

        for j in range(0, n):
            grad[j] = (1.0 / m) * (sum(diff * X[:, j]))

        return cost, grad


    # gradient descend
    def _gradientDescend(self, iters):
        """
        gradient descend:
        X: feature matrix
        Y: response
        theta: predict parameter
        alpha: learning rate
        lam: lambda, penality on theta
       """

        m, n = self.X.shape

        # print "m,n=" , m,n
        # print "theta", len(self.theta)

        for i in range(0, iters):
            theta_temp = self.theta

            # update theta[0]
            h_theta = self.__sigmoid(numpy.dot(self.X, self.theta))
            diff = h_theta - self.Y
            self.theta[0] = theta_temp[0] - self.alpha * \
                                            (1.0 / m) * sum(diff * self.X[:, 0])

            for j in range(1, n):
                val = theta_temp[
                          j] - self.alpha * (1.0 / m) * (sum(diff * self.X[:, j]) + self.lam * m * theta_temp[j])
                # print val
                self.theta[j] = val
            # calculate cost and print
            cost = self.__costFunc()

            #if self.printIter:
                #print "Iteration", i, "\tcost=", cost
                #print self.theta
                # print "theta", self.theta

    # simple name
    def run(self, iters, printIter=True):
        self.printIter = printIter
        self._gradientDescend(iters)


    def f(self, theta):

        m, n = self.X.shape
        h_theta = self.__sigmoid(numpy.dot(self.X, theta))

        cost1 = (-1) * self.Y * numpy.log(h_theta)
        cost2 = (1.0 - self.Y) * numpy.log(1.0 - h_theta)

        cost = (
                   sum(cost1 - cost2) ) / m
        return cost

    def fPrime(self, theta):

        m, n = self.X.shape

        grad = numpy.array([0.0] * (n))

        h_theta = self.__sigmoid(numpy.dot(self.X, theta))
        diff = h_theta - self.Y

        for j in range(0, n):
            grad[j] = (1.0 / m) * (sum(diff * self.X[:, j]))

        return grad

    def train(self, iters=100):

        theta = scipy.optimize.minimize(self.costGradWrapper, numpy.array([0.0] * (3)), args=(self.X, self.Y), method='Powell', jac = True)
        #theta = scipy.optimize.fmin_bfgs(f=self.f , x0 = [0, 0, 0], fprime=self.fPrime, maxiter=300)
        return theta

    # prediction
    def predict(self, X):

        # add const column
        m, n = X.shape
        x = numpy.array(X)
        x = (x - self.xMean) / self.xStd
        const = numpy.array([1] * m).reshape(m, 1)
        X = numpy.append(const, x, axis=1)

        pred = self.__sigmoid(numpy.dot(X, self.theta))
        numpy.putmask(pred, pred >= 0.5, 1.0)
        numpy.putmask(pred, pred < 0.5, 0.0)

        return pred

