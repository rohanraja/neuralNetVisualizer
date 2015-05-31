__author__ = 'rohanraja'

import matplotlib
import numpy as np
import matplotlib.cm as cm
import matplotlib.mlab as mlab
import matplotlib.pyplot as plt

def getPlottingPoints(xMin, xMax, yMin, yMax, evalFunc, delta = 2, debugMap = False):

    x = np.arange(xMin, xMax, delta)
    y = np.arange(yMin, yMax, delta)

    X, Y = np.meshgrid(x, y)

    Z = evalFunc(X,Y)

    # Z = np.transpose(Z)  # ToDo : Find out if it should be done

    CS = plt.contour(X, Y, Z, [0])

    if(debugMap):
        plt.clabel(CS, inline=1, fontsize=10)
        plt.title('Simplest default with labels')
        plt.show()

    try:
        p = CS.collections[0].get_paths()[0]
        v = p.vertices

        return v

    except:

        return []

def sqr(x, y):
    return np.square(x-300) + np.square(y-200) - 20000



#getPlottingPoints(-5,5,-5,5,sqr,0.05, True)
