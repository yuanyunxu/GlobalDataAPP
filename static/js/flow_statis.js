//var grUrl="http://192.168.3.141:8888/sc/globalflow/records";
var grUrl="http://sc.research.intra.nsfocus.com:8888/sc/globalflow/records";
function submitQuery(form){
    with(form){
        $.ajax({
            type:"GET",
            url: grUrl,
            data: {
                src_mac: src_mac.value,
                dst_mac: dst_mac.value,
                src_ip: src_ip.value,
                dst_ip: dst_ip.value,
                src_port: src_port.value,
                dst_port: dst_port.value,
                starttime: starttime.value,
                endtime: endtime.value
            },
            dataType: 'json',
            async: false,
            success: function(data){
                if(data.status && data.status=="ok")
                {  
                    var result=data.result;
                    $("#packets").text(result.totalPacketCount);
                    $("#bytes").text(result.totalByteCount);
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
        submitQuery($("#query_form"));
    });
    $("#test_btn").click(function(){
        testFormat($("#query_form"));
    });
});
