/**
 * 扩展一个dialog模块
 * @authors tao-cht
 * @date    2017-12-12 10:57:24
 * @version $Id$
 */
layui.define(['laytpl', 'jquery'], function(exports){
	var laytpl = layui.laytpl, $ = layui.$, dialogBg, dialogBoxs = {}, offsetX = window.top == window ? 0 : 100, offsetY = window.top == window ? 30 : 50,
	dialog = {
		open: function(_templateId, _templateData, _title, _width, _height){
			dialogBg = document.getElementById('dialog-bg');
			if(!dialogBg){
				// 背景
				dialogBg = $('<div id="dialog-bg" class="dialog-bg"></div>');
				$('body').append(dialogBg)
			}
			this.open = function(_templateId, _templateData, _title, _width, _height){
				var getTpl = $('#' + _templateId).html();
				laytpl(getTpl).render(_templateData, function(html){
					var box = $('<div id="dialog-box" class="dialog-box"></div>');
					var boxStyle = {};
					if(_width){
						boxStyle['width'] = _width + 'px';
						boxStyle['margin-left'] = '-' + (_width/2 + offsetX) + 'px';
					}
					if(_height){
						boxStyle['height'] = _height + 'px';
						boxStyle['margin-top'] = '-' + (_height/2 + offsetY) + 'px';
					}
					boxStyle && box.css(boxStyle);
					box.append($('<div class="dialog-header"></div>').append('<div class="dialog-title">'+ _title +'</div>')
						.append($('<i class="layui-icon dialog-close">&#x1006;</i>').on('click', function(){
							dialog.close(_templateId);
						}))).append($('<div class="dialog-content" '+ (_height ? 'style="height: '+ (_height - 49) +'px"' : '') +'></div>').append(html))

					$('body').append(box);
					dialogBg.css('display', 'block');
					dialogBoxs[_templateId] = box;
				});	
			};
			this.open.apply(this, arguments);
		},
		close: function(_templateId){
			dialogBoxs[_templateId].html('').remove();
			delete dialogBoxs[_templateId];
			$.isEmptyObject(dialogBoxs) && dialogBg.css('display', 'none');
		}
	}
  	exports('dialog', dialog);
});