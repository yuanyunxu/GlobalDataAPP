function submitQuery(form){
    with(form){
        $.ajax({
            type:"POST",
            url: "submit_record_form",
            data: {
                src_mac: src_mac.value,
                dst_mac: dst_mac.value,
                src_ip: src_ip.value,
                dst_ip: dst_ip.value,
                src_port: src_port.value,
                dst_port: dst_port.value,
                createTime: createTime.value,
                lastTime: lastTime.value
            },
            dataType: 'json',
            async: false,
            success: function(data){
                legendData = []
                seriesDataList = []
                result=data.result;
                for(var i=0; i<result.length; i++){
                    var seriesData = {}
                    var flow=result[i]
                    var fp=flow.links
                    var legendName = flow.src_mac+'-->'+flow.dst_mac
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
                    var pathLink = []
                    pathLink.push({'name':flow.src_mac,'value':parseInt(flow.byte_count)})
                    for (var k =0; k<fp.length; k++){
                        pathLink.push({'name':fp[k][0],'value':parseInt(flow.byte_Count)})//解决小括号里两个值的问题
                        }
                    pathLink.push({'name':flow.dst_mac,'value':parseInt(flow.byte_Count)})
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
                var dataRangeMax = 30000
                var macRangeData = 15000
                var switcherRangeData = 1
                var option = {
                    backgroundColor:'#fff',
                    color: ['gold','aqua','lime'],
                    title:{
                        text:'Topological Graph',
                        subtext:'Demo',
                        x:'center',
                        textStyle:{color:'#1b1b1b'}
                    },
                    tooltip:{
                        trigger:'item',
                        formatter:'{b}'
                    },
                    legend:{
                        orient:'vertical',
                        x:'left',
                        data:[],
                        selectedMode:'single',
                        selected:{},
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
                                    borderColor:'#fff',
                                    borderWidth:0.5,
                                    areaStyle:{
                                        color:'#fff'
                                        }
                                    }
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
                                        borderColor:'black'
                                    },
                                },
                                data:[],
                                },
                            geoCoord:{}
                            },
                    ]
                            };

            var hostSwitcherData = LINK_DATA
            tempMacList = []
            //添加全局流中的src_mac和dst_mac到链接信息中，以防找不到
            for (var i = 0; i< hostSwitcherData.length; i++){
                tempMacList.push(hostSwitcherData[i].mac)
            }
            for(var i=0; i<result.length; i++){
                if (!(result[i].src_mac in tempMacList)){
                    console.log(result[i].links)
                    hostSwitcherData.push({"mac":[result[i].src_mac],"attachmentPoint":[{"switchDPID":result[i].links[0][0]}]})}
                if (!(result[i].dst_mac in tempMacList)){
                    hostSwitcherData.push({"mac":[result[i].dst_mac],"attachmentPoint":[{"switchDPID":result[i].links[result[i].links.length-1][0]}]})}
            }
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
            // 添加全局流中的交换机信息到拓扑图中
            for(var i=0; i<result.length; i++){
                var flow=result[i]
                var fp=flow.links
                for (var k =0; k<fp.length; k++){
                    switchNode.push(fp[k][0])//解决小括号里两个值的问题
                }
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


        /**
            var globalData = GLOBAL_DATA
            var pointData2 = []
            var lineData2 = [] 
            for (x in globalData['result'])         
            {
            pointData2.push({name:globalData['result'][x]['matchlist'][0]["dataLayerSource"],value:5})
            for (var p = 0;p<globalData['result'][x]['pathlink'].length;p++)
            {
            pointData2.push({name:globalData['result'][x]['pathlink'][p]["nodeId"],value:5})
            }
            pointData2.push({name:globalData['result'][x]['matchlist'][0]["dataLayerDestination"],value:5})
            }
            for (var n = 0;n<pointData2.length-1;n++) 
            {
            lineData2.push([{name:pointData2[n]["name"],value:5},{name:pointData2[n+1]["name"]}])
            }
        **/
            
            option.series[0].geoCoord = geoCoord1
            option.series[0].markPoint.data = pointData
            option.series[0].markLine.data = lineData
            option.legend['data'] = legendData
            var selected = {}
            for (var p=0; p<legendData.length; p++){
                selected[legendData[p]] = false
            }
            option.legend['slected'] = selected
            for (var p=0; p<seriesDataList.length; p++){
                option.series.push(seriesDataList[p])
            }
            myChart.setOption(option);
            }
            )
        },
        failure: function(errMsg) {
            alert("ajax error: ");
            }
        }); 
    }
    return false;
}
$(document).ready(function(){
    $("#query_btn").click(function(){
        submitQuery($("#query_form"));
    });
})

//echarts related

function unique(arr){
    var result1 = [], isRepeated;
    for (var i = 0 ;i<arr.length;i++){
	isRepeated = false;
	for (var j=0;j<result1.length;j++){
	    if (arr[i] == result1[j]){
		isRepeated = true;
		break;
	    }
	}
	if (!isRepeated){
	    result1.push(arr[i]);
    }
    }
    return result1;
}

