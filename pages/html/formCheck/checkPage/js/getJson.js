/**
 * 搜索页面input并组装成json 传回后台保存
 */
var ajaxSg = {
	/**
	 * 定义的参数
	 */
	options : {
		'method' : 'post',
		'data' : ''
	},
	/**
	 * 赋值
	 * 
	 * @return $this 当前对象
	 */
	setOptions : function($this, option) {
		if ("undefined" == option || null == option) {
			ajaxSg.options = $.extend({}, ajaxSg.options, {
				"url" : $this.attr("jx-href"),
				"method" : $this.attr("jx-method")
			});
		} else {
			ajaxSg.options = $.extend({}, ajaxSg.options, option);
		}
		return $this;
	},

	/**
	 * ajax 事件
	 * 
	 */
	sg_ajaxClick : function(option,returnfun) {
		// 获取当前对象
		$this = ajaxSg.setOptions($(this),option);
		// 变为大写
		ajaxSg.options.method = ajaxSg.options.method.toUpperCase();
		/**
		 * 设置参数 v value;t text
		 */
		var _paramsArr = ajaxSg.attr2param();
		if(_paramsArr.lastIndexOf("false")){
			if ("POST" == ajaxSg.options.method) {
				ajaxSg.options.data = _paramsArr;
			}
			var d = {
					dataJson : ajaxSg.options.data
			}; 
			$.ajax({
				type : ajaxSg.options.method,
				url : ajaxSg.options.url,
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
	},

	/**
	 * 属性转换为参数
	 */
	attr2param : function() {
		var _paramsArr ="{";  
		/**
		 * 遍历页面所有input
		 */
		$(":input[sg_json]").each(function(i,input){
			var _check=$(input).attr("sg_check");
			var _json=$(input).attr("sg_json");
　　		    var _name=$(input).attr("name");
　　		    var _str=$(input).val();
　　		    var _result=ajaxSg.check(_check,_str);
			if(_result){
				if(_json ==null){
					return false;
				}else{
					// 如果json为*则取name
					if(_json=="*"){
						_paramsArr += "\""+_name+"\":\""+_str+"\",";      
						// _paramsArr[_name] = ;
					}else{
						_paramsArr += "\""+_json+"\":\""+_str+"\",";      
						// _paramsArr[_json] = _str;
					}
				}
			}
			else{
				_paramsArr=false;
				return false;
			}
		});
		/**
		 * 遍历页面所有select
		 */
		// $("select").each(function(i,_select){
		// var _check=$(_select).attr("sg_check");
		// var _json=$(_select).attr("sg_json");
		// var _name=$(_select).attr("name");
		// var _str=$(_select).val();
		// var _result=ajaxSg.check(_check,_str);
		// if(_result){
		// if(_json ==null){
		// return false;
		// }else{
		// //如果json为*则取name
		// if(_json=="*"){
		// _paramsArr += "\""+_name+"\":\""+_str+"\",";
		// //_paramsArr[_name] = ;
		// }else{
		// _paramsArr +="\""+_json+"\":\""+_str+"\",";
		// //_paramsArr[_json] = _str;
		// }
		// }
		// }else{
		// _paramsArr=false;
		// }
		//			
		// });
	    if (_paramsArr!="false" && _paramsArr.lastIndexOf(",")) {  
	    	_paramsArr = _paramsArr.substring(0,_paramsArr.length -1);  
	    	_paramsArr += "}";  
        }  
		return _paramsArr;
	},
	/**
	 * 值校验
	 */
	check : function(datastr,str) {
		if(datastr==null) {return true;}
		else{
			var res= new Array();
			res=datastr.split("|");
			if(res!=null){
				switch (res[0]) {
					case "empty" :
						if(!isEmp(str)){
							msgBox(res[1],function(){
							});
							return false;
						}
						break;
					case "email" :
						if(!isEmail(str)){
							msgBox(res[1],function(){
							});
							return false;
						}
						break;
					case "number" :
						if(!isNumber(str)){
							msgBox(res[1],function(){
							});
							return false;
						}
						break;
					case "digits" :
						if(!isDigits(str)){
							msgBox(res[1],function(){
							});
							return false;
						}
						break;
					case "tel" :
						if(!isEmp(str)){
							msgBox("手机号码不能为空",function(){
							});
							return false;
						}else{
							if(!isTel(str)){
								msgBox(res[1],function(){
								});
								return false;
							}
						}
						break;
					case "idno" :
						if(!isEmp(str)){
							msgBox("身份证号码不能为空",function(){
							});
							return false;
						}else{
							if(!isIdCardNo(str)){
								msgBox(res[1],function(){
								});
								return false;
							}
						}
						break;
				}
			}
		}
		return true;
	}
};