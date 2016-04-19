# -*- coding:utf-8 -*-

import itertools
import json
import os
import HTTPclient    #Copy from global_traffic
import ESClient
import elasticsearch

from datetime import datetime
from datetime import timedelta

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.shortcuts import render   #Copy From global_traffic
from django.template import RequestContext
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST

from logging import getLogger

logger = getLogger("views_logger")

TOPO_URL = 'http://192.168.19.1:8081/wm/topology/links/json'   # Define the topo_graph's data source

LINK_URL = 'http://192.168.19.1:8081/wm/device/'

GLOBAL_URL = 'http://192.168.19.1:8888/sc/globalflow/'

OS_TOPOLOGY_URL = "http://192.168.19.1:8888/sc/knowledgebase/security/dev_topology"

SECURITY_CONTROLLER = "http://192.168.19.1:8888"
ES_HOST = "http://192.168.19.1:9200"

def index(request):
    """
    Home Page of data application,show the introduction of the
    website.
    """
    args_data = {
            'cv_index': True,
#            'global_url':GLOBAL_URL,
            }
    return render_to_response(
            "viewapp/index.html",
            args_data,
            context_instance=RequestContext(request)
            )

@require_GET
def topological_graph_show(request):
    status1, topo_data= HTTPclient.http_request(TOPO_URL,"GET")
    topo_data=json.dumps(topo_data)

    status2, link_data = HTTPclient.http_request(LINK_URL,"GET")
    link_data=json.dumps(link_data)

    status3, global_data = HTTPclient.http_request(GLOBAL_URL,"GET")
    global_data=json.dumps(global_data)

    #client = elasticsearch.Elasticsearch(ES_HOST)
    #client.cluster = 'yuyuan'
    #indices_client = elasticsearch.client.IndicesClient(client)
    #try:
    #    indices_client.delete('current')
    #finally:
    #    indices_client.create(index='current')
    #    client.create(index = 'current', doc_type = 'globalflow',body = global_data)

    args_data = {
            'cv_topological_graph': True,
            'topo_data': topo_data,
            'link_data': link_data,
            'global_data': global_data,
            }
    return render_to_response('viewapp/topological_graph.html',
                              args_data,
                              context_instance=RequestContext(request))

@require_GET
def global_retrieve_show(request):
    args_data = {
            'cv_global_retrieve': True,
            }
    return render_to_response('viewapp/global_retrieve.html',
                              args_data,
                              context_instance=RequestContext(request))


@require_GET
def flow_statis_show(request):
    args_data = {
            'cv_flow_statis': True,
            }
    return render_to_response('viewapp/flow_statis.html',
                              args_data,
                              context_instance=RequestContext(request))

@require_GET
def record_retrieve(request):
    status1, topo_data= HTTPclient.http_request(TOPO_URL,"GET")
    topo_data=json.dumps(topo_data)

    status2, link_data = HTTPclient.http_request(LINK_URL,"GET")
    link_data=json.dumps(link_data)

    args_data = {
            'cv_record_retrieve': True,
            'topo_data': topo_data,
            'link_data': link_data,
            }
    return render_to_response('viewapp/record_retrieve.html',
                              args_data,
                              context_instance=RequestContext(request))

def get_date_range(request):

    if 'datefrom' in request.GET and 'dateto' in request.GET:
        try:
            dateFromStr = request.GET['datefrom']
            dateToStr = request.GET['dateto']
            dateFrom = datetime.strptime(dateFromStr,'%Y-%m-%d')
            dateTo = datetime.strptime(dateToStr, '%Y-%m-%d')
        except Exception as error:
            logger.error(error)
    else:
        dateFrom = datetime.today()
        dateTo = dateFrom
    return dateFrom, dateTo

#Copy from the global_traffic

def testFormat(req):
    return HttpResponse('{"status":"ok","result":[{"matchlist":[{"wildcards":3145728,"inputPort":0,"dataLayerSource":"00:11:22:03:04:02","dataLayerDestination":"00:90:0b:01:78:e9","dataLayerVirtualLan":-1,"dataLayerVirtualLanPriorityCodePoint":0,"dataLayerType":2048,"networkTypeOfService":"0","networkProtocol":6,"networkSource":"10.201.111.1","networkDestination":"163.177.153.55","transportSource":-9331,"transportDestination":80,"networkDestinationMaskLen":32,"networkSourceMaskLen":32,"match":"00:90:0b:01:78:e900:11:22:03:04:022048-1-1163.177.153.5532610.201.111.132080-93313145728"}],"pathlink":{"dpid":"00:00:e0:db:55:1f:00:01","inport":"1","prevNodeOutport":"s","nextNodes":[{"dpid":"00:00:00:1e:08:09:00:02","inport":"1","prevNodeOutport":"2","nextNodes":[{"dpid":"00:00:00:1e:08:09:00:04","inport":"1","prevNodeOutport":"2","nextNodes":[{"dpid":"00:00:00:1e:08:09:00:07","inport":"1","prevNodeOutport":"2","nextNodes":[{"dpid":null,"inport":null,"prevNodeOutport":"2","nextNodes":null}]},{"dpid":"00:00:00:1e:08:09:00:08","inport":"1","prevNodeOutport":"3","nextNodes":[{"dpid":null,"inport":null,"prevNodeOutport":"2","nextNodes":null}]}]}]},{"dpid":"00:00:00:1e:08:09:00:03","inport":"1","prevNodeOutport":"3","nextNodes":[{"dpid":"00:00:00:1e:08:09:00:05","inport":"1","prevNodeOutport":"2","nextNodes":[{"dpid":null,"inport":null,"prevNodeOutport":"2","nextNodes":null}]},{"dpid":"00:00:00:1e:08:09:00:06","inport":"1","prevNodeOutport":"3","nextNodes":[{"dpid":null,"inport":null,"prevNodeOutport":"2","nextNodes":null},{"dpid":null,"inport":null,"prevNodeOutport":"3","nextNodes":null}]}]}]}}]}')

def dealWithFormFlow(request):
    print "ok"
    req= request.REQUEST#json.loads(request.body)
    get_data=""
    post_data={}
    if(req.get('src_mac')):
        post_data['dataLayerSource']=req.get('src_mac')
    if(req.get('dst_mac')):
        post_data['dataLayerDestination']=req.get('dst_mac')
    if(req.get('proto')):
        post_data['networkProtocol']=int(req.get('proto'))
    if(req.get('src_ip')):
        post_data['networkSource']=req.get('src_ip')
    if(req.get('dst_ip')):
        post_data['networkDestination']=req.get('dst_ip')
    if(req.get('src_port')):
        post_data['transportSource']=req.get('src_port')
    if(req.get('dst_port')):
        post_data['transportDestination']=req.get('dst_port')
    if(req.get('starttime')):
        post_data['starttime']=req.get('starttime')
    if(req.get('starttime')):
        post_data['endtime']=req.get('endtime')
    url=SECURITY_CONTROLLER+'/sc/globalflow/'
    post_str=json.dumps(post_data);
    print url
    print post_str
    result=HTTPclient.http_request(url,"GET",post_str)
    resp=json.dumps(result)
    #print str(resp)
    return HttpResponse(resp)

def dealWithForm(request):
    print "request body:"
    print str(request.body)
    req= request.REQUEST#json.loads(request.body)
    post_data={}
    if(req.get('src_mac')):
        post_data['dataLayerSource']=req.get('src_mac')
    if(req.get('dst_mac')):
        post_data['dataLayerDestination']=req.get('dst_mac')
    if(req.get('proto')):
        post_data['networkProtocol']=int(req.get('proto'))
    if(req.get('src_ip')):
        post_data['networkSource']=req.get('src_ip')
    if(req.get('dst_ip')):
        post_data['networkDestination']=req.get('dst_ip')
    if(req.get('src_port')):
        post_data['transportSource']=req.get('src_port')
    if(req.get('dst_port')):
        post_data['transportDestination']=req.get('dst_port')
    if(req.get('curPage')):
        post_data['curPage']=req.get('curPage')
    if(req.get('size')):
        post_data['size']=req.get('size')
    url=SECURITY_CONTROLLER+'/sc/globalflow/'
    post_str=json.dumps(post_data)
    print 'post data:',post_str
    print 'url :',url
    status, result= HTTPclient.http_request(url,"POST",post_str)
    resp=json.dumps(result)
    return HttpResponse(resp)

def dealWithRecordForm(request):
    print "request body:"
    print str(request.body)
    req= request.REQUEST#json.loads(request.body)
    term={}
    if(req.get('src_mac')):
        term['src_mac']=req.get('src_mac')
    if(req.get('dst_mac')):
        term['dst_mac']=req.get('dst_mac')
    if(req.get('src_ip')):
        term['src_ip']=req.get('src_ip')
    if(req.get('dst_ip')):
        term['dst_ip']=req.get('dst_ip')
    if(req.get('src_port')):
        term['src_port']=req.get('src_port')
    if(req.get('dst_port')):
        term['dst_port']=req.get('dst_port')
    if(req.get('creatTime')):
        term['createTime']=req.get('createTime')
    if(req.get('lastTime')):
        term['lastTime']=req.get('lastTime')
    print term
    result = ESClient.search(ES_HOST,"flow","globalflow",term)
    res_list = []
    for hit in result['hits']['hits']:
       res_list.append(hit['_source'])
    print res_list
    res_dic = {'result':res_list}
    resp=json.dumps(res_dic)
    return HttpResponse(resp)

def os_topology(request):
    """
    Display SecurityDevice's network topology
    """
    status, OS_TOPOLOGY= HTTPclient.http_request(OS_TOPOLOGY_URL,"GET")
    OS_TOPOLOGY=json.dumps(OS_TOPOLOGY)

    args_data = {
            'cv_OSTopology': True,
            'OS_TOPOLOGY': OS_TOPOLOGY,
            }
    return render_to_response(
            "viewapp/os_topology.html",
            args_data,
            context_instance=RequestContext(request)
            )
