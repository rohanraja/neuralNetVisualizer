# import dill
#
# nw = dill.load(open('f.dat'))
#
# print nw
import pickle

nw = pickle.load(open('f.dat'))

print(nw)