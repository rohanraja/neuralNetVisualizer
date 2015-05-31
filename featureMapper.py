__author__ = 'rohanraja'
import numpy as np

def mapFeature(x,y, degree=2):

    out = [1]

    for i in range(1,degree+1):
        for j in range(i+1):
            out.append((np.power(x,(i-j)) * np.power(y,j)))

    return out
