import os
import sys
import json
import glob
import os
import time
import datetime
import xml.etree.ElementTree as ET
import jsonschema
import lxml
#import numpy
#import openpyxl as xl
from jsonschema import validate
from jsonpath_ng import jsonpath, parse
from lxml import etree

from libsqlite3 import *
from libxls import *
#from flask import Flask, render_template, request
#from validator import validate
#from openpyxl.styles import Font, Alignment
#from openpyxl.styles import Border, Side, Color, PatternFill
#from openpyxl.utils import get_column_letter

#app = Flask(__name__)
#app.config['TEMPLATES_AUTO_RELOAD'] = True

################################################################################
# [[ SCHEMA VALIDATION
def validate_schema_xml(xml_path: str, xsd_path: str) -> bool:

    xmlschema_doc = etree.parse(xsd_path)
    xmlschema = etree.XMLSchema(xmlschema_doc)

    xml_doc = etree.parse(xml_path)
    is_valid_schema = xmlschema.validate(xml_doc)
    schema_validation_msg = "TODO xml schema"
    schema_validation_msg = ""
    try:
        xmlschema.assertValid(xml_doc)
    except lxml.etree.DocumentInvalid as e:
        schema_validation_msg = str(e)

    return (is_valid_schema, schema_validation_msg)

def validate_schema_json(target_path, schema_path):
    try:
        with open(target_path, 'r', encoding="utf8") as json_file:
            json_data = json.load(json_file)
        with open(schema_path, 'r', encoding="utf8") as schema_file:
            schema_data = json.load(schema_file)
    except json.decoder.JSONDecodeError as e:
        # print("target path: " + target_path)
        # print("schema_path: " + schema_path)
        # print("error: " + str(e))
        return (False, str(e))

    schema_validation_msg = ""
    is_valid_schema = True
    try:
        validate(instance=json_data, schema=schema_data)
    except jsonschema.exceptions.ValidationError as e:
        is_valid_schema = False
        #schema_validation_msg = "".join(e.path)# + " : " + e.message
        schema_validation_msg = str(e)#e.message

    #print("# BEGIN MSG")
    #print(schema_validation_msg)
    #print("# END MSG")
    #print("path:"+str(schema_validation_msg.path))
    #for k, v in vars(schema_validation_msg).items():
    #    print(str(k) + " : " + str(v))

    return (is_valid_schema, schema_validation_msg)

def validate_schema(target_path, schema_path, data_type):
    if 'xml' == data_type:
        return validate_schema_xml(target_path, schema_path)
    elif 'json' == data_type:
        return validate_schema_json(target_path, schema_path)
# ]] SCHEMA VALIDATION
################################################################################

################################################################################
# [[ VALUE VALIDATION
def validate_value_xml(xml_file_path, xpath, values):
    doc = ET.parse(xml_file_path)

    xmlRoot = doc.getroot()

    res = xmlRoot.findall(xpath)
    value = ""
    for child_tag in res:
        #print(xpath + " : " + child_tag.text)
        value = child_tag.text
        if child_tag.text not in values:
            return (False, " is not valid", value)
    return (True, "", value)

def validate_value_json(json_file_path, json_path, value_list):
    value = get_value_by_jsonpath(json_file_path, json_path)
    if (None == value):
        return (False, "cannot get json value", None)
    #value_validation_msg = "TODO json value " + json_file_path + " " + json_path + " " + str(value_list) + " " + value#TODO
    value_validation_msg = ""
    is_value_valid = value in value_list
    if False == is_value_valid and type(1) == type(value):
        is_value_valid = str(value) in value_list

    if not is_value_valid:
        value_validation_msg = str(value) + " is not valid"
    return (is_value_valid, value_validation_msg, value)

def validate_value(target_path, selector, value_list, data_type):
    if 'xml' == data_type:
        return validate_value_xml(xml_file_path=target_path, xpath=selector, values=value_list)
    elif 'json' == data_type:
        return validate_value_json(target_path, selector, value_list)
# ]] VALUE VALIDATION
################################################################################

def append_message(msg, new_msg):
    if (len(msg) > 0):
        msg = msg + "\n" + new_msg
    else:
        msg = new_msg
    return msg

def is_property_nullable(selector, schema_file):
    try:
        #"selector": "dataSet.typeInfo.place",
        jsonpath = "$.properties.dataSet.properties.typeInfo.properties.category.nullable"
        jsonpath = "$.properties.dataSet.properties.typeInfo.properties.category.nullable"
        jsonpath = "$"
        # print(selector)

        selector_splitted = selector.split('.')
        # print(selector_splitted)
        for elem in selector_splitted:
            # print(elem)
            jsonpath = jsonpath + ".properties." + elem
        with open(schema_file, 'r', encoding="utf8") as json_file:
            json_data = json.load(json_file)
        jsonpath_expression = parse(jsonpath)
        match = jsonpath_expression.find(json_data)

        # print(jsonpath)
        # print(match)
        found = (match[0].value)
        # print(found)
        # print(found['nullable'])
        if None != found and 'nullable' in found and True == found['nullable']:
            return True
        # sys.exit(0)
    except json.decoder.JSONDecodeError as e:
        return False
    return False

def proc(params, workdir_path):
    # print(workdir_path + '/' + params["project_name"] + ".db")
    bEnableSQLite3DB = False

    if bEnableSQLite3DB:
        sqlite3 = csqlite3(workdir_path + '/' + params["project_name"] + ".db")

    target_path_abs = params['target_directory']
    schema_path =params['schema_file']

    time_begin = time.time()
    time_now = datetime.datetime.now()
    #date_string = now.strftime('%Y-%m-%d_%H%M%S')
    target_directory = params['target_directory']
    data_type = params['data_type']

    result = {}
    result['target_directory'] = params['target_directory']
    result['data_type']        = params['data_type']
    result['file_count'] = ''
    result['schema_property'] = {}
    result['schema_property_list'] = []

    # file_list = []
    file_dic = {}
    count_extension = {}
    count_value = {}
    count_valid_schema = {
        "valid": 0,
        "invalid": 0,
    }
    count_valid_value = {
        "valid": 0,
        "invalid": 0,
    }
    max_file_count = 9999999 #TODO
    bDoValidateSchema = True

    total_file_count = 0
    for root, dirs, files in os.walk(target_path_abs):
        for file in files:
            fname, ext = os.path.splitext(file)
            if ext == "."+params['data_type']:
                total_file_count += 1
    if bEnableSQLite3DB:
        sqlite3.summary_insert(total_file_count)

    for root, dirs, files in os.walk(target_path_abs):
        for file in files:
            mid_path = root[len(target_path_abs):]
            if len(mid_path) > 0:
                mid_path = os.sep + mid_path
            file_relative_path = "." + mid_path + os.sep + file

            fname, ext = os.path.splitext(file)

            if None == count_extension.get(ext):
                count_extension[ext] = 1
            else:
                count_extension[ext] = count_extension[ext] + 1

            if ext == "."+params['data_type']:
                max_file_count = max_file_count - 1
                if (max_file_count <= 0):
                    break
                target_path = root + "/" + file

                file_dic[file_relative_path] = {}
                file_dic[file_relative_path]['valid_schema'] = []

                # Schema validation
                if (bDoValidateSchema):
                    (is_valid_schema, schema_validation_msg) = validate_schema(target_path, schema_path, params['data_type'])
                    file_dic[file_relative_path]['valid_schema'] = is_valid_schema
                    if is_valid_schema:
                        count_valid_schema["valid"] = count_valid_schema["valid"] + 1
                    else:
                        count_valid_schema["invalid"] = count_valid_schema["invalid"] + 1
                    file_dic[file_relative_path]['schema_validation_msg'] = schema_validation_msg
                    result['schema_path'] = schema_path

                # Value validation
                bFile_has_invalid_value = False
                file_dic[file_relative_path]['value_validation'] = {}

                value_validation_msg = ''

                result_schema_property = {}

                for prop in params['schema_property']:
                    bFile_has_invalid_value = False
                    #prop_to_be_validate = {
                    #    'value_list': [value.strip() for value in prop['value_list'].split(',')],
                    #    'selector': prop['selector']
                    #}

                    #bPropertyNullable = is_property_nullable(prop['selector'], params['schema_file'])
                    # print(prop['selector'])
                    # print(bPropertyNullable)

                    file_dic[file_relative_path]['value_validation'][prop['selector']] = {}
                    # file_list[file_relative_path]['value_validation'] = []
                    if "value_list" in prop:
                        value_list1 = [value.strip() for value in prop['value_list'].split(',')]
                        (is_valid_value, value_validation_msg, value) = validate_value(target_path=target_path,
                            selector=prop['selector'],
                            value_list=value_list1,
                            data_type=params['data_type'])

                        file_dic[file_relative_path]['value_validation'][prop['selector']]['value'] = value
                        file_dic[file_relative_path]['value_validation'][prop['selector']]['selector'] = prop['selector']

                        if False == is_valid_value:
                            bFile_has_invalid_value = True
                            value_validation_msg = str(prop['selector']) + "("+str(value)+") is not in the value list "
                            
                            file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                            # file_list[file_relative_path]['value_validation'].append({
                            #      'selector' : prop['selector'],
                            #      'msg': value_validation_msg,
                            #      'result': False,
                            #      'value':value,
                            # })
                        else:
                            file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = True

                    #[[ extended validation
                    if 'required' in prop:
                        pass

                    try:
                        value = get_value_by_jsonpath(target_path, prop['selector'])
                    except IndexError as e:
                        if 'nullable' in prop and True == prop['nullable']:
                            pass
                        else:
                            bFile_has_invalid_value = True
                            value_validation_msg = str(prop['selector']) + " is null"
                            file_dic[file]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            # file_dic[file_relative_path]['value_validation'].append(value_validation_msg)
                            # file_dic[file_relative_path]['value_validation_msg'] += value_validation_msg
                        #continue
                    finally:
                        pass
                        #if 'nullable' in prop and True == prop['nullable']:
                        #    pass
                        #else:
                        #    bFile_has_invalid_value = True
                        #    file_dic[file_relative_path]['value_validation_msg'] = append_message(
                        #        file_dic[file_relative_path]['value_validation_msg'], str(prop['selector']) + \
                        #        " is null")
                        #pass

                    bDoCountValue = False
                    if "type" in prop:
                        if "number" == prop['type'] or "integer" == prop['type']:
                            bDoCountValue = True
                            if 'min' in prop:
                                if int(value) < int(prop['min']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + "("+str(value)+") is too small(min:"+str(prop['min'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            if 'max' in prop:
                                if int(value) > int(prop['max']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + "("+str(value)+") is too big(max:"+str(prop['max'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                        elif "string" == prop['type']:
                            bDoCountValue = True
                            if 'min' in prop:
                                if len(value) < int(prop['min']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + "("+str(value)+") is too short(min:"+str(prop['min'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            if 'max' in prop:
                                if len(value) > int(prop['max']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + "("+str(value)+") is too long(max:"+str(prop['max'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            if 'pattern' in prop:
                                import re
                                p = re.compile(prop['pattern'])
                                m = p.match(value)
                                if None == m:
                                    bFile_has_invalid_value = True
                                    value_validation_msg = "pattern " + prop['pattern'] + " not found"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                        elif "array" == prop['type']:
                            bDoCountValue = False
                            if list != type(value):
                                bFile_has_invalid_value = True
                                value_validation_msg = str(prop['selector']) + \
                                    "("+str(value)+") is not list type value"
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            if 'min' in prop:
                                if len(value) < int(prop['min']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + "("+str(value)+") is too small(min:"+str(prop['min'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                            if 'max' in prop:
                                if len(value) > int(prop['max']):
                                    bFile_has_invalid_value = True
                                    value_validation_msg = str(prop['selector']) + \
                                        "("+str(value)+") is too big(max:"+str(prop['max'])+")"
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                    file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                        elif "object" == prop['type']:
                            bDoCountValue = False
                        elif "boolean" == prop['type']:
                            bDoCountValue = False
                            if bool != type(value):
                                bFile_has_invalid_value = True
                                value_validation_msg = str(prop['selector']) + \
                                    "("+str(value)+") is not boolean type value"
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = value_validation_msg
                        elif "null" == prop['type']:
                            bDoCountValue = True
                            if None == value:
                                bFile_has_invalid_value = False
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = ''
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = True
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['value'] = "type is null"
                            else:
                                bFile_has_invalid_value = True
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['msg'] = str(value) + ' is not valid value'
                                file_dic[file_relative_path]['value_validation'][prop['selector']]['result'] = False

                    #]] extended validation

                    # value count
                    #try:
                    #    if None == count_value.get(value):
                    #        count_value[value] = 1
                    #    else:
                    #        count_value[value] = count_value[value] + 1
                    #except TypeError as e:
                    #    pass

                    if prop['selector'] not in result['schema_property']:
                        prop['value_count'] = {}
                        result['schema_property'][prop['selector']] = prop
                        result['schema_property'][prop['selector']]['valid_value_count'] = {
                            "valid":0,
                            "invalid":0
                        }
                        # result['schema_property'][prop['selector']]['invalid_filelist'] = {}
                        result_schema_property = prop

                    if bDoCountValue:
                        if None == value:
                            value = 'null'
                        try:
                            if value in result['schema_property'][prop['selector']]['value_count']:
                                result['schema_property'][prop['selector']]['value_count'][value] += 1
                            else:
                                result['schema_property'][prop['selector']]['value_count'][value] = 1
                        except TypeError as e:
                            # NOTE: the value is not countable
                            # print(target_path)
                            # print(prop['selector'])
                            # print(value)
                            # print(type(value))
                            # print(target_path)
                            # print(result['schema_property'][prop['selector']]['value_count'])
                            # sys.exit(0)
                            pass

                    if bFile_has_invalid_value:
                        result['schema_property'][prop['selector']]['valid_value_count']["invalid"] = result['schema_property'][prop['selector']]['valid_value_count']["invalid"] + 1
                        #result['schema_property'][prop['selector']]['invalid_filelist'][file_relative_path] = \
                        #    file_list[file_relative_path]['value_validation']
                    else:
                        result['schema_property'][prop['selector']]['valid_value_count']["valid"] = result['schema_property'][prop['selector']]['valid_value_count']["valid"] + 1

                result['schema_property_list'].append(result_schema_property)
                if bFile_has_invalid_value:
                    file_dic[file_relative_path]['invalid_value'] = True
                    count_valid_value["invalid"] = count_valid_value["invalid"] + 1
                else:
                    file_dic[file_relative_path]['invalid_value'] = False
                    count_valid_value["valid"] = count_valid_value["valid"] + 1

                if bEnableSQLite3DB:
                    sqlite3.summary_update()
                    sqlite3.file_insert(file_relative_path, '', file_dic[file_relative_path]['schema_validation_msg'],
                        value_validation_msg, '')

    #result['value_count'] = count_value
    #result['valid_value_count'] = count_valid_value
    result['schema_property_list'] = []
    result['valid_schema_count'] = count_valid_schema
    result['file_count'] = count_extension
    result['elapsed_time'] = time.time() - time_begin
    result['file_list'] = file_dic
    result['file_dic'] = file_dic

    xlworkbook1 = cXLWorkBook(workdir_path + '/'+params["project_name"] + params["job_number"] + ".xlsx", params["project_name"], result)

    return result

'''
@app.route("/GO", methods=["POST"])
def proc_main():
    payload = request.form
    response = {
        "request" : payload,
        "response" : proc(request.form),
    }
    return json.dumps(response, indent=4, ensure_ascii=False)

@app.route("/get_target_directories", methods=["POST"])
def get_target_directories():
    result_list = []
    for file in os.listdir("INPUT"):
        ret = 0

        result_list.append(file)
    response = result_list
    return json.dumps(response, indent=4, ensure_ascii=False)

@app.route("/")
def home():
    target_directories = []
    for file in os.listdir("INPUT"):
        target_directories.append(file)
    schema_files = []
    for file in os.listdir("schema_files"):
        target_directories.append(file)
        schema_files.append(file)
    return render_template("index.html",
        target_directories=target_directories,
        schema_files=schema_files)
'''

def get_value_by_jsonpath(json_filepath, jsonpath):
    try:
        with open(json_filepath, 'r', encoding="utf8") as json_file:
            json_data = json.load(json_file)
        jsonpath_expression = parse(jsonpath)
        match = jsonpath_expression.find(json_data)
    except json.decoder.JSONDecodeError as e:
        return None
    if 0 == len(match):
        return None
    
    return match[0].value

def print_beautified_xml(xml_file_path):
    doc = ET.parse(xml_file_path)
    xmlRoot = doc.getroot()
    tree = ET.ElementTree(xmlRoot)
    ET.indent(tree, space="\t", level=0)
    tree.write(sys.stdout, encoding="unicode")

if __name__ == "__main__":
    workdir_path = sys.argv[1]

    f = open(workdir_path+"/input.json", "r", encoding="utf8")

    param = json.loads(f.read())
    # print("start")
    # print(param)
    # param = {
    #     'target_directory' : "test_files_json",
    #     'data_type' : "json",
    #     'schema_file' : 'papsmear_schema.json',
    #     'selector' : "properties.classification.name",
    #     "value_list" : "I, LSIL, CANCER, P, HSIL",

    #     # 'target_directory' : "test_files_xml",
    #     # 'data_type' : "xml",
    #     # 'schema_file' : 'xml_schema_productname_data.xsd',
    #     # 'selector' : "./object/pose",
    #     # "value_list" : "Unspecified",
    # }
    response = {
        "response" : proc(param, workdir_path),
    }
    # print(json.dumps(response, indent=4, ensure_ascii=False))
    f = open(workdir_path+"/output.json", 'w', encoding="utf8")
    f.write(json.dumps(response, indent=4, ensure_ascii=False))
    f.close()
    # print(json.dumps(response, indent=4, ensure_ascii=False))


    sys.exit(0)
    #print_beautified_xml("INPUT/test_files_xml/10001_00_m_1.xml")
    print_beautified_xml("INPUT/test_files_xml/INVALID.xml")
    sys.exit(0)
    #get_target_directories()
    print(validate_value_xml("INPUT/test_files_xml/10001_00_m_1.xml", "./object/pose", []))
    print(validate_value_json("INPUT/test_files_json/SC2013081(C-P,X-5348_12398,S-32_42).json", "$.properties.classification.name", []))

    '''
    rule_list = [
        {
            "jsonpath": '$.properties.classification.name',
            "valid_values": [
                'CANCER',
                'I',
                'P',
                'LSIL',
                'HSIL',
            ]
        },
    ]

    #glob_result = glob.glob('/home/ubuntu/passbucket/local/test/json/FILES_/*.json')
    glob_result = glob.glob('test_files_json/*.json')
    for f in glob_result:
        for rule in rule_list:
            value = get_value_by_jsonpath(f, rule['jsonpath'])
            if value not in rule['valid_values']:
                print("the value '"+value+"' is NOT valid")
            else:
                #print("the value '"+value+"' is valid")
                pass
    '''

    print("=====================================")
    print("Elapsed Time:", time.time()- start)
    total_number_of_files = 0
    for ext in count_extension:
        print("Number of " + ext + " files : ", count_extension[ext])
        total_number_of_files = total_number_of_files = count_extension[ext]
    print("=====================================")
    print("Total Number of files : ", total_number_of_files)
    print("=====================================")
    print("Validation Valid    = ", countValid)
    print("Validation Invalid  = ", countInvalid)
    print("Validation SUM      = ", countValid + countInvalid)
    print("=====================================")

