#!/usr/bin/env python
# coding=utf-8

from django.conf.urls import patterns,url

from viewapp import views

urlpatterns = patterns('',
        url(r'^$', views.index,name='index'),
        url(r'^topological_graph$', views.topological_graph_show, name='topological_graph'),
        url(r'^global_retrieve$', views.global_retrieve_show, name='global_retrieve'),
        url(r'^flow_statis$', views.flow_statis_show, name='flow_statis'),
        url(r'^record_retrieve$', views.record_retrieve, name='record_retrieve'),
        url(r'^submit$', views.dealWithForm, name='submit'),#Copy from the globaltraffic
        url(r'^submit_record_form$', views.dealWithRecordForm, name='submit_record_form'),
        url(r'^submit_record$', views.dealWithRecordForm, name='submit_record'),
        url(r'^submitFlow$', views.dealWithFormFlow),

        #url(r'^retrieve$', views.retrieve_show, name='retrieve'),
        )
