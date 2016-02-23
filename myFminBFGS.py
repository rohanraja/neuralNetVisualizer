__author__ = 'rohanraja'

__author__ = 'rraja'

import numpy
from numpy import atleast_1d, eye, mgrid, argmin, zeros, shape, empty, \
     squeeze, vectorize, asarray, sqrt, Inf, asfarray, isinf

from scipy.optimize import linesearch

from scipy.optimize.optimize import wrap_function
from scipy.optimize.optimize import approx_fprime
from scipy.optimize.optimize import vecnorm
from scipy.optimize.optimize import line_search
import json
import ParamsManager
import pickle


def Customfmin_bfgs(f, x0, fprime=None, args=(), gtol=1e-5, norm=Inf,
              epsilon= numpy.sqrt(numpy.finfo(float).eps), maxiter=None, full_output=0, disp=1,
              retall=0, callback=None):


        testVar = 0
        x0 = asarray(x0).squeeze()
        if x0.ndim == 0:
            x0.shape = (1,)
        if maxiter is None:
            maxiter = len(x0)*200
        func_calls, f = wrap_function(f, args)
        if fprime is None:
            grad_calls, myfprime = wrap_function(approx_fprime, (f, epsilon))
        else:
            grad_calls, myfprime = wrap_function(fprime, args)
        gfk = myfprime(x0)
        k = 0
        N = len(x0)
        I = numpy.eye(N,dtype=int)
        Hk = I
        old_fval = f(x0)
        old_old_fval = old_fval + 5000
        xk = x0
        if retall:
            allvecs = [x0]
        sk = [2*gtol]
        warnflag = 0
        gnorm = vecnorm(gfk,ord=norm)
        while (gnorm > gtol) and (k < maxiter):
            pk = -numpy.dot(Hk,gfk)
            alpha_k, fc, gc, old_fval, old_old_fval, gfkp1 = \
               linesearch.line_search(f,myfprime,xk,pk,gfk,
                                      old_fval,old_old_fval)
            if alpha_k is None:  # line search failed try different one.
                alpha_k, fc, gc, old_fval, old_old_fval, gfkp1 = \
                         line_search(f,myfprime,xk,pk,gfk,
                                     old_fval,old_old_fval)
                if alpha_k is None:
                    # This line search also failed to find a better solution.
                    warnflag = 2
                    break
            xkp1 = xk + alpha_k * pk
            if retall:
                allvecs.append(xkp1)
            sk = xkp1 - xk
            xk = xkp1
            if gfkp1 is None:
                gfkp1 = myfprime(xkp1)

            yk = gfkp1 - gfk
            gfk = gfkp1
            if callback is not None:
                callback(xk)
            k += 1
            gnorm = vecnorm(gfk,ord=norm)
            if (gnorm <= gtol):
                break

            try: # this was handled in numeric, let it remaines for more safety
                rhok = 1.0 / (numpy.dot(yk,sk))
            except ZeroDivisionError:
                rhok = 1000.0
                print "Divide-by-zero encountered: rhok assumed large"
            if numpy.isinf(rhok): # this is patch for numpy
                rhok = 1000.0
                print "Divide-by-zero encountered: rhok assumed large"
            A1 = I - sk[:,numpy.newaxis] * yk[numpy.newaxis,:] * rhok
            A2 = I - yk[:,numpy.newaxis] * sk[numpy.newaxis,:] * rhok
            Hk = numpy.dot(A1,numpy.dot(Hk,A2)) + rhok * sk[:,numpy.newaxis] \
                     * sk[numpy.newaxis,:]

        if disp or full_output:
            fval = old_fval
        if warnflag == 2:
            if disp:
                print "Warning: Desired error not necessarily achieved" \
                      "due to precision loss"
                print "         Current function value: %f" % fval
                print "         Iterations: %d" % k
                print "         Function evaluations: %d" % func_calls[0]
                print "         Gradient evaluations: %d" % grad_calls[0]

        elif k >= maxiter:
            warnflag = 1
            if disp:
                print "Warning: Maximum number of iterations has been exceeded"
                print "         Current function value: %f" % fval
                print "         Iterations: %d" % k
                print "         Function evaluations: %d" % func_calls[0]
                print "         Gradient evaluations: %d" % grad_calls[0]
        else:
            if disp:
                print "Optimization terminated successfully."
                print "         Current function value: %f" % fval
                print "         Iterations: %d" % k
                print "         Function evaluations: %d" % func_calls[0]
                print "         Gradient evaluations: %d" % grad_calls[0]

        if full_output:
            retlist = xk, fval, gfk, Hk, func_calls[0], grad_calls[0], warnflag
            if retall:
                retlist += (allvecs,)
        else:
            retlist = xk
            if retall:
                retlist = (xk, allvecs)

        return retlist


def fminLooped(f, x0, fprime=None, args=(), gtol=1e-5, norm=Inf,
              epsilon= numpy.sqrt(numpy.finfo(float).eps), maxiter=None, full_output=0, disp=1,
              retall=0, callback=None):

    testVar = 0

    x0 = asarray(x0).squeeze()
    if x0.ndim == 0:
        x0.shape = (1,)
    if maxiter is None:
        maxiter = len(x0)*200
    func_calls, f = wrap_function(f, args)
    if fprime is None:
        grad_calls, myfprime = wrap_function(approx_fprime, (f, epsilon))
    else:
        grad_calls, myfprime = wrap_function(fprime, args)
    gfk = myfprime(x0)
    k = 0
    N = len(x0)
    I = numpy.eye(N,dtype=int)
    Hk = I
    old_fval = f(x0)
    old_old_fval = old_fval + 5000
    xk = x0
    if retall:
        allvecs = [x0]
    sk = [2*gtol]
    warnflag = 0
    gnorm = vecnorm(gfk,ord=norm)

    newInputParams = locals()

    pickleBles, NonPickles = ParamsManager.filterUnpickles(newInputParams)

    import dill
    pickle.dump(pickleBles, open('inputParams.dat', 'w'))
    pickle.dump(loopThing, open('loopFunc.dat', 'w'))

    for loopI in range(100):

        newInputParams = loopThing(newInputParams)


def loopPost():
    pass

def getOutputParams(inputParams, localVars):

    outputParams = {}

    for (k,v) in localVars:
        if k in inputParams:
            outputParams[k] = v

    return outputParams

def loopThing_BFGS(inputParams):

    for key in inputParams:
        exec(key + " = inputParams['" + key + "']")

    pk = -numpy.dot(Hk,gfk)
    alpha_k, fc, gc, old_fval, old_old_fval, gfkp1 = \
       linesearch.line_search(f,myfprime,xk,pk,gfk,
                              old_fval,old_old_fval)
    if alpha_k is None:  # line search failed try different one.
        alpha_k, fc, gc, old_fval, old_old_fval, gfkp1 = \
                 line_search(f,myfprime,xk,pk,gfk,
                             old_fval,old_old_fval)
        if alpha_k is None:
            # This line search also failed to find a better solution.
            warnflag = 2
            outputParams = getOutputParams(inputParams, locals().items())
            return outputParams

    xkp1 = xk + alpha_k * pk
    if retall:
        allvecs.append(xkp1)
    sk = xkp1 - xk
    xk = xkp1
    if gfkp1 is None:
        gfkp1 = myfprime(xkp1)

    yk = gfkp1 - gfk
    gfk = gfkp1
    if callback is not None:
        callback(xk)
    k += 1
    gnorm = vecnorm(gfk,ord=norm)
    if (gnorm <= gtol):
        outputParams = getOutputParams(inputParams, locals().items())
        return outputParams

    try: # this was handled in numeric, let it remaines for more safety
        rhok = 1.0 / (numpy.dot(yk,sk))
    except ZeroDivisionError:
        rhok = 1000.0
        print "Divide-by-zero encountered: rhok assumed large"
    if numpy.isinf(rhok): # this is patch for numpy
        rhok = 1000.0
        print "Divide-by-zero encountered: rhok assumed large"
    A1 = I - sk[:,numpy.newaxis] * yk[numpy.newaxis,:] * rhok
    A2 = I - yk[:,numpy.newaxis] * sk[numpy.newaxis,:] * rhok
    Hk = numpy.dot(A1,numpy.dot(Hk,A2)) + rhok * sk[:,numpy.newaxis] \
             * sk[numpy.newaxis,:]

    outputParams = getOutputParams(inputParams, locals().items())
    return outputParams
def loopThing(inputParams):

    for key in inputParams:
        exec(key + " = inputParams['" + key + "']")


    xk = xk - 0.01* fprime(xk)

    if callback is not None:
        callback(xk)

    outputParams = getOutputParams(inputParams, locals().items())
    return outputParams
