<%@page import="com.threegms.sdplatform.util.site.SiteUtil"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" %>
<%
String basePath = SiteUtil.getSiteUrl();
%>
<!doctype html>
<html>
<base href="<%=basePath%>">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" /><!-- 删除苹果默认的工具栏和菜单栏 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black" /><!-- 设置苹果工具栏颜色 -->
    <meta name="format-detection" content="telephone=no, email=no" /><!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    <!-- 启用360浏览器的极速模式(webkit) -->
    <meta name="renderer" content="webkit">
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    <!-- 微软的老式浏览器 -->
    <meta name="MobileOptimized" content="320">
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait">
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait">
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no">
    <!-- 适应移动端end --> 
    <title>列表</title>
    <link rel="stylesheet" type="text/css" href="bank/sg/css/bath.css" />
    <link rel="stylesheet" type="text/css" href="bank/sg/css/reviewList.css" />
    <script src="bank/sg/js/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="bank/sg/js/loadData.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function(){                 
            loadList();   //加载列表 
       });
       function getItemHtml(row){
           var temp ='';  
           if(row.logType==0){
       	    if(row.status=="30"){
       	    	temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/loan/sceneVisit.jsp?managerId='+row.managerId+'\'">';
			}else{
				if(row.clientType=="2"){
					temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/loan/companyInformation.jsp?managerId='+row.managerId+'\'">';
				}else{
					temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/loan/informationReade.jsp?managerId='+row.managerId+'\'">';
				}
			}
           	temp+='<span class="title_p">审核</span>';
           }else if(row.logType==1){
           	temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/visit/returnMsg.jsp?managerId='+row.managerId+'&custId='+row.custId+'&type='+row.type+'\'">';
			temp+='<span class="title_p">回访</span>';
           }else if(row.logType==2){
           	temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/visit/returnMsg.jsp?managerId='+row.managerId+'&custId='+row.custId+'&type='+row.type+'\'">';
			temp+='<span class="title_p">生日</span>';
           }else if(row.logType==3){
               	temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/order/myMsg.jsp?status=0&managerId='+row.managerId+'\'">';
				temp+='<span class="title_p">大额</span>';
           }else if(row.logType==4){
           	temp+='<li onclick="javascript:location.href=\'${pageContext.request.contextPath}/bank/sg/grabList.jsp\'">';
				temp+='<span class="title_p">待抢</span>';
           }
           temp+='<i>'+row.message+'</i>';
           temp+='<em class="time">'+row.date+' '+row.time+'</em>';
           temp+='</li>';
           return temp;
      }
      function genItems(data) {
          var c = "";
          for ( var i = 0; i < data.length; i++) {  
              c += getItemHtml(data[i]);
          }
          $("#undo").html(c);
      }
      function loadList() {
         $(".undo_bd").remove();
         var so=$("#soso").val();
         var d = {
        	so:so
         };
      	//获取列表
      	sg_getList("${pageContext.request.contextPath}/front/manager/pengdingList", d,function(data){
      		$("#pcount").text("("+data["pendingList"].length+")");
      		genItems(data.pendingList);
      		
		});
      };
    </script>
    </head>
    <body>
    <!-- 列表 -->
    <div class="box">
        <div class="box_hd main_pd">
            <span>待办事项</span>
            <i id="pcount"></i>
            <select name="soso" id="soso" class="chose_type" onchange="loadList();">
                <option value="">全部</option>
                <option value="0">审核</option>
                <option value="2">生日</option>
                <option value="1">回访</option>
                <option value="3">大额</option>
                <option value="4">待抢</option>
            </select>
        </div>
        <div class="box_bd main_pd" >
        <ul id="undo">
        </ul>
        </div> 
    </div>
    </body>
</html>