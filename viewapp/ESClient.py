#/usr/bin/python
# -*- coding : utf-8 -*-

from elasticsearch import Elasticsearch

def es_client(index,doc_type,term):
    client = Elasticsearch()
    client.cluster = 'yuyuan'
    body = {"query":{"match":term}}
    result = client.search(index,doc_type,body)
    return result
