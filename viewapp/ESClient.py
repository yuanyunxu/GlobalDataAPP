#/usr/bin/python
# -*- coding : utf-8 -*-

from elasticsearch import Elasticsearch

def search(ES_HOST,index,doc_type,term):
    client = Elasticsearch(ES_HOST)
    client.cluster = 'yuyuan'
    should = []
    for key in term:
        should.append({"match":{key:term[key]}})
    body = {"query":{"bool":{"should":should}}}
    print 'body:',body
    result = client.search(index,doc_type,body)
    return result
