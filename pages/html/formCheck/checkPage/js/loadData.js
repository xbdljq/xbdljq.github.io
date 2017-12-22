/**
 * 根据传过来的data以及url等参数获取list数据
 */
function sg_getList(url, data,returnfun) {
	var d = {
		dataJson : JSON.stringify(data)
	};
	$.ajax({
		type : "POST",
		url : url,
		dataType : 'json',
		data : d,
		timeout : 50000,
		cache : false,
		error : function(XMLHttpRequest, status, thrownError) {
		},
		success : function(msg) {
			returnfun(msg);
		}
	});
}

function getPageTemple(isCurrent, page, text) {
	text = text || page;
	return '<a style="' + (isCurrent ? "background-color: #809C01;" : "")
			+ '" href="javascript:void(0);" onclick="$.loadList({page:' + page
			+ '});" pagebegin="">' + text + '</a>';
}

function genPageing(data, parameters) {
	if (data.total <= parameters.pageSize) {
		$("#pageing")
				.html(
						'<a style="background-color: #809C01;" href="javascript:void(0)">1</a><a href="javascript:void(0)">共1页</a><input type="hidden" id="pagebegin" value="1"/>');
		return false;
	}
	var totlePage = Math.ceil(data.total / parameters.pageSize);
	var current = parameters.page;
	current = Number(current);
	var startPage = Math.max((current - 2), 1);
	var endPage = Math.min((current + 2), totlePage);
	var c = "";
	for (var i = startPage; i <= endPage; i++) {
		c += getPageTemple((current == i), i);
	}
	if (startPage > 1) {
		c = getPageTemple(false, 1) + c;
	}
	if (current != 1) {
		c = getPageTemple(false, current - 1, "上一页") + c;
	}
	if (endPage < totlePage) {
		c += getPageTemple(false, totlePage);
	}
	if (current != totlePage) {
		c += getPageTemple(false, current + 1, "下一页");
	}
	c += '<input class="pagearticles" type="text" style="float: left;height:26px;" name="pagebegin" value="1"><a href="javascript:void(0)" id="pagearticles" maxpage="'
			+ totlePage
			+ '">跳转</a><input type="hidden" id="pagebegin" value="'
			+ current + '"/>';
	$("#pageing").html(c);
}
