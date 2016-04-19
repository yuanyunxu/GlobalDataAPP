data = OS_TOPOLOGY
seriesDataList = [] //This var is used to replace the data in Echarts options.Now only the markLine.data and markPointData work
result = data.result
seriesData = {}
    seriesData['data'] = []
    seriesData['markLine'] = {}
    seriesData['markLine']['data'] = []
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
    seriesData['markPoint'] = {}
    seriesData['markPoint']['symbol'] = 'emptyCircle'
    seriesData['markPoint']['symbolSize'] = 10
    seriesData['markPoint']['effect'] = {}
    seriesData['markPoint']['effect']['show'] = true
    seriesData['markPoint']['effect']['shadowBlur'] = 0
    seriesData['markPoint']['itemStyle'] = {}
    seriesData['markPoint']['itemStyle']['normal'] = {'label':{'show':false}}
    seriesData['markPoint']['itemStyle']['emphasis'] = {'label':{'position':'top'}}
pointData = [] // Store all the point data and config
var geoCoord1 = {} //Stor all the points' geo
var pointCount = 0
var lineCount = 0
//locate the routers
routerNum = result["routers"].length
for (var q = 0,x=routerNum;q<x;q++){
    var addConst = 2*x/50
    var topoRouterName = "router:" + result["routers"][q]["name"]
    pointData[pointCount] = {'name':topoRouterName,value:100,symbolSize: 30}
    var xis = (180 - (q+1)*360/(x+1)).toFixed(2)
    var yis = 0
    geoCoord1[topoRouterName] = [ xis, yis ]
    pointCount += 1
}
//locate networks,subnets,vms
for(var i=0; i<result["routers"].length; i++){
    var routeName = "router:" + result["routers"][i]["name"]
    network = result["routers"][i].networks
    for (var k = 0; k<network.length; k++){
        networkName ="network:" + network[k]["name"]
        seriesData['markLine']['data'].push([{'name':routeName,'value':0},{'name':networkName}])
        pointData[pointCount] = ({'name':networkName,'value':50,symbolSize: 20})
        pointCount += 1
        geoCoord1[networkName] = [parseFloat(geoCoord1[routeName][0])+parseFloat((360/(routerNum + 1)*Math.random()-180/(routerNum+1)).toFixed(2)),parseFloat(geoCoord1[routeName][1])+parseFloat((180*Math.random()-90).toFixed(2))]
        subnet = network[k].subnets
        for (var j = 0; j < subnet.length; j++){
            subnetName = 'subnet:' + subnet[j]["name"]
            seriesData['markLine']['data'].push([{'name':networkName,'value':10},{'name':subnetName}])
            pointData[pointCount] = {'name':subnetName,'value':30,symbolSize: 10}
            pointCount += 1
            geoCoord1[subnetName] = [parseFloat(geoCoord1[networkName][0])+parseFloat((180/(routerNum + 1)*Math.random()-90/(routerNum)).toFixed(2)),parseFloat(geoCoord1[networkName][1])+parseFloat((90*Math.random()-45).toFixed(2))]
            vm = subnet[j].virtual_machines
            for (var n = 0; n < vm.length; n++){
                vmName = "vm:" + vm[n]["name"]
                seriesData['markLine']['data'].push([{'name':"subnet:" + subnet[j]["name"],'value':20},{'name':vmName}])
                pointData[pointCount] = {'name':vmName,'value':10,symbolSize: 5}
                pointCount += 1
                geoCoord1[vmName] = [parseFloat(geoCoord1[subnetName][0])+parseFloat((90/(routerNum + 1)*Math.random()-45/(routerNum)).toFixed(2)),parseFloat(geoCoord1[subnetName][1])+parseFloat((45*Math.random()-22.5).toFixed(2))]
            }
        }
    }
}
seriesData['markPoint']['data'] = pointData
seriesDataList.push(seriesData)

//echarts related
require.config(
    {
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
        var dataRangeMax = 100
        var macRangeData = 0
        var switcherRangeData = 1
        var option = {
            backgroundColor:'#fff',
            color: ['gold','aqua','lime'],
            title:{
                text:'OpenStack Topology',
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
                                borderColor:'black'
                            },
                        },
                        data:[],
                        },
                    geoCoord:{}
                    },
            ]
        };
// Insert the data requied into the Echarts option
        option.series[0].markLine.data = seriesDataList[0].markLine.data
        option.series[0].markPoint.data = seriesDataList[0].markPoint.data
        option.series[0].geoCoord = geoCoord1
        myChart.setOption(option);
    }
)
