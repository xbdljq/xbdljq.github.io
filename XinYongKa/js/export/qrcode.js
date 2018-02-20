/**
 * 扩展一个二维码模块
 * @authors tao-cht
 * @date    2017-12-19 15:53:47
 * @version $Id$
 */
layui.define(['jquery'], function(exports){
	var $ = layui.$,
	qrcode = {
		init: function(elem, width, height, config){
			var codeConfig = {
				current: {
					width: config.width,
					height: config.height,
					left: config.left,
					top: config.top
				},
				scale: config.height / config.width,
				temp: {}
			}
			elem.css({
				left: codeConfig.current.left,
				top: codeConfig.current.top,
				width: codeConfig.current.width,
				height: codeConfig.current.height
			})
			elem.on('mousedown', function(e){
				var tempX = e.clientX, tempY = e.clientY
				if(e.target.tagName == 'SPAN'){
					var spot = e.target.className
					codeConfig.temp.width = codeConfig.current.width
					codeConfig.temp.height = codeConfig.current.height
					codeConfig.temp.left = codeConfig.current.left
					codeConfig.temp.top = codeConfig.current.top
					$(document).on({
						mousemove: function(e){
							// 偏移量取X的值
							var moveX = e.clientX - tempX
							if(spot == 'left-top'){
								if(moveX < 0 && (codeConfig.current.left == 0 || codeConfig.current.top == 0)) return false

								moveY = moveX * codeConfig.scale
								codeConfig.current.left = codeConfig.temp.left + moveX
								codeConfig.current.top = codeConfig.temp.top + moveY

								if(codeConfig.current.left < 0){
									moveX = -1 * codeConfig.temp.left
									moveY = moveX * codeConfig.scale
								}
								if(codeConfig.current.top < 0){
									moveY = -1 * codeConfig.temp.top
									moveX = moveY / codeConfig.scale
								}

								codeConfig.current.left = codeConfig.temp.left + moveX
								codeConfig.current.top = codeConfig.temp.top + moveY
								codeConfig.current.width = codeConfig.temp.width - moveX
								codeConfig.current.height = codeConfig.temp.height - moveY
							}else if(spot == 'right-top'){
								if(moveX > 0 && (codeConfig.current.width + codeConfig.current.left + 2 == width || codeConfig.current.top == 0)) return false

								moveY = -1 * moveX * codeConfig.scale
								codeConfig.current.top = codeConfig.temp.top + moveY

								if(codeConfig.temp.left + 2 + codeConfig.temp.width + moveX > width){
									moveX = width - codeConfig.temp.width - codeConfig.temp.left - 2
									moveY = moveX * codeConfig.scale * -1
								}
								if(codeConfig.current.top < 0){
									moveY = -1 * codeConfig.temp.top
									moveX = moveY / codeConfig.scale * -1
								}

								codeConfig.current.top = codeConfig.temp.top + moveY
								codeConfig.current.width = codeConfig.temp.width + moveX
								codeConfig.current.height = codeConfig.temp.height - moveY
							}else if(spot == 'right-bottom'){
								if(moveX > 0 && (codeConfig.current.width + codeConfig.current.left + 2 == width || codeConfig.current.height + codeConfig.current.top + 2 == height)) return false

								moveY = moveX * codeConfig.scale

								if(codeConfig.temp.left + 2 + codeConfig.temp.width + moveX > width){
									moveX = width - codeConfig.temp.width - codeConfig.temp.left - 2
									moveY = moveX * codeConfig.scale
								}
								if(codeConfig.temp.top + 2 + codeConfig.temp.height + moveY > height){
									moveY = height - codeConfig.temp.height - codeConfig.temp.top - 2
									moveX = moveY / codeConfig.scale
								}

								codeConfig.current.width = codeConfig.temp.width + moveX
								codeConfig.current.height = codeConfig.temp.height + moveY
							}else if(spot == 'left-bottom'){
								if(moveX < 0 && (codeConfig.current.left == 0 || codeConfig.current.height + codeConfig.current.top + 2 == height)) return false

								moveY = moveX * codeConfig.scale * -1
								codeConfig.current.left = codeConfig.temp.left + moveX

								if(codeConfig.current.left <= 0){
									moveX = -1 * codeConfig.temp.left
									moveY = moveX * codeConfig.scale * -1
								}
								if(codeConfig.temp.top + 2 + codeConfig.temp.height + moveY > height){
									moveY = height - codeConfig.temp.height - codeConfig.temp.top - 2
									moveX = moveY / codeConfig.scale * -1
								}
								codeConfig.current.left = codeConfig.temp.left + moveX
								codeConfig.current.width = codeConfig.temp.width - moveX
								codeConfig.current.height = codeConfig.temp.height + moveY
							}
							elem.css({
								left: codeConfig.current.left,
								top: codeConfig.current.top,
								width: codeConfig.current.width,
								height: codeConfig.current.height
							})
						},
						mouseup: function(e){
							$(document).off('mousemove mouseup')
						}
					})
				}else{
					$(document).on({
						mousemove: function(e){
							var moveX = e.clientX - tempX, moveY = e.clientY - tempY
							codeConfig.current.left += moveX
							codeConfig.current.top += moveY

							// 处理边界问题
							if(codeConfig.current.left <= 0)
								codeConfig.current.left = 0
							else if((codeConfig.current.width + 2 + codeConfig.current.left) >= width)
								codeConfig.current.left = width - 2 - codeConfig.current.width

							if(codeConfig.current.top <= 0)
								codeConfig.current.top = 0
							else if((codeConfig.current.height + 2 + codeConfig.current.top) >= height)
								codeConfig.current.top = height - 2 - codeConfig.current.height

							elem.css({
								left: codeConfig.current.left,
								top: codeConfig.current.top
							})
							tempX = e.clientX, tempY = e.clientY
						},
						mouseup: function(e){
							$(document).off('mousemove mouseup')
						}
					})
				}
			})
			return codeConfig
		}
	}
  	exports('qrcode', qrcode);
});