# -*- coding:utf-8 -*-

import itertools
import json
import os

from datetime import datetime
from datetime import timedelta

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET

from logging import getLogger

logger = getLogger("views_logger")

GLOBAL_URL = 'http://www.example.com'   # The method to load in the GLOBAL_URL need to be optimized

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
    dateFrom, dateTo = get_date_range(request)
    args_data = {
            'cv_topological_graph': True,
#            'global_url':GLOBAL_URL,
            'dateFrom': dateFrom,
            'dateTo': dateTo,
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
