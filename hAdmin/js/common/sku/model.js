function showAlert(str1) {
	var model = $('<div class="alertModel"></div>')
	var _ul = $('<ul></ul>');
	var _li1 = $('<li class="modelbd">' + str1 + '</li>');
	var _li2 = $('<li class="modelft">确定</li>');

	model.height($(window).height())
	_ul.append(_li1);
	_ul.append(_li2);
	model.append(_ul);
	$("body").append(model);

	_li2.on("click", function() {
		model.remove();
	})
}

function showConfim(str, fun1) {
	var model = $('<div class="confimModel"></div>')
	var _ul = $('<ul></ul>');
	var _li1 = $('<li class="modelbd">' + str + '</li>');
	var _li2 = $('<li class="modelft"></li>');

	var modelYes = $('<div class="modelYes">确定</div>');
	var modelNo = $('<div class="modelNo">取消</div>');

	_li2.append(modelYes);
	_li2.append(modelNo)

	model.height($(window).height())
	_ul.append(_li1);
	_ul.append(_li2);
	model.append(_ul);
	$("body").append(model);

	modelYes.on("click", function() {
		if(fun1()) {
			model.remove();
		}

	})
	modelNo.on("click", function() {
		model.remove();
	})
}