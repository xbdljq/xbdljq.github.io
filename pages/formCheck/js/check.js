/*******************************************************************************
 * 表单校验工具类
 ******************************************************************************/

/**
 * 检查字符不为空
 * @param {}
 * @return {Boolean} <b>字符为空</b>返回true,否则为false;
 */
function isEmp(str) {
	if(str == "" || str == undefined || str == null) {
		return false;
	}
	return true;
}

/**
 * 匹配Email地址
 */
function isEmail(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
	if(result == null) return false;
	return true;
}

/**
 * 判断数值类型，包括整数和浮点数
 */
function isNumber(str) {
	if(isDouble(str) || isInteger(str)) return true;
	return false;
}

/**
 * 只能输入数字[0-9]
 */
function isDigits(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^\d+$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配money
 */
function isMoney(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^(([1-9]\d*)|(([0-9]{1}|[1-9]+)\.[0-9]{1,2}))$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配phone
 */
function isPhone(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配mobile
 */
function isMobile(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^1[3|4|5|7|8]\d{9}$/);
	if(result == null) return false;
	return true;
}

/**
 * 联系电话(手机/电话皆可)验证
 */
function isTel(text) {
	if(isMobile(text) || isPhone(text)) return true;
	return false;
}

/**
 * 匹配qq
 */
function isQq(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[1-9]\d{4,12}$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配english
 */
function isEnglish(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[A-Za-z]+$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配integer整数
 */
function isInteger(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[-\+]?\d+$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配double或float
 */
function isDouble(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[-\+]?\d+(\.\d+)?$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配邮政编码
 */
function isZipCode(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[0-9]{6}$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配URL
 */
function isUrl(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"])*$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
 */
function isPwd(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[a-zA-Z]\\w{6,12}$/);
	if(result == null) return false;
	return true;
}

/**
 * 判断是否为合法字符(a-zA-Z0-9-_)
 */
function isRightfulString(str) {
	if(str == null || str == "") return false;
	var result = str.match(/^[A-Za-z0-9_-]+$/);
	if(result == null) return false;
	return true;
}

/**
 * 匹配身份证号码
 */
function isIdCardNo(num) {　　
	if(num.length != 15 && num.length != 18) {
		return false;
	}
	return true;
}