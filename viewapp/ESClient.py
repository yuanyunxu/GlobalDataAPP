#/usr/bin/python
# -*- coding : utf-8 -*-

from elasticsearch import Elasticsearch

def es_client(index,doc_type,term):
    client = Elasticsearch()
    client.cluster = 'yuyuan'
    body = {"query":{"filtered":{"filter":{"term":term}}}}
    result = client.search(index,doc_type,body)
    return result
result = es_client('jdbc','jdbc',{'src_mac': u'00:11:22:03:04:01'})
print result
