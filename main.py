__author__ = 'rohanraja'
from time import sleep
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
import TrainingJob
from multiprocessing.pool import ThreadPool
from multiprocessing import Queue, Pool
poolWorkers   = ThreadPool(10)
ALL_PROGRESSES = []
JOBCOUNT = 0
ALLHANDLERS = {}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print("Recieved request")
        f = open("static/partials/index.html")
        self.write(f.read())
class Home(tornado.web.RequestHandler):
    def get(self):
        loader = template.Loader("templates/")
        outp = loader.load("test.html").generate(myvalue="XXX")
        self.write(outp)
        self.write("This is Home")

class TrainingRequest(tornado.web.RequestHandler):
    def post(self):
        message = self.get_argument("msg")
        print("Recieved Training Request")
        self._run_trainer(message)

    def _run_trainer(self, message):
        global JOBCOUNT
        JOBCOUNT += 1
        self.write(str(JOBCOUNT))
        ALLHANDLERS[JOBCOUNT] = ""
        poolWorkers.apply_async(lambda : self._blocking_run_trainer(message, JOBCOUNT), (), {}, lambda arg: self.on_train_complete(JOBCOUNT))
        # ALLHANDLERS[JOBCOUNT].append(self.write_message)
    
    def _blocking_run_trainer(self, message, jobid):
        print("CALLED BLOCKING IN THREAD")
        self.jobid = jobid
        self.inputData = json.loads(message)
        samples = self.inputData['trainingData']['samples']
        X = [sample['inputVector'] for sample in samples]
        Y = [sample['outputVal'] for sample in samples]
        if self.inputData['ml_algo'] == "nnet":
            lr2 = nnT.NeuralNetworkTrainer(X,Y, socketWriter=self.trainUpdaterGEN(self.jobid), inputData= self.inputData)
        else:
            lr2 = lrPoly.LogisticRegression(X,Y, socketWriter=self.trainUpdaterGEN(self.jobid), inputData= self.inputData)
        lr2.train()

    def trainUpdaterGEN(self, jid):
        def f(msg):
            ALLHANDLERS[jid] = (msg)

        return f

    def on_train_complete(self, inp):
        print("Training Complete", inp)
        del ALLHANDLERS[inp]

class TrainingStat(tornado.web.RequestHandler):
    def get(self, jid):
        self.write(ALLHANDLERS[int(jid)])

class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")
    
    def on_message(self, message):
        print("Running Trainer")
        self._run_trainer(message)
    
    def on_train_complete(self, inp):
        print("Training Complete", inp)
        del ALLHANDLERS[inp]
    
    def _run_trainer(self, message):
        global JOBCOUNT
        q = Queue()
        JOBCOUNT += 1
        ALLHANDLERS[JOBCOUNT] = []
        poolWorkers.apply_async(lambda : self._blocking_run_trainer(message, JOBCOUNT), (), {}, lambda arg: self.on_train_complete(JOBCOUNT))
        ALLHANDLERS[JOBCOUNT].append(self.write_message)
    
    def _blocking_run_trainer(self, message, jobid):
        print("CALLED BLOCKING IN THREAD")
        self.jobid = jobid
        self.inputData = json.loads(message)
        samples = self.inputData['trainingData']['samples']
        X = [sample['inputVector'] for sample in samples]
        Y = [sample['outputVal'] for sample in samples]
        if self.inputData['ml_algo'] == "nnet":
            lr2 = nnT.NeuralNetworkTrainer(X,Y, socketWriter=self.trainUpdater, inputData= self.inputData)
        else:
            lr2 = lrPoly.LogisticRegression(X,Y, socketWriter=self.trainUpdater, inputData= self.inputData)
        lr2.train()
    
    def sendDataMessage(self, message, jobid):
        for updater in ALLHANDLERS[jobid]:
            updater(message)
    
    def trainUpdater(self, message):
        import threading
        thread = threading.current_thread()
        # print "Update from: ", thread.name
        ioloop = tornado.ioloop.IOLoop.instance()
        ioloop.add_callback(lambda: self.sendDataMessage(message, self.jobid))
    
    def on_close(self):
        print("WebSocket closed")
class LogRegression(tornado.web.RequestHandler):
    def get(self):
        loader = template.Loader("templates/")
        outp = loader.load("test.html").generate(myvalue="XXX")
        self.write(outp)
    def post(self):
        self.write("")

class JobSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("JOBS SOCKET opened")
    def on_message(self, message):
        print("JOBS SOCKET RECIEVED")
        out = ""
        for q in list(ALLHANDLERS.keys()):
            try:
                ALLHANDLERS[q].append(self.write_message)
            except:
                pass
        self.write_message(out)
    def on_close(self):
        print("Closed")
class JobManager(tornado.web.RequestHandler):
    def get(self):
        out = ""
        f = open("static/partials/jobs.html")
        self.write(f.read())
        #
        # for q in ALLHANDLERS.keys():
        #     try:
        #         out = out + str(q) + " <br>"
        #     except:
        #         pass
        #
        # self.write(out)


class MyStaticFileHandler(tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

handlers = [
     (r"/",             MainHandler),
     (r"/trainRequest",             TrainingRequest),
     (r"/trainStat/([^/]+)",             TrainingStat),
     (r"/home",         LogRegression),
     (r"/jobs",         JobManager),
     (r"/jobsocket",    JobSocket),
     (r"/gradDesc",     LogRegression),
     (r"/websocket",    EchoWebSocket),
     (r'/static/(.*)',  MyStaticFileHandler, {'path': "static"})
]
application = tornado.web.Application(handlers)
if __name__ == "__main__":

    
    CERT_FILE = 'certs/nginx.crt'
    KEY_FILE = 'certs/nginx.key'
    
    application.listen(3000)
    # application.listen(3001, ssl_options={
    # "certfile": CERT_FILE,
    # "keyfile": KEY_FILE,
    # })
    tornado.ioloop.IOLoop.instance().start()
