__author__ = 'rohanraja'

import numpy as np

import matplotlib as mpl
import time as t

mpl.use('Agg')
import matplotlib.pyplot as plt

def timeThis(func):

    def timingThis(*args, **kwargs):
        t1 = t.time()

        retVal = func(*args, **kwargs)

        print("Calculation of ", func.__name__, " took ", t.time() - t1, " seconds")

        return retVal

    return timingThis



def getPlottingPoints(xMin, xMax, yMin, yMax, evalFunc, delta = 2, debugMap = False):

    #t1 = t.time()

    x = np.arange(xMin, xMax, delta)
    y = np.arange(yMin, yMax, delta)

    X, Y = np.meshgrid(x, y)
    Z = evalFunc(X,Y)


    # Z = np.transpose(Z)  # ToDo : Find out if it should be done

    CS = plt.contour(X, Y, Z, [0.5])

    if(debugMap):
        plt.clabel(CS, inline=1, fontsize=10)
        plt.title('Simplest default with labels')
        plt.show()

    try:
        p = CS.collections[0].get_paths()[0]
        v = p.vertices

        #print "Calculation of plot points took ", t.time() - t1 , " seconds"

        return v

    except:

        return []


def heatMap():
    pass

@timeThis
def sqr(x, y):
    return np.square(x-300) + np.square(y-200) - 20000

#getPlottingPoints(-5,5,-5,5,sqr,0.05, True)
