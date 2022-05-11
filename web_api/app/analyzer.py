#!/usr/bin/env python2
# -*- coding: utf-8 -*-
import flask_restful as restful
from flask_restful import reqparse
from flask import request
import sys, json, requests, os, uuid,re
import subprocess
import re


sys.path.append("..")
from conf import *
from lib import *

class Analyzer(restful.Resource):

    def __init__(self):
        self.output=""
        self.color = common.COLOR_GREEN
        self.title = ""
        self.contract_id = str(uuid.uuid1())
        #self.contract_dir = os.path.join(common.HISTORY_LOCAL_PATH,self.contract_id)
        #os.makedirs(self.contract_dir)

    def post(self):
        #try:
        code_type=request.form['type']
        contract_name=request.form['name']
        code=request.form['code']
        target=request.form['target']
        owner=request.form['owner']
        
        '''
        parser = reqparse.RequestParser()
        parser.add_argument("type", type=str,required=True)
        parser.add_argument("name", type=str, required=True)
        parser.add_argument("code", type=str,required=True)
        parser.add_argument("target", type=str, required=True)
        parser.add_argument("owner", type=str, required=True)
        print("enter1")
        param = parser.parse_args()
        
        if param["type"] == "solidity":
            status, compile_result = self.compile_solidity(param["code"])
        compile_result = json.dumps(compile_result)
        return compile_result
        '''
        if code_type == "solidity":
            status, compile_result = self.compile_solidity(contract_name, code)
        compile_result = json.dumps(compile_result)
        return compile_result
        if status:
            return response.success(compile_result)
        else:
            return response.fail(compile_result)
        


    def get(self):
        return "hello world"


    def compile_solidity(self, contract_name, solidity_code):
        try:

            solidity_filepath = os.path.join("/root/formal-verify/solidity/tmp",self.contract_id+".sol")
            solidity_filepath = str(solidity_filepath)  # 将待验证的代码写入该文件
            print(solidity_filepath)
            solidity_outpath = os.path.join("/root/formal-verify/solidity/tmp",self.contract_id+".txt")
            solidity_outpath = "/root/formal-verify/solidity/tmp/output.text" # 将验证结果写入txt
            #solidity_outpath = str(solidity_outpath)
            #solidity_resultdir = os.path.join("/tmp",self.contract_id)
            compile_result = {} # 返回结果：{"result": "ok"/"error", "linenum":"", "info":""}
            with open(solidity_filepath, 'w') as f:
                f.write(solidity_code)
            my = subprocess.call("solc-verify.py test/solc-verify/examples/Annotations.sol > %s" % solidity_outpath, shell=True,cwd="/root/formal-verify/solidity")
            #my = os.popen("ls > %s" % solidity_outpath).read()
            #my = os.popen("/Users/dongyu/Documents/Git/solidity/solc-verify.py %s --output %s" % (solidity_filepath, solidity_outpath)).read()
            ms = open(solidity_outpath)
            lines = ms.readlines()
            print(lines)
            #print(ms.read())
            #compile_result["verification"] = ms.read()
            flag = False
            foundError = False
            
            for linestr in lines:
                print(linestr)
                if linestr.find("ERROR") != -1:
                    foundError = True   # 如果发现Error，就读入下一行
                    continue
                    #print(nums)
                    #linenum = nums[0]
                if foundError:
                    kk = re.compile(r'\d+')
                    nums = kk.findall(linestr)
                    linenum = nums[0]
                    compile_result["result"] = "Error"
                    compile_result["linenumber"] = linenum
                    break    
                if not linestr:
                    break
            
            if not foundError:
                compile_result["result"] = "OK"
            
            return True, compile_result
        except Exception as e:
            return False, str(e)
    def compile_bytecode(self, bytecode, target_depth, owner_depth):
        try:
            compile_result_file = os.popen("python ~/Re-entrancy/oyente/oyente.py -b %s -td %d -md %d" %(bytecode,target_depth,owner_depth))
            compile_result = compile_result_file.read()
            return True, compile_result
        except Exception as e:
            return False, str(e)

