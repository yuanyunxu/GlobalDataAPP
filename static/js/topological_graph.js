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
                                    data:['da:2b:ae:ac:6d:04 -> 9a:c6:60:d9:2f:59'],
                                    selectedMode:'single', 
                                    selected:{
                                    'da:2b:ae:ac:6d:04 -> 9a:c6:60:d9:2f:59':false,
                                    },
                                },
				dataRange:{
					min:0,
					max:10,
					calculable:true,
					color:['#ff3333','orange','yellow','lime','aqua'],
					textStyle:{color:'#fff'}
					},
				series:[
				    {
						name:'World',
						type:'map',
						roam:true,
						hoverable:true,
						mapType:'world',
						itemSytle:{
							normal:{
								borderColor:'rgba(100,149,237,1)',
								borderWidth:0.5,
								areaStyle:{
									color:'#1b1b1b'
									}
								},
                                                        emphasis:{
                                                            borderColor:'#1b1b1b',
                                                            borderWidth:0.5,
                                                            areaStyle:{
                                                                color:'#1b1b1b'
                                                            }
                                                        }
							},
						data:[],
						markPoint:{
							symbol: 'emptyCircle',
							symbolSize: 10,
							effect: {
								show:true,
								shadowBlur:0,
								scaleSize:2
								},
							itemStyle:{
								normal:{label:{show:false}},
								emphasis:{label:{position:'top'}}
								},
							data:[],
							},
						markLine:{
							smooth:true,
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
                                                {
                                        name:'da:2b:ae:ac:6d:04 -> 9a:c6:60:d9:2f:59',
                                        type:'map', 
                                        mapType:'world',
                                        data:[],
                                        markLine:{
                                            smooth:true,
                                            effect:{
                                                show:true,
                                                scaleSize:2,
                                                period:30,
                                                color:'red',
                                                shadowBlur:10
                                            },
                                            itemStyle:{
                                                normal:{
                                                    borderWidth:1,
                                                    lineStyle:{
                                                        type:'solid',
                                                        shadowBlur:10
                                                    }
                                                }
                                            },
                                        data:[]
                                        },
                                        markPoint:{
                                            symbol:'emptyCircle',
					    symbolSize : function (v){
                    return 10 + v/10
                },
                effect : {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle:{
                    normal:{
                        label:{show:false}
                    },
                    emphasis: {
                        label:{position:'top'}
                    }
                },
                data:[]
                                        }
                                        }
				]
						};
		var hostSwitcherData = [
    {
        "entityClass": "DefaultEntityClass",
        "mac": [
            "9a:c6:60:d9:2f:59"
        ],
        "ipv4": [
            "10.0.0.1"
        ],
        "vlan": [],
        "attachmentPoint": [
            {
                "switchDPID": "00:00:00:00:00:00:00:03",
                "port": 3,
                "errorStatus": null
            }
        ],
        "lastSeen": 1436604849504
    },
    {
        "entityClass": "DefaultEntityClass",
        "mac": [
            "da:2b:ae:ac:6d:04"
        ],
        "ipv4": [
            "10.0.0.2"
        ],
        "vlan": [],
        "attachmentPoint": [
            {
                "switchDPID": "00:00:00:00:00:00:00:04",
                "port": 2,
                "errorStatus": null
            }
        ],
        "lastSeen": 1436604849496
    }
] 
		var pointData = []
		var lineData = []
		var geoCoord1 = {}
                var topoData = [{"src-switch":"00:00:00:00:00:00:00:02","src-port":2,"dst-switch":"00:00:00:00:00:00:00:04","dst-port":1,"type":"internal","direction":"bidirectional"},{"src-switch":"00:00:00:00:00:00:00:03","src-port":2,"dst-switch":"00:00:00:00:00:00:00:05","dst-port":2,"type":"internal","direction":"bidirectional"},{"src-switch":"00:00:00:00:00:00:00:02","src-port":3,"dst-switch":"00:00:00:00:00:00:00:05","dst-port":1,"type":"internal","direction":"bidirectional"},{"src-switch":"00:00:00:00:00:00:00:01","src-port":2,"dst-switch":"00:00:00:00:00:00:00:03","dst-port":1,"type":"internal","direction":"bidirectional"},{"src-switch":"00:00:00:00:00:00:00:01","src-port":1,"dst-switch":"00:00:00:00:00:00:00:02","dst-port":1,"type":"internal","direction":"bidirectional"}]
                var switchNode=[]
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
		for (var json=0;json<topoData.length;json++)
		{
                    var srcSwitch = topoData[json]["src-switch"]
                    var dstSwitch = topoData[json]["dst-switch"]
                    switchNode.push(srcSwitch)
                    switchNode.push(dstSwitch) 
			}
                var switchNodeSet = unique(switchNode)
		var i = 0
		var k = 0
                for (var q = 0,x=parseInt(switchNodeSet.length/2);q<x;q++){
                    pointData[i] = {'name':switchNodeSet[q],value:1}
                    geoCoord1[switchNodeSet[q]] = [ (180*q/x-180).toFixed(2),(-(90*q/x)).toFixed(2)]
                }
                for (var q = parseInt(switchNodeSet.length/2),x = switchNodeSet.length;q<x;q++){
                    pointData[i] = {'name':switchNodeSet[q],value:1}
                    geoCoord1[switchNodeSet[q]] = [ (-(180*q/x-180)).toFixed(2),(90*q/x).toFixed(2)]
                }
                for (var json=0;json<topoData.length;json++)
                {
                    var srcSwitch = topoData[json]['src-switch']
                    var dstSwitch = topoData[json]['dst-switch'] 
                    lineData[k] = [{name:srcSwitch,value:10,effect:{show:false}},{name:dstSwitch,symbol:'circle'}]
                    k = k + 1
                }
		for (var json=0;json<hostSwitcherData.length;json++)
		{
			if (hostSwitcherData[json]["mac"])
			{
				for (var j = 0;j<hostSwitcherData[json]["mac"].length;j++)
				{
                        pointData[i] = {'name':hostSwitcherData[json]["mac"][j],value:10}
			geoCoord1[hostSwitcherData[json]["mac"][j]] = [parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]["switchDPID"]][0])+parseFloat((10*Math.random()).toFixed(2)),parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]['switchDPID']][1])+parseFloat((10*Math.random()).toFixed(2))]
			i = i + 1
				}
			}
			if (hostSwitcherData[json]["attachmentPoint"])
			{
				for (var j=0;j<hostSwitcherData[json]["attachmentPoint"].length;j++)
				{
					lineData[k] = [{name:hostSwitcherData[json]["mac"][0],smoothness:0,effect:{show:false},value:10},{name:hostSwitcherData[json]["attachmentPoint"][j]["switchDPID"],symbol:'circle'}]
					k = k + 1
					}
				}
			}


                var globalData = {
    "status": "ok",
    "result": {
        "83e9b80891341b517f0c5355fffa2fb6": {
            "matchlist": [
                {
                    "id": "91fc742a6e595a18a8d60bfe3c4431c5",
                    "wildcards": 3678448,
                    "inputPort": -2,
                    "dataLayerSource": "da:2b:ae:ac:6d:04",
                    "dataLayerDestination": "9a:c6:60:d9:2f:59",
                    "dataLayerVirtualLan": -1,
                    "dataLayerVirtualLanPriorityCodePoint": 0,
                    "dataLayerType": "0x0800",
                    "networkTypeOfService": "0",
                    "networkProtocol": 1,
                    "networkSource": "10.0.0.2",
                    "networkDestination": "10.0.0.1",
                    "networkSourceInt": -1,
                    "networkDestinationInt": -1,
                    "transportSource": 0,
                    "transportDestination": 0,
                    "networkDestinationMaskLen": 32,
                    "networkSourceMaskLen": 32,
                    "queryPage": 1,
                    "querySize": 5,
                    "match": "e0:db:55:1f:99:b4;c8:1f:66:f3:c5:43;0.0.0.0;0.0.0.0;0;0;0;-1;-1;0;0;0;0;3678448",
                    "redirect": true
                }
            ],
            "pathlink": [
                {
                    "nodeId": "00:00:00:00:00:00:00:04",
                    "portId": 1
                },
                {
                    "nodeId": "00:00:00:00:00:00:00:02",
                    "portId": 3
                },
                {
                    "nodeId": "00:00:00:00:00:00:00:05",
                    "portId": 2
                },
                {
                    "nodeId": "00:00:00:00:00:00:00:03",
                    "portId": null
                }
            ],
            "packetCount": 113,
            "byteCount": 11074
        }
    }
}
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
                
		option.series[0].geoCoord = geoCoord1
		option.series[0].markPoint.data = pointData
		option.series[0].markLine.data = lineData
                option.series[1].markPoint.data = pointData2
                option.series[1].markLine.data = lineData2
		myChart.setOption(option);
		}
		)