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
                if(data.status && data.status=="ok")
                {   
                    var result=data.result.allList;
                    var legendData = [] 
                    for(var i=0; i<result.length; i++){
                        var flow=result[i];
                        if(flow.matchlist.length===0) continue;
                        var fm=flow.matchlist[0];
                        var legendName = fm.dataLayerSource+'-->'+fm.dataLayerDestination
                        lengendData.push(legendName)
                    }
                }
                else
                {   
                    alert("response error: " + result.status+", msg: "+result.msg);
                } 
            },
            failure: function(errMsg) {
                alert("ajax error: " + result.msg);
            }
        }); 
    }
// 8.6 worked till here!!!!!!!!!!!1
    return false;
}
$(document).ready(function(){
    $("#query_btn").click(function(){
        submitQuery($("#query_form"),curPage,pageSize);
    });
    $("#test_btn").click(function(){
        testFormat($("#query_form"));
    });
});

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
                                                {
                                        name:'da:2b:ae:ac:6d:04 -> 9a:c6:60:d9:2f:59',
                                        type:'map', 
                                        mapType:'world',
                                        data:[],
                                        markLine:{
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
					    symbolSize : 10,
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
                var switchNodeSet = unique(switchNode)

                // draft the point Location
		var i = 0
		var k = 0
                for (var q = 0,x=parseInt(switchNodeSet.length/2);q<x;q++){
                    var addConst = 2*x/50
                    pointData[i] = {'name':switchNodeSet[q],value:1}
                    var xis = (240*(q+addConst)/(x+addConst)-120).toFixed(2)
                    var yis = Math.sqrt((1-xis*xis/(120*120))*30*30).toFixed(2)
                    geoCoord1[switchNodeSet[q]] = [ xis, yis ]
                    console.log(geoCoord1[switchNodeSet[q]])
                    i++
                }
                for (var q = parseInt(switchNodeSet.length/2),x=switchNodeSet.length;q<x;q++){
                    var addConst = 2*x/50
                    pointData[i] = {'name':switchNodeSet[q],value:1}
                    var xis = (240*(q-parseInt(x/2)+addConst)/(x-x/2)-120+addConst).toFixed(2)
                    var yis = (-Math.sqrt((1-xis*xis/(120*120))*30*30)).toFixed(2)
                    geoCoord1[switchNodeSet[q]] = [ xis,yis]
                    console.log(geoCoord1[switchNodeSet[q]])
                    i++
                }

                // draft the swtich link line
                for (var json=0;json<topoData.length;json++)
                {
                    var srcSwitch = topoData[json]['src-switch']
                    var dstSwitch = topoData[json]['dst-switch'] 
                    lineData[k] = [{name:srcSwitch,value:10,effect:{show:false}},{name:dstSwitch,symbol:'circle'}]
                    k = k + 1
                }
		for (var json=0;json<hostSwitcherData.length;json++)
		{
			if (hostSwitcherData[json]["mac"] && hostSwitcherData[json]['attachmentPoint'][0])
			{
				for (var j = 0;j<hostSwitcherData[json]["mac"].length;j++)
				{
                        pointData[i] = {'name':hostSwitcherData[json]["mac"][j],value:10,symbolSize:5}
			geoCoord1[hostSwitcherData[json]["mac"][j]] = [parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]["switchDPID"]][0])+parseFloat((60*Math.random()-30).toFixed(2)),parseFloat(geoCoord1[hostSwitcherData[json]['attachmentPoint'][0]['switchDPID']][1])+parseFloat((60*Math.random()-30).toFixed(2))]
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
                
		option.series[0].geoCoord = geoCoord1
		option.series[0].markPoint.data = pointData
		option.series[0].markLine.data = lineData
                option.series[1].markPoint.data = pointData2
                option.series[1].markLine.data = lineData2
		myChart.setOption(option);
		}
		)
