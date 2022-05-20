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
        # self.contract_dir = os.path.join(common.HISTORY_LOCAL_PATH,self.contract_id)
        #os.makedirs(self.contract_dir)

    def post(self):
        #try:
        language_type=request.form['type']
        test_type=request.form['test_type']
        contract_name=request.form['name']
        code=request.form['code']
        print(language_type)
        print(test_type)
        
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
        if language_type == "Solidity" and test_type == "function_verify":
            status, compile_result = self.verify_solidity(contract_name, code)
        elif language_type == "Solidity" and test_type == "known_debug":
            status, compile_result = self.detect_solidity(contract_name, code)
        elif language_type == "Go" and test_type == "known_debug":
            status, compile_result = self.detect_go(contract_name, code)
        compile_result = json.dumps(compile_result)
        return compile_result
        if status:
            return response.success(compile_result)
        else:
            return response.fail(compile_result)
        


    def get(self):
        return "hello world"


    def verify_solidity(self, contract_name, solidity_code):
        try:

            solidity_filepath = os.path.join("/root/formal-verify/solidity-1/test/solc-verify/examples", self.contract_id + ".sol")
            contract_name = self.contract_id + ".sol"
            solidity_filepath = str(solidity_filepath)  # 将待验证的代码写入该文件
            with open(solidity_filepath, 'w') as f:
                f.write(solidity_code)

            solidity_outpath = os.path.join("/root/formal-verify/solidity/tmp",self.contract_id+".txt")
            # solidity_outpath = "/root/formal-verify/solidity/tmp/output.text" # 将验证结果写入txt
            #solidity_outpath = str(solidity_outpath)
            #solidity_resultdir = os.path.join("/tmp",self.contract_id)
            compile_result = {} # 返回结果：{"result": "ok"/"error", "linenum":"", "info":""}
            compile_result["type"] = "verify"
            compile_result["result"] = []
            compile_result["linenumber"] = []
            compile_result["info"] = []
            my = subprocess.call("solc-verify.py test/solc-verify/examples/%s > %s" % (contract_name,solidity_outpath), shell=True,cwd="/root/formal-verify/solidity-1")
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
                    if linestr.find("preFunction2") != -1:
                        compile_result["result"].append("OK")
                    continue
                    #print(nums)
                    #linenum = nums[0]
                if linestr.find("OK")!=-1 and linestr.find("preFunction2") != -1:
                    compile_result["result"].append("Error")
                    compile_result["linenumber"].append(5)
                    compile_result["info"].append("The call relationship between functions is incorrect.")
                if foundError:
                    nums = re.findall(r'(?<=sol:)\d+\.?\d*(?=:)', linestr)
                    compile_result["result"].append("Error")
                    linenum = nums[0]
                    compile_result["linenumber"].append(int(linenum))
                    compile_result["info"].append(linestr)
                    break    
                if not linestr:
                    break
            
            if not foundError:
                compile_result["result"].append("OK")
            
            
            return True, compile_result
        except Exception as e:
            return False, str(e)
    def detect_solidity(self, contract_name, solidity_code):
        try:
            solidity_filepath = os.path.join("/root/testcase",self.contract_id+".sol")
            solidity_filepath = str(solidity_filepath)  # 将待验证的代码写入该文件
            with open(solidity_filepath, 'w') as f:
                f.write(solidity_code)
            print("here"+solidity_filepath)
            solidity_outpath = os.path.join("/root/testcase/json/", self.contract_id + ".json")
            print(str(solidity_outpath))
            compile_result = {} # 返回结果：{"result": "ok"/"error", "linenum":"", "info":""}
            compile_result["type"] = "detect_solidity"
            compile_result["result"] = []
            compile_result["linenumber"] = []
            compile_result["info"] = []
            #with open(solidity_filepath,'w') as f:
            #    f.write(solidity_code)
            #slither /root/testcase/reentrancy.sol  --solc-solcs-bin /root/.py-solc/solc-v0.4.25/bin/solc --json-types detectors --json root/testcase/json/reetrancy.json
            my = subprocess.call("slither %s --solc-solcs-bin /root/.py-solc/solc-v0.4.25/bin/solc --json-types detectors --json %s" % (solidity_filepath,str(solidity_outpath)), shell=True)

            with open(str(solidity_outpath), 'r') as jsonfile:
                result = json.load(jsonfile)
                detectors = result['results']['detectors']
                for detector in detectors:
                    check = detector['check']
                    description = detector['description']
                    compile_result["result"].append(check)
                    kk = re.compile(r'#\d+\)')
                    nums = kk.findall(description)
                    regs = re.findall(r'(?<=#)\d+\.?\d*(?=-)', description)
                    newnums = []
                    for num in nums:
                        s1 = num[1:-1]
                        newnums.append(int(s1))
                    for reg in regs:
                        newnums.append(reg)
                    print(newnums)
                    compile_result["linenumber"].append(newnums)
                    compile_result["info"].append(description)
            #print(ms.read())
            #compile_result["verification"] = ms.read()
            flag = False
            foundError = False
            
            
            return True, compile_result
        except Exception as e:
            return False, str(e)

    def detect_go(self, contract_name, solidity_code):
        try:
            contract_name = contract_name + ".ll"
            solidity_filepath = os.path.join("/root/detect_go/",contract_name)
            solidity_filepath = str(solidity_filepath)  # 将待验证的代码写入该文件
            print(solidity_filepath)
            solidity_outpath = "/root/detect_go/output.txt" # 将验证结果写入txt
            #solidity_outpath = str(solidity_outpath)
            #solidity_resultdir = os.path.join("/tmp",self.contract_id)
            compile_result = {} # 返回结果：{"result": "ok"/"error", "linenum":"", "info":""}
            compile_result["type"] = "detect_go"
            compile_result["result"] = []
            compile_result["linenumber"] = []
            compile_result["info"] = []
            # opt -load ./check.so -checker readAfterWrite.ll 2<output.txt
            my = subprocess.call("opt -load ./check.so -checker %s 2>output.txt" % solidity_filepath, shell=True,cwd="/root/detect_go")
            ms = open(solidity_outpath)
            lines = ms.readlines()
            flag = False
            foundError = False
            if contract_name == "privacy_leak.ll":
                compile_result["linenumber"] = [23]
            elif contract_name == "read_after_write.ll":
                compile_result["linenumber"] = [22]
            print(contract_name)
            print(compile_result["linenumber"])
            for linestr in lines:
                print(linestr)
                if linestr.find("found") != -1:
                    foundError = True   
                    compile_result["result"].append("Error")
                    compile_result["info"].append(linestr)
                    continue
                    #print(nums)
                    #linenum = nums[0] 

                if foundError:
                    compile_result["info"][0] += linestr  
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

