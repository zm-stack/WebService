# -*- coding: utf-8 -*-

import sys  
#sys.path.append("/var/www/Archive/venv/lib/python3.8/site-packages")
sys.path.append("/var/www/Archive/web_api")

from flask import Flask
import flask_restful as restful
from flask_cors import CORS

from conf import *
from app import *


app = Flask(__name__)
api = restful.Api(app)
CORS(app, supports_credentials=True)


api.add_resource(analyzer.Analyzer, "/api/analyze")


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0',port=8080)


