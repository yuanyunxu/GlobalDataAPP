#!/usr/bin/env python
# coding=utf-8

from django.conf.urls import patterns,url

from viewapp import views

urlpatterns = patterns('',
        url(r'^$', views.index,name='index'),
        url(r'^topological_graph$', views.topological_graph_show, name='topological_graph'),
        url(r'^global_retrieve$', views.global_retrieve_show, name='global_retrieve'),
        url(r'^flow_statis$', views.flow_statis_show, name='flow_statis'),
        #url(r'^retrieve$', views.retrieve_show, name='retrieve'),
        )
