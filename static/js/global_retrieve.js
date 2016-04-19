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
                    console.log(data)
                    var result=data.result.allList;
                    var swInfoUrl="http://sc.research.intra.nsfocus.com:8888/sc/knowledgebase/network/switch/";
                    $("#tbl tbody").empty();
                    for(var i=0; i<result.length; i++){
                        var flow=result[i];
                        var recStr="<tr>";
                        if(flow.matchlist.length===0) continue;
                        var fm=flow.matchlist[0];
                        recStr+="<td>"+fm.dataLayerSource+"</td>"
                        +"<td>"+fm.dataLayerDestination+"</td>"
                        +"<td>"+fm.networkSource+"</td>"
                        +"<td>"+fm.networkDestination+"</td>"
                        +"<td>"+((fm.transportSource)&0x7fff)+"</td>"
                        +"<td>"+((fm.transportDestination)&0x7fff)+"</td>"
                        +"<td>"+protoDict[fm.networkProtocol.toString()]+"</td>"
                        +"<td>"+flow.packetCount+"</td>"
                        +"<td>"+flow.byteCount+"</td>";
                        recStr+="<td>";
                        for(var j=0;j<flow.pathlink.length;j++)
                        {
                            if(flow.pathlink[j]!='end')
                            recStr+="<a href='"+swInfoUrl+flow.pathlink[j].nodeId+"'>*"+(flow.pathlink[j].nodeId.substr(17,6))+"</a> ";
                        }
                        recStr+="</td>";
                        recStr+="</tr>";
                        $("#tbl tbody").append(recStr);
                    }
                    var allCount=data.result.allCount;
                    $("#allCount").text(allCount+"条数");
                    allPage = allCount % pageSize == 0 ? allCount / pageSize : parseInt(allCount / pageSize) + 1;
                                            
                    ShowPage({
                         CurrentPage: curPage,
                         MaxPageSize: allPage,
                         PageShowSize: 3,
                         IsUpDown: true,
                         ShowElement: document.getElementById("divPage"),
                         PageEvents: function (page) {
                            //FindOrgList(page);
                            submitQuery(form,page,pageSize);
                         }
                     });
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
