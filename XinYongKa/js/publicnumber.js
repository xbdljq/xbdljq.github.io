layui.use(['element', 'form', 'dialog', 'http'], function(){
	var $ = layui.$, element = layui.element, form = layui.form, dialog = layui.dialog, tips = layui.tips, http = layui.http, menus = [], selectTab = getQueryString('id'), selectedMenu,
	urls = [{Name: '商城首页', Content: '/Home/Index?cid=1'}, {Name: '购物车', Content: '/ShopCarWeb/MyShopCar?cid=1'}]

	// 获取菜单
	http.get('/Admin/AdminSetting/GetMenuWeixinList', function(resp){
		menus = resp.data
        menus.length > 0 ? initMenu() : $('#tabContent').hide()
	})
	
	// 初始化菜单、tabs
	function initMenu(){
		menus.length == 3 && $('#addTab').hide()
		// 第一次进来，默认选中第一个
		!selectTab && (selectTab = menus[0].Id)

		var n_menu = [], t_menu = []
		$.each(menus, function(i, v){
			this.Id == selectTab && (selectedMenu = this)
			var temp_menu = $('<div>').addClass('item-menu')
			$.each(this.NextList, function(){
				temp_menu.append($('<a>').addClass('item-item').html(this.Name))
			})
			n_menu.push($('<li>').addClass('box-item').append($('<a>').html(this.Name)).append(temp_menu))
			t_menu.push($('<li>').addClass('tab-item '+ (this.Id == selectTab ? 'active' : '')).data('node', this)
				.append('<i class="to-left">◀</i>').append($('<span>').addClass('to-center').html(this.Name))
				.append('<i class="to-right">▶</i><i class="layui-icon to-close">&#x1006;</i>'))
		})
		// 预览图菜单
		$('#menuBox').append(n_menu)
		// tab菜单
		$('#addTab').before(t_menu)

		//初始二级菜单
		initTwoMenu()
	}
	
	//初始二级菜单
	function initTwoMenu(){
		var two_menu = []
		$('#oneMenu').html(selectedMenu.Name)
		$.each(selectedMenu.NextList, function(){
			two_menu.push($('<div>').addClass('item').append($('<div>').addClass('label').html(this.Name))
				.append($('<div>').addClass('btns').data('id', this.Id).append('<span name="edit">编辑</span>&nbsp;|&nbsp;<span name="delete">删除</span>')))
		})
		$('#addTwoMenu').prevAll().remove()
		$('#addTwoMenu').before(two_menu)
	}

	// 监听tab
	$('#menuTabs').on('click', function(e){
		if($(e.target).hasClass('add')){
			// 添加
			dialog.open('tpl_operpage', {Name: '', Content: '', urls: urls}, '添加一级菜单', 600, 280)
			form.render('select')
		}else if($(e.target).hasClass('to-left')){
			//左移
            var id = $(e.target).parent().data('node').Id
			if(id === menus[0].Id){
            	tips.msg('不能再左移了')
            	return false
			}
            e.target.disabled = true
			http.post('/Admin/AdminSetting/LeftMoveMenu', {id: id}, function(resp){
                window.top.layui.tips.msg(resp.msg)
				reload()
			})
		}else if($(e.target).hasClass('to-center')){
			//选中
			$(this).find('.active').removeClass('active')
			selectedMenu = $(e.target).parent().addClass('active').data('node')
			selectTab = selectedMenu.Id
			initTwoMenu()
		}else if($(e.target).hasClass('to-right')){
			//右移
            var id = $(e.target).parent().data('node').Id
            if(id === menus[menus.length - 1].Id){
                tips.msg('不能再右移了')
                return false
            }
            e.target.disabled = true
			http.post('/Admin/AdminSetting/RightMoveMenu', {id: id}, function(resp){
                window.top.layui.tips.msg(resp.msg)
				reload()
			})
		}else if($(e.target).hasClass('to-close')){
			//删除
			tips.confirm('确定要删除菜单吗？', function(ok){
				if(ok){
					$(e.target).parent().hasClass('active') && (selectTab = '')
					http.post('/Admin/AdminSetting/DeleteMenu', {id: $(e.target).parent().data('node').Id}, function(resp){
                        window.top.layui.tips.msg(resp.msg)
      					reload()
      				})
				}
			})
		}
	})

	// 一级菜单编辑事件
	$('#editMenu').on('click', function(){
		http.get('/Admin/AdminSetting/GetMenuDetail?id='+ selectTab, function(resp){
			resp.data.urls = urls
			dialog.open('tpl_operpage', resp.data, '修改一级菜单', 600, 280)
			form.render('select')
		})
	})

	// 二级菜单事件
	$('#twoMenu').on('click', function(e){
		var name = $(e.target).attr('name')
		if(name === 'add'){
			dialog.open('tpl_operpage', {ParentMenuId: selectedMenu.Id, Name: '', Content: '', urls: urls}, '添加二级菜单', 600, 280)
			form.render('select')
		}else if(name === 'edit'){
			http.get('/Admin/AdminSetting/GetMenuDetail?id='+ $(e.target).parent().data('id'), function(resp){
				resp.data.urls = urls
				dialog.open('tpl_operpage', resp.data, '修改二级菜单', 600, 280)
				form.render('select')
			})
		}else if(name === 'delete'){
			tips.confirm('确定要删除菜单吗？', function(ok){
				if(ok){
					http.post('/Admin/AdminSetting/DeleteMenu', {id: $(e.target).parent().data('id')}, function(resp){
      					window.top.layui.tips.msg(resp.msg)
      					reload()
      				})
				}
			})
		}
	})

	// 链接选择事件
	form.on('select(url)', function(data){
  		$('#oper_url').val(data.value)
	})
	// 提交添加、修改数据
	form.on('submit(form_oper)', function(data){
		data.elem.disabled = true
	  	http.post('/Admin/AdminSetting/EditMenu', data.field, function(resp){
	  		dialog.close('tpl_operpage')
	  		window.top.layui.tips.msg(resp.msg)
	  		reload()
	  	}, function(){
	  		data.elem.disabled = false
	  	})
	  	return false
	})

	function reload(){
		var url = location.href
        location.search && (url = url.replace(location.search, ''))
		location.href = url + '?id=' + selectTab
	}

	// 保存到微信
	$('#saveWeixinMenu').on('click', function(e){
        e.target.disabled = true
        http.post('/Admin/AdminSetting/SaveMenuToWeixin', null, function(resp){
            tips.msg(resp.msg)
        }, function(){
            e.target.disabled = false
        })
        return false
	})
});