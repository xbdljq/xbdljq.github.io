/**
 * 扩展一个form校验模块
 * @authors tao-cht
 * @date    2017-12-12 10:57:24
 * @version $Id$
 */
layui.define('form', function(exports){
 	var form = layui.form,
 	verify = {
 		require: function(value, item){
 			if(value == '' || !/\S/.test(value)) return getMsg('require', item, '必填项不能为空')
 		},
 		must: function(value, item){
 			if(value == '' || /(^\s|\s$)/.test(value)) return getMsg('must', item, '必填项不能为空，且首尾不能有空格')
 		},
 		empty: function(value, item){
			if(/(^\s|\s$)/.test(value)) return getMsg('empty', item, '该项首尾不能有空格')
 		},
 		num: function(value, item){
 			if(!/^(\-)?\d+(\.\d+)?$/.test(value)) return getMsg('num', item, '只能填写数字，且不能出现空格')
 		},
 		int: function(value, item){
 			if(!/^\d+$/.test(value)) return getMsg('int', item, '只能填写非负整数')
 		},
 		pInt: function(value, item){
 			if(!/^[0-9]*[1-9][0-9]*$/.test(value)) return getMsg('pInt', item, '只能填写大于0的整数')
 		},
 		float: function(value, item){
 			// /^[1-9]([0-9]{1,4})(\.[0-9]{1,2})?$/
 			if(!/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) return getMsg('float', item, '最多只能2位小数')
 		},
 		percent: function(value, item){
 			if(value && !/^100$|^[0-9]{1,2}$/.test(value)) return getMsg('percent', item, '只能填写0-100之间的整数')
 		}
 	}
 	function getMsg(key, elem, initial){
 		var msg = elem.getAttribute('lay-verTips')
 		var msgObj = msg ? JSON.parse(msg) : {}
 		msgObj[key] && (initial = msgObj[key])
 		return initial
 	}
 	form.verify(verify);
 	exports('verify', verify);
});