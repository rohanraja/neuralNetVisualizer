__author__ = 'rohanraja'

import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template as template
import json
import logreg
#import logreg2
import time
#from tornado.concurrent import return_future
from tornado import gen
import plotter
import logisticRegressionPoly as lrPoly
import neuralNetworkTrainer as nnT

def run_async(func):

	from threading import Thread
	from functools import wraps

	@wraps(func)
	def async_func(*args, **kwargs):
		func_hl = Thread(target = func, args = args, kwargs = kwargs)
		func_hl.start()
		return func_hl

	return async_func


class MainHandler(tornado.web.RequestHandler):

    def get(self):

        f = open("static/partials/index.html")
        self.write(f.read())


class Home(tornado.web.RequestHandler):

    def get(self):

        loader = template.Loader("templates/")
        outp = loader.load("test.html").generate(myvalue="XXX")
        self.write(outp)
        self.write("This is Home")


class EchoWebSocket(tornado.websocket.WebSocketHandler):

    def open(self):
        print("WebSocket opened")

    #@run_async
    def on_message(self, message):
        print message

        self.inputData = json.loads(message)
        samples = self.inputData['trainingData']['samples']

        X = [sample['inputVector'] for sample in samples]
        Y = [sample['outputVal'] for sample in samples]

        #lr2 = lrPoly.LogisticRegression(X,Y, socketWriter=self.write_message, inputData= self.inputData)
        lr2 = nnT.NeuralNetworkTrainer(X,Y, socketWriter=self.write_message, inputData= self.inputData)

       # print "Initial Likelihood : ", lr2.nnCost(lr2.betas)

        finalTheta = lr2.train()

        #lr2.onThetaIteration(finalTheta)

        print finalTheta


    def on_close(self):
        print("WebSocket closed")



class LogRegression(tornado.web.RequestHandler):

    def get(self):

        loader = template.Loader("templates/")
        outp = loader.load("test.html").generate(myvalue="XXX")
        self.write(outp)


    def post(self):

        self.write("")


handlers = [

     (r"/",             MainHandler),
     (r"/home",         LogRegression),
     (r"/gradDesc",         LogRegression),
     (r"/websocket",    EchoWebSocket),
     (r'/static/(.*)',  tornado.web.StaticFileHandler, {'path': "static"})

]

application = tornado.web.Application(handlers)

if __name__ == "__main__":
    application.listen(3001)
    tornado.ioloop.IOLoop.instance().start()