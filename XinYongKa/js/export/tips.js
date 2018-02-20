/**
 * 扩展一个tips模块
 * @authors tao-cht
 * @date    2017-12-12 10:57:24
 * @version $Id$
 */
layui.define('layer', function(exports){
	var layer = layui.layer,
	tips = {
		msg: function(content){
			layer.msg(content, {time: 1200}); 
		},
		load: function(){
			var index = layer.load(0, {shade:[0.3, '#000']})
			return {close: function(){
				layer.close(index)
			}}
		},
		alert: function(content, icon){
			layer.alert(content, {icon: icon, title: '提示', offset: ['50%', '50%']});
		},
		confirm: function(content, callback){
			layer.confirm(content, {icon: 3, title: '提示', offset: ['50%', '50%']}, function(index){
				callback(true)
				layer.close(index)
			}, function(index){
				callback(false)
			});
		},
		closeAll: function(){
			layer.closeAll()
		}
	}
  	exports('tips', tips);
});