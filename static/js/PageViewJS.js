function ShowPage(obj) {
    _PageEvents = obj.PageEvents;

    var strResult = "";
    var size = Math.floor(obj.PageShowSize / 2);
    var maxSize = obj.CurrentPage + size > obj.MaxPageSize ? obj.MaxPageSize : obj.CurrentPage + size;
    var minSize = obj.CurrentPage - size < 1 ? 1 : obj.CurrentPage - size;

    if (maxSize == obj.MaxPageSize)
        minSize = maxSize - obj.PageShowSize + 1;
    if (minSize == 1)
        maxSize = minSize + obj.PageShowSize - 1;

    for (var i = 0; i < obj.MaxPageSize; i++) {

        var curPage = i + 1;

        if (curPage == 1 || (curPage >= minSize && curPage <= maxSize) || curPage == obj.MaxPageSize) {
            var strPage = "";
            if (curPage == minSize && (obj.CurrentPage > obj.PageShowSize || minSize > 2))
                strPage += "...&nbsp;";
            if (obj.CurrentPage == curPage)
                strPage += "<a><b>" + curPage + "</b></a>";
            else
                strPage += "<a href=\"javascript:void(0);\" onclick=\"_PageEvents(" + curPage + ");\">" + curPage + "</a>";
            if (curPage == maxSize && obj.MaxPageSize - obj.CurrentPage - 1 > size)
                strPage += "&nbsp;...";

            if (strResult != "")
                strResult += "&nbsp;";

            strResult += strPage;
        }
    }

    if (obj.IsUpDown) {
        if (obj.CurrentPage == 1)
            strResult = "<a>上一页</a>&nbsp" + strResult;
        else
            strResult = "<a href=\"javascript:void(0);\" onclick=\"_PageEvents(" + (obj.CurrentPage - 1) + ");\">上一页</a>&nbsp" + strResult;
        if (obj.CurrentPage == obj.MaxPageSize)
            strResult = strResult + "&nbsp<a>下一页</a>";
        else
            strResult = strResult + "&nbsp<a href=\"javascript:void(0);\" onclick=\"_PageEvents(" + (obj.CurrentPage + 1) + ");\">下一页</a>";
    }

    obj.ShowElement.innerHTML = strResult;
}