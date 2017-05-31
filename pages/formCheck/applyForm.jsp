<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="com.threegms.sdplatform.util.StringUtil"%>
<%@page import="com.threegms.sdplatform.util.site.SiteUtil"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String weid = StringUtil.getReqId(request,"weid");
//String fansId = StringUtil.getReqId(request,"fansId");
String openid = StringUtil.getReqId(request,"openid");
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
    <title>申请页面</title>
    <link rel="stylesheet" type="text/css" href="bank/sg/css/bath.css" />
    <link rel="stylesheet" type="text/css" href="bank/sg/css/applyForm.css" />
    <link href="bank/sg/css/mobiscroll.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="bank/sg/js/jquery-1.9.1.min.js"></script>
    <script src="bank/sg/js/mobiscroll.js" type="text/javascript"></script>
    <script src="bank/sg/js/common.js" type="text/javascript"></script>
	<script src="bank/sg/js/loadData.js" type="text/javascript"></script>
	<script src="bank/sg/js/check.js" type="text/javascript"></script>
    <script src="bank/sg/js/getJson.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script type="text/javascript">   
    // 弹框
    $(function(){
		 //获取列表
		 var d = {
				loanType:0
         };
		sg_getList("${pageContext.request.contextPath}/front/applyLoan/getTypeList", d,function(data){
			if (data.succ) {
				var rows = data.typeList;
				var c = "";
				for ( var i = 0; i < rows.length; i++) {
					c += '<option value="'+rows[i]["typeId"]+'">'+rows[i]["typeName"]+'</option>';
				}
				$("#applyLoanTypeId").html(c);
			}
		});

        $('.confirm_btn').click(function(event) {
        	
			if ($("#bakMsg").prop("checked")==false){
					return false;
			}
			var sex=$('input[name="sex"]:checked').val();
			$('#custSex').val(sex);
			ajaxSg.sg_ajaxClick({url:'${pageContext.request.contextPath}/front/applyLoan/savePersonApply'},function(data){
				if (data.succ) {
					$('.layer').fadeIn(100);        
					$('.layer-bg').fadeTo(100,0)  // 半透明
					$("#main-wrapper").hide();
				}else{
					$("#ishave").text("您有一笔贷款申请正在处理中，请勿重复提交");
					$('.layer').fadeIn(100);        
					$('.layer-bg').fadeTo(100,0)  // 半透明
					$("#main-wrapper").hide();
				}
				setTimeout("wx.closeWindow()", 3000);
			});
        });   
    });  
    </script>
</head>
<body>
<div id="main-wrapper">
    <div class="main_content">
     <!-- 表单    -->
     <form action="">
        <div class="form_text">
         <!-- 每一个表单 -->
            <div class="text-fill">
                <!-- 姓名 -->
				<input  type="hidden" name="weid"  sg_json="*" value="<%=weid %>"/>
			    <input  type="hidden" name="openid"  sg_json="*" value="<%=openid %>"/>
                <div class="item">
                     <span class="left_name">姓名</span>
                     <input  type="text" placeholder="姓名" name="custName"  class="ipt" id="custName" sg_json="*" sg_check="empty|姓名不能为空"/>
                </div>
                <!-- 性别 -->
                <div class="item">
                     <span class="left_name">性别</span>
                     <p class="p1">
                        <input  type="radio"  name="sex" class="rad " value="1" />
                        <label for="">男</label>
                     </p>
                     <p class="p2">
                        <input  type="radio"  name="sex" class="rad " value="0"/>
                        <label for="">女</label>
                     </p>  
                     <input  type="hidden"  name="custSex" sg_json="*" value="0"/>   
                 </div>
                 <!-- 身份证号码 -->
                 <div class="item">
                     <span class="left_name">身份证号</span>
                     <input  type="text" placeholder="身份证号码" name="idCardNo" id="idCardNo" class="ipt" sg_json="*" maxlength="18" sg_check="idno|身份证格式不正确"/>
                 </div>
                 <!-- 贷款类型 -->
                 <div class="item">
                     <span class="left_name">贷款类型</span>
                     <div class="sel_div">
                         <select name="applyLoanTypeId" id="applyLoanTypeId" sg_json="*" sg_check="empty|请选择贷款类型">
							
                         </select>
                     </div>
                 </div>
                 <!-- 贷款金额 -->
                 <div class="item">
                     <span class="left_name">贷款金额</span>
                     <input  type="text" placeholder="贷款金额" name="applyMoney" id="applyMoney" class="ipt" sg_json="*" sg_check="number|贷款金额不正确"/>万元
                 </div>
                  <div class="item">
					<span class="left_name">工作类型</span>
                     <div class="sel_div">
                         <select name="profession" id="profession" sg_json="*" sg_check="empty|请选择工作类型">
                         <option value="企业主">企业主</option>
                         <option value="职员">职员</option>
                         </select>
                     </div>
                     </div>
                <!-- 房产 -->
                <div class="item">
                     <span class="left_name">房产</span>
                     <div class="sel_div">
                         <select name="address" id="address" sg_json="*" sg_check="empty|房产不能为空">
                         <option value="有">有</option>
                         <option value="无">无</option>
                         </select>
                    </div>
                </div>
                <!-- 月收入 -->
                <div class="item">
                     <span class="left_name">月收入</span>
                     <div class="sel_div">
                         <select name="monthIncome" id="monthIncome" sg_json="*" sg_check="empty|月收入不能为空">
                         <option value="">请选择金额</option>
                         <option value="2000元以下">2000元以下</option>
                         <option value="2000-5000元">2000-5000元</option>
                         <option value="5000-8000元">5000-8000元</option>
                         <option value="8000-12000元">8000-12000元</option>
                         <option value="12000元以上">12000元以上</option>
                         </select>
                    </div>
                </div>
                <!-- 手机号 -->
                <div class="item">
                     <span class="left_name">手机号</span>
                     <input type="text" placeholder="手机号" name="phone" id="phone" class="ipt" sg_check="tel|手机号码格式不正确" sg_json="*" maxlength="11" />
                </div>
                
                <div class="item pd">
                    <div class="check_box">
                        <input type="checkbox" id="bakMsg" checked="true"/>
                    </div>
                    <div class="item_right">
                        <p class="txt">本人已阅读并同意<em onclick="javascript:location.href='${pageContext.request.contextPath}/bank/sg/loan/bankMsg.jsp'">《韶关市区农村信用合作联社信贷业务电子征信协议》</em></p>
                
                    </div>  
                 </div>
                 <div class="confirm_btn">提交申请</div>
         </div>  
        </div>
     </form>
    </div>
</div>
  <!-- 模态窗口 -->
        <div class="layer">
            <p id="ishave">申请成功，请等待核查</p>
        </div>
        <div class="layer-bg"></div>   
</body>
</html>