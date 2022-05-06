#!/usr/bin/env python2
# -*- coding: utf-8 -*-
import flask_restful as restful
from flask_restful import reqparse
import sys, json, requests, os, uuid,re


sys.path.append("..")
from conf import *
from lib import *

class Analyzer(restful.Resource):
    def __init__(self):
        self.output=""
        self.color = common.COLOR_GREEN
        self.title = ""
        self.contract_id = str(uuid.uuid1())
        self.contract_dir = os.path.join(common.HISTORY_LOCAL_PATH,self.contract_id)
        os.makedirs(self.contract_dir)

    def post(self):
        #try:
        parser = reqparse.RequestParser()
        parser.add_argument("type", type=unicode, required=True)
        parser.add_argument("name", type=unicode, required=True)
        parser.add_argument("code", type=unicode, required=True)
        parser.add_argument("target", type=unicode, required=True)
        parser.add_argument("owner", type=unicode, required=True)
        param = parser.parse_args()
        if param["type"] == "bytecode":

            status, compile_result = self.compile_bytecode(param["code"], int(param["target"]), int(param["owner"]))
        elif param["type"] == "solidity":

            status, compile_result = self.compile_solidity(param["code"], int(param["target"]),int(param["owner"]))
        compile_result = json.dumps(compile_result)
        if status:
            return response.success(compile_result)
        else:
            return response.fail(compile_result)


    def compile_solidity(self, solidity_code, target_depth, owner_depth):
        try:

            solidity_filepath = os.path.join("/tmp",self.contract_id+".sol")
            solidity_filepath = str(solidity_filepath)
            print solidity_filepath
            solidity_outpath = os.path.join("/tmp",self.contract_id+".txt")
            solidity_outpath = str(solidity_outpath)
            solidity_finalpath = os.path.join("/tmp",self.contract_id+".out")
            solidity_finalpath = str(solidity_finalpath)
            solidity_randompath = os.path.join("/tmp",self.contract_id+".reout")
            solidity_randompath = str(solidity_randompath)
            solidity_resultdir = os.path.join("/tmp",self.contract_id)
            compile_result = {}
            compile_result["reentrancy"] = []
            compile_result["Pseudo_random"] = []
            with open(solidity_filepath, 'w') as f:
                f.write(solidity_code)
            #my = os.popen("python %s -s %s >> %s 2>&1"%("~/Re-entrancy/oyente/oyente.py","~/Re-entrancy/25.sol","~/my.txt")).read()
            my = os.popen("time python ~/Re-entrancy/oyente/oyente.py -s %s -td %d -md %d -j -a -t 300000 > %s 2>&1 " %(solidity_filepath,target_depth,owner_depth,solidity_outpath)).read()
            ms = open(solidity_outpath)
            flag = False
            while 1:
                linestr = ms.readline()
                if linestr.find("Warning: prng Vulnerability") != -1:
                    linenum = "Prng Vulnerability happen in line :" + linestr.split(":")[3]
                    lineinfo = ms.readline()
                    #lineinfo = linestr.split("Vulnerability.")[1]
                    random_info = str(linenum +"\n" + lineinfo + "\n")
                    
                    with open(solidity_randompath,"a") as ranstr:
                        ranstr.write(random_info)
                if linestr.find("inputs")!= -1:
                    flag = False
                if linestr.find("-ce")!= -1:
                    flag = True
                if linestr.find("sys")!= -1:
                    flag = True

                    linesplit = linestr.split("user")
                    linestr = "Used time :" + linesplit[0] + "s"
                if linestr.find('end_analysis_reentrancy')!= -1:
                    flag = False
                if flag:
                    if linestr.find("INFO")!= -1:
                        linestr = linestr.split("symExec:")[1]
                    with open(solidity_finalpath,"a") as mon:
                        mon.write(linestr)

                if linestr.find('begin_analysis_reentrancy')!= -1:
                    flag = True
                if not linestr:
                    break

            str1 = "cat %s" % (solidity_finalpath)

            compile_result_file = os.popen(str1)
            re_result = compile_result_file.read()

            compile_result["reentrancy"].append(str(re_result))

            str2 = "cat %s" % (solidity_randompath)
            random_result_file = os.popen(str2)
            random_result = random_result_file.read()
            compile_result["Pseudo_random"].append(str(random_result))
        
            return True, compile_result
        except Exception, e:
            return False, str(e)
    def compile_bytecode(self, bytecode, target_depth, owner_depth):
        try:
            compile_result_file = os.popen("python ~/Re-entrancy/oyente/oyente.py -b %s -td %d -md %d" %(bytecode,target_depth,owner_depth))
            compile_result = compile_result_file.read()
            return True, compile_result
        except Exception, e:
            return False, str(e)
