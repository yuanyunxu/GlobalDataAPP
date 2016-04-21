console.log(GLOBAL_DATA)
// init the dom
var d_src_mac = document.getElementById('src_mac')
d_src_mac.options.add(new Option("全部",""))
for(var tmp = 0; tmp< SRC_MAC.length; tmp++){
    d_src_mac.options.add(new Option(SRC_MAC[tmp],SRC_MAC[tmp]))
}
var d_dst_mac = document.getElementById('dst_mac')
d_dst_mac.options.add(new Option("全部",""))
for(var tmp = 0; tmp< DST_MAC.length; tmp++){
    d_dst_mac.options.add(new Option(DST_MAC[tmp],DST_MAC[tmp]))
}
var d_src_ip = document.getElementById('src_ip')
d_src_ip.options.add(new Option("全部",""))
for(var tmp = 0; tmp< SRC_IP.length; tmp++){
    d_src_ip.options.add(new Option(SRC_IP[tmp],SRC_IP[tmp]))
}
var d_dst_ip = document.getElementById('dst_ip')
d_dst_ip.options.add(new Option("全部",""))
for(var tmp = 0; tmp< DST_IP.length; tmp++){
    d_dst_ip.options.add(new Option(DST_IP[tmp],DST_IP[tmp]))
}
var d_src_port = document.getElementById('src_port')
d_src_port.options.add(new Option("全部",""))
for(var tmp = 0; tmp< SRC_PORT.length; tmp++){
    d_src_port.options.add(new Option(SRC_PORT[tmp],SRC_PORT[tmp]))
}
var d_dst_port = document.getElementById('dst_port')
d_dst_port.options.add(new Option("全部",""))
for(var tmp = 0; tmp< DST_PORT.length; tmp++){
    d_dst_port.options.add(new Option(DST_PORT[tmp],DST_PORT[tmp]))
}
var protoDict={
    1:"icmp",
    6:"tcp",
    17:"udp",
    58:"icmp6"
}
var pageSize=10;
var allPage=0;
var curPage=1;
function submitQuery(form,curPage,pageSize){
    with(form){
        $.ajax({
            type:"POST",
            url: "submit",
            data: {
                src_mac: src_mac.value,
                dst_mac: dst_mac.value,
                src_ip: src_ip.value,
                dst_ip: dst_ip.value,
                src_port: src_port.value,
                dst_port: dst_port.value,
                proto: proto.value,
                curPage: curPage,
                size: pageSize

            },
            dataType: 'json',
            async: false,
            success: function(data){
            legendData = []
            seriesDataList = []
                    console.log('data:')
                    console.log(data)
                    var byteCountList = []
                    var result=data.result.allList;
                    console.log(result)
                    for(var i=0; i<result.length; i++){
                        byteCountList.push(parseInt(result[i].byteCount))
                        var seriesData = {}
                        var flow=result[i]
                        if(flow.matchlist.length===0) continue
                        var fm=flow.matchlist[0]
                        var fp=flow.pathlink
                        var legendName = fm.dataLayerSource+'-->'+fm.dataLayerDestination
                        legendData.push(legendName)
                        seriesData['name'] = legendName
                        seriesData['type'] = 'map'
                        seriesData['mapType'] = 'world'
                        seriesData['data'] = []
                        seriesData['markLine'] = {}
                        seriesData['markLine']['effect'] = {}
                        seriesData['markLine']['effect']['show'] = true
                        seriesData['markLine']['effect']['scaleSize'] = 2
                        seriesData['markLine']['effect']['period'] = 30
                        seriesData['markLine']['effect']['color'] = 'red'
                        seriesData['markLine']['effect']['shadowBlur'] = 10
                        seriesData['markLine']['itemStyle'] = {}
                        seriesData['markLine']['itemStyle']['normal'] = {}
                        seriesData['markLine']['itemStyle']['normal']['borderWidth'] = 1
                        seriesData['markLine']['itemStyle']['normal']['lineStyle'] = {}
                        seriesData['markLine']['itemStyle']['normal']['lineStyle']['type'] = 'solid'
                        seriesData['markLine']['itemStyle']['normal']['lineStyle']['shadowBlur'] = 10
                        seriesData['data'].push({
                            "src_mac":fm.dataLayerSource,
                            "dst_mac":fm.dataLayerDestination,
                            "src_ip":fm.networkSource,
                            "dst_ip":fm.networkDestination,
                            "dataLayerType":fm.dataLayerType,
                            "dataLayerVirtualLan":fm.dataLayerVirtualLan,
                            "dataLayerVirtualLanPriorityCodePoint":fm.dataLayerVirtualLanPriorityCodePoint,
                            "inputPort":fm.inputPort,
                            "networkDestinationInt":fm.networkDestinationInt,
                            "networkDestinationMaskLen":fm.networkDestinationMaskLen,
                            "networkProtocol":fm.networkProtocol,
                            "networkSourceInt":fm.networkSourceInt,
                            "networkSourceMaskLen":fm.networkSourceMaskLen,
                            "networkTypeOfService":fm.networkTypeOfService,
                            "wildcards":fm.wildcards,
                            "byteCount":flow.byteCount,
                            "packetCount":flow.packetCount
                        })
                        var pathLink = []
                        pathLink.push({'name':fm.dataLayerSource,'value':parseInt(flow.byteCount)})
                        for (var k =0; k<fp.length; k++){
                            pathLink.push({'name':fp[k]['nodeId'],'value':parseInt(flow.byteCount)})
                        }
                        pathLink.push({'name':fm.dataLayerDestination,'value':parseInt(flow.byteCount)})
                        seriesData['markLine']['data'] = []
                        for (var n=0; n<pathLink.length-1;n++){
                        seriesData['markLine']['data'].push([{'name':pathLink[n]['name'],'value':pathLink[n]['value']},{'name':pathLink[n+1]['name']}])
                        }
                        seriesData['markPoint'] = {}
                        seriesData['markPoint']['symbol'] = 'emptyCircle'
                        seriesData['markPoint']['symbolSize'] = 10
                        seriesData['markPoint']['effect'] = {}
                        seriesData['markPoint']['effect']['show'] = true
                        seriesData['markPoint']['effect']['shadowBlur'] = 0
                        seriesData['markPoint']['itemStyle'] = {}
                        seriesData['markPoint']['itemStyle']['normal'] = {'label':{'show':false}}
                        seriesData['markPoint']['itemStyle']['emphasis'] = {'label':{'position':'top'}}
                        seriesData['markPoint']['data'] = pathLink
                        seriesDataList.push(seriesData)
                    }
                    console.log("byteCountList")
                    console.log(byteCountList)
                    var MAX_BYTECOUNT = Math.max.apply(null,byteCountList)
<!-- echarts related
require.config({
    paths:{
        echarts:'/static/js/echarts-2.2.5/build/dist'
          }
               }
              );

require(
        [
        'echarts',
        'echarts/chart/map'
        ],
        function (ec){
            var myChart = ec.init(document.getElementById('main'));
                        var dataRangeMax = MAX_BYTECOUNT + 1
                        var macRangeData = dataRangeMax/2
                        var switcherRangeData = 1
            var option = {
                backgroundColor:'#1b1b1b',
                color: ['gold','aqua','lime'],
                title:{
                    text:'Topological Graph',
                    subtext:'Can also detecte ARP attack',
                    x:'center',
                    textStyle:{color:'#fff'}
                },
                legend:{
                    orient:'vertical',
                    x:'left',
                    data:[],
                    selectedMode:'single',
                    selected:{},
                    textStyle:{
                        color:'#fff'
                    },
                },
                toolbox:{
                    show:true,
                    orient:'vertical',
                    x:'right',
                    y:'center',
                    feature:{
                        mark:{show:true},
                        dataView:{show:true,readOnly:true},
                        saveAsImage:{show:true}
                    }
                },
                tooltip:{
                    show:false
                },
                dataRange:{
                    min:0,
                    max:dataRangeMax,
                    calculable:true,
                    color:['#ff3333','orange','yellow','lime','aqua'],
                    textStyle:{color:'#fff'}
                    },
                series:[
                    {
                        name:'World',
                        type:'map',
                        roam:true,
                        hoverable:false,
                        mapType:'world',
                        itemStyle:{
                            normal:{
                                borderColor:'#1b1b1b',
                                borderWidth:0.5,
                                areaStyle:{
                                    color:'#1b1b1b'
                                    }
                                },
                        },
                        data:[],
                        markPoint:{
                            symbol: 'emptyCircle',
                            symbolSize: 10,
                            effect: {
                                show:false,
                                shadowBlur:0,
                                scaleSize:1
                                },
                            itemStyle:{
                                normal:{label:{show:false}},
                                emphasis:{label:{position:'top'}}
                                },
                            data:[],
                            },
                        markLine:{
                            symbol:['none','circle'],
                            symbolSize:1,
                            itemStyle:{
                                normal:{
                                color:'#fff',
                                borderWidth:1,
                                borderColor:'rgba(30,144,255,0.5)',
                                label:{show:false},
                                },
                            },
                            data:[],
                        },
                        geoCoord:{},
                        tooltip:{
                            trigger:'item',
                            showDelay:0,
                            hideDelay:50,
                            transitionDuration:0,
                            backgroundColor:'rgba(255,0,255,0.7)',
                            borderColor:'#f50',
                            borderRadius:8,
                            borderWidth:2,
                            padding:10,
                            position:function(p){
                                return [p[0]+10,p[1]-10];
                            },
                            textStyle:{
                                color:'yellow',
                                decoration:'none',
                                fontFamily:'Verdana,sans-serif',
                                fontSize:15,
                                fontStyle:'italic',
                                fontWeight:'bold'
                            },
                            formatter:function(params,ticket,callback){
                                console.log(params)
                                var res = 'Function formatter:<br/>' + params[0].name;
                                for (var i = 0,l = params.length;i<l;i++){
                                    res += '<br/>' + params[i].seriesName + ':' + params[i].value;
                                }
                                setTimeout(function(){
                                    callback(ticket,res);
                                },1000)
                            },
                        },
                    },
                ]
            };

        var hostSwitcherData = LINK_DATA
        var topoData = TOPO_DATA
        var pointData = []
        var lineData = []
        var geoCoord1 = {}
        var switchNode=[]
        for (var json=0;json<topoData.length;json++)
        {
            var srcSwitch = topoData[json]["src-switch"]
            var dstSwitch = topoData[json]["dst-switch"]
            switchNode.push(srcSwitch)
            switchNode.push(dstSwitch)
        }
        for (var json=0;json<hostSwitcherData.length;json++)
        {
           var switchDPID = hostSwitcherData[json].attachmentPoint
           if (switchDPID.length == 0){
               continue
        }
            var Switch = switchDPID[0].switchDPID
            switchNode.push(Switch)
        }
        var switchNodeSet = unique(switchNode)

        // draft the point Location
        var i = 0
        var k = 0
        for (var q = 0,x=parseInt(switchNodeSet.length/2);q<x;q++){
            var addConst = 2*x/50
            pointData[i] = {'name':switchNodeSet[q],value:switcherRangeData}
            var xis = (240*(q+addConst)/(x+addConst)-120).toFixed(2)
            var yis = Math.sqrt((1-xis*xis/(120*120))*30*30).toFixed(2)
            geoCoord1[switchNodeSet[q]] = [ xis, yis ]
            i++
        }
        for (var q = parseInt(switchNodeSet.length/2),x=switchNodeSet.length;q<x;q++){
            var addConst = 2*x/50
            pointData[i] = {'name':switchNodeSet[q],value:switcherRangeData}
            var xis = (240*(q-parseInt(x/2)+addConst)/(x-x/2)-120+addConst).toFixed(2)
            var yis = (-Math.sqrt((1-xis*xis/(120*120))*30*30)).toFixed(2)
            geoCoord1[switchNodeSet[q]] = [ xis,yis]
            i++
        }

                // draft the swtich link line
                for (var json=0;json<topoData.length;json++)
                {
                    var srcSwitch = topoData[json]['src-switch']
                    var dstSwitch = topoData[json]['dst-switch']
                    lineData[k] = [{name:srcSwitch,value:dataRangeMax,effect:{show:false}},{name:dstSwitch,symbol:'circle'}]
                    k = k + 1
                }
        for (var json=0;json<hostSwitcherData.length;json++)
        {
            if (hostSwitcherData[json]["mac"] && hostSwitcherData[json]['attachmentPoint'][0])
            {
                for (var j = 0;j<hostSwitcherData[json]["mac"].length;j++)
                {
                        pointData[i] = {'name':hostSwitcherData[json]["mac"][j],value:macRangeData,symbolSize:5}
            geoCoord1[hostSwitcherData[json]["mac"][j]] = [parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]["switchDPID"]][0])+parseFloat((60*Math.random()-30).toFixed(2)),parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]['switchDPID']][1])+parseFloat((60*Math.random()-30).toFixed(2))]
            i = i + 1
                }
            }
            if (hostSwitcherData[json]["attachmentPoint"])
            {
                for (var j=0;j<hostSwitcherData[json]["attachmentPoint"].length;j++)
                {
                    lineData[k] = [{name:hostSwitcherData[json]["mac"][0],smoothness:0,effect:{show:false},value:dataRangeMax},{name:hostSwitcherData[json]["attachmentPoint"][j]["switchDPID"],symbol:'circle'}]
                    k = k + 1
                    }
                }
            }

        option.series[0].geoCoord = geoCoord1
        option.series[0].markPoint.data = pointData
        option.series[0].markLine.data = lineData
        option.legend['data'] = legendData
                var selected = {}
                for (var p=0; p<legendData.length; p++){
                    selected[legendData[p]] = false
                }
                //option.legend['selected'] = selected
                for (var p=0; p<seriesDataList.length; p++){
                seriesDataList[p]["tooltip"] ={
                    "show":true,
                    "trigger":'item',
                    "showDelay":0,
                    "hideDelay":50,
                    "transitionDuration":0,
                    "backgroundColor":'rgba(255,0,255,0.7)',
                    "borderColor":'#f50',
                    "borderRadius":8,
                    "borderWidth":2,
                    "padding":10,
                    "position":function(p){
                        return [p[0]+10,p[1]-10];
                    },
                    "textStyle":{
                        "color":'yellow',
                        "decoration":'none',
                        "fontFamily":'Verdana,sans-serif',
                        "fontSize":15,
                        "fontStyle":'italic',
                        "fontWeight":'bold'
                    },
                    "formatter":function(params,ticket,callback){
                        console.log(params)
                        var res = "itemInfo as below: <br />" +params[0];
                        data = params["series"].data[0]
                        for (var i in data){
                            res += '<br/>' + i + ':' + data[i];
                        }
                        //setTimeout(function(){
                        //    callback(ticket,res);
                        //},1000)
                        return res;
                    },
                },
                    option.series.push(seriesDataList[p])
                }
        myChart.setOption(option);
        }
        )
                },
            failure: function(errMsg) {
                alert("ajax error: " );
            }
        });
    }
    return false;
}
$(document).ready(function(){
    $("#query_btn").click(function(){
        submitQuery($("#query_form"),curPage,pageSize);
    });
})

//echarts related

function unique(arr){
    var result = [], isRepeated;
    for (var i = 0 ;i<arr.length;i++){
    isRepeated = false;
    for (var j=0;j<result.length;j++){
        if (arr[i] == result[j]){
        isRepeated = true;
        break;
        }
    }
    if (!isRepeated){
        result.push(arr[i]);
    }
    }
    return result;
}

