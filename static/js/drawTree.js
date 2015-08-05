function drawTree(root){
    var nl=preTraverse(root);
    var output="";
    var line="";
    var i=0;
    var lastNodeLayer=0;
    for(var i=0;i<nl.length;i++){
        if(i!=0 && nl[i][1]<=lastNodeLayer){
            output+=line+"<br/>";
            line="";
            for(var x=0;x<nl[i][1]-1;x++)
                line+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            line+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|";
        }
        line+=nl[i][0];
        lastNodeLayer=nl[i][1];
    }
    output+=line+"<br/>";
    return output;
}
function preTraverse(root){
    var output=[];
    if(!root)return output;
    var depth=0;
    function recrTrvFunc(root,dp){
        var rootInfo=root.prevNodeOutport+"--"
            +(root.inport==null?"d":root.inport)
            +"[*"+(root.dpid==null?"end":("<a href='http://sc.research.intra.nsfocus.com:8888/sc/knowledgebase/network/switch/"+root.dpid+"' title='"+root.dpid+"'>"+root.dpid.substr(17,6)+"</a>"))+"]";
        output.push([rootInfo,dp]);
        if(root.nextNodes==null || root.nextNodes.length===0)return;
        for(var i=0;i<root.nextNodes.length;i++){
            recrTrvFunc(root.nextNodes[i],dp+1);
        }
    }
    recrTrvFunc(root,0);
    return output;
}
