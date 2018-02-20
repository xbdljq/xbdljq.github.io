// 自定义模块
layui.config({
    base: '/Areas/Admin/JS/export'
}).extend({
	http: '/http',
	dialog: '/dialog',
	verify: '/verify',
	tips: '/tips',
	qrcode: '/qrcode'
});

// 通用表格刷新
function tb_reload(tb, tb_id, serch_val){
	tb.reload(tb_id, {where: serch_val, page: {curr: 1}});
}
function ins_reload(ins, serch_val){
	ins.reload({where: serch_val, page: {curr: 1}});
}

// 通用上传图片
function uploadImage(up, up_id, up_type, up_success, up_error){ //1:货款 2:办卡 3:轮播图 4: 海报
	up.render({
		elem: '#' + up_id,
		url: '/Admin/FileUpload/UploadImage',
		data: {imgType: up_type},
		accept: 'images',
		done: function(res, index, upload){
			up_success && up_success(res)
		},
		error: function(index, upload){
			up_error && up_error()
		}
	})
}

// 搜索条件时间校验
(function(){
	layui && layui.use(['jquery', 'form'], function($, form){
		$(function(){
            form.verify({
                searchTime: function(value, item){
                    if(value){
                        var start = $(item).prev('[name = "startTime"]').val()
						if(start && value < start) return '结束时间不能小于开始时间'
                    }
                }
            })
		})
	})
}())

// 通用获取editor
function getEditor(id){
	editor = new wangEditor('#' + id)
	editor.customConfig.menus = ['head','bold','italic','underline','strikeThrough','foreColor','backColor','link','justify','quote','image','table','undo','redo']
	editor.customConfig.zIndex = 100
	editor.customConfig.uploadImgMaxLength = 1
	editor.customConfig.uploadImgServer = '/Admin/FileUpload/UploadImage'
	editor.customConfig.uploadImgParams = {imgType: 5}
	editor.customConfig.uploadImgHooks = {
		customInsert: function (insertImg, result, editor) {
        	// 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        	// insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
       	 	// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
       	 	// result 必须是一个 JSON 格式字符串！！！否则报错
        	insertImg(result.data)
    	}
	}
	editor.customConfig.customAlert = function (info) {
		(layui && layui.tips) ? layui.tips.msg(info) : alert(info)
	}
	editor.create()
	return editor
}

// 获取url中参数
function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
	var r = window.location.search.substr(1).match(reg)
	if(r != null)
		return unescape(r[2])
	return null
}