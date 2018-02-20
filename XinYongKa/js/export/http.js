/**
 * 扩展一个http模块
 * @authors tao-cht
 * @date    2017-12-12 10:57:24
 * @version $Id$
 */
layui.define('tips', function(exports){
	var tips = layui.tips, $ = layui.$,
	http = {
		get: function(url, success, complete){
			this.request({url: url, type: 'get', success: success, complete: complete});
		},
		post: function(url, param, success, complete){
			this.request({url: url, type: 'post', data: param, success: success, complete: complete});
		},
		request: function(param){
			param.data && console.log('请求参数：', param.data);
			$.ajax({
				url: param.url,
				type: param.type,
				data: param.data,
				success: function(resp){
					if(resp.code == 0){
						typeof param.success === "function" && param.success(resp);
					}else{
						console.log(resp);
						tips.msg(resp.msg);
					}
					typeof param.complete === "function" && param.complete(resp);
				},
				error: function(){
					tips.msg('系统错误，请重试！');
					typeof param.complete === "function" && param.complete();
				}
			})
		}
	};
  	exports('http', http);
});