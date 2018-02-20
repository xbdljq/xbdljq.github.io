$(function () {
   
})
// 判断是否是整数
function isInt(num) {
    var reg = new RegExp("^[0-9]*$");
    return reg.test(num);
}

// 判断是否是数字
function isNum(num) {
    var reg = new RegExp("^(\-)?[0-9]+(\.[0-9]+)?$");
    return reg.test(num);
}

// 判断是否是手机号码
function isPhone(phone) {
    var reg = new RegExp("^1[0-9]{10}$");
    return reg.test(phone);
}
//吸顶条
function FixedTop(obj1, obj2) {
    var timer;
    var TableHeaderTop = $(obj1).offset().top;
    var TableHeaderH = $(obj1).height();
    $(document).scroll(function (){
        clearTimeout(timer);
        var ScrollTop = $(document).scrollTop();
        if (ScrollTop > TableHeaderTop) {
            timer=setTimeout(function(){
                $(obj1).addClass('fixed');
                $(obj2).css('height', TableHeaderH)
                $(obj2).show();
            },100);
        } else {
            timer=setTimeout(function(){
                $(obj1).removeClass('fixed');
                $(obj2).hide();
            },100);
        }
    });
}
//获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


//获取字符串长度
function getByteLen(val) {
    if (val == null || val == "undefined") return 0;
    return val.length;

}

//只能输入有两位小数的正实数，多用于价格
function isFloat(num) {
    var reg = new RegExp("^[0-9]+(\\.[0-9]{1,2})?$");
    return reg.test(num);
}
//只能输入有1位小数的正实数，多用于打折
function isFloat1(num) {
    var reg = new RegExp("^[0-9]+(\\.[0-9]{1})?$");
    return reg.test(num);
}

//加法
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
//减法
function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
//乘法
function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) { }
    try {
        c += e.split(".")[1].length;
    } catch (f) { }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//除法
function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) { }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) { }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

//通用get请求
function commonGet(url, success, complete) {
    $.ajax({
        url: url,
        type: 'get',
        success: function (resp) {
            if (resp.code == 0) {
                typeof success === "function" && success(resp);
            } else {
                console.log(resp);
                layer.msg(resp.msg);
            }
            typeof complete === "function" && complete(resp);
        },
        error: function () {
            layer.msg('系统错误，请重试！');
            typeof complete === "function" && complete();
        }
    });
}
//通用post请求
function commonPost(url, data, success, complete) {
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (resp) {
            if (resp.code == 0) {
                typeof success === "function" && success(resp);
            } else {
                console.log(resp);
                layer.msg(resp.msg);
            }
            typeof complete === "function" && complete(resp);
        },
        error: function (resp) {
            layer.msg('系统错误，请重试！');
            typeof complete === "function" && complete();
        }
    });
}
//上传图片post请求
function commonPostImg(data, success, complete) {
    $.ajax({
        url: '/Api/Image/Upload',
        type: 'post',
        cache: false,
        data: data,
        processData: false,
        contentType: false
    }).done(function (resp) {
        if (resp.code == 0) {
            typeof success === "function" && success(resp);
        } else {
            console.log(resp);
            layer.msg(resp.msg);
        }
    }).fail(function (resp) {
        layer.msg('系统错误，请重试！');
        typeof complete === "function" && complete();
    });
}


//自定义函数处理queryParams的批量增加
$.fn.serializeJsonObject = function () {
    var json = {};
    var form = this.serializeArray();
    $.each(form, function () {
        if (json[this.name]) {
            if (!json[this.name].push) {
                json[this.name] = [json[this.name]];
            }
            json[this.name].push();
        } else {
            json[this.name] = this.value || "";
        }
    });
    return json;
}
//ele要生成表格的id名，url要请求数据的地址，pagination是否显示分页，queryfun搜索参数集合，arrs生成的列集合
//successFun table加载成功后的监听函数   loadFun加载后的数据设置
function createTable(ele, url, pagination, queryfun, arrs,loadFun,successFun) {
    var ele = $("#" + ele).bootstrapTable({
        url: url,
        method: 'get',
        dataType: "json",
     //   striped: true, //设置为 true 会有隔行变色效果
        undefinedText: "", //当数据为 undefined 时显示的字符
        pagination: pagination, //分页
        pageNumber: 1, //如果设置了分页，首页页码
        pageSize: 20, //如果设置了分页，页面数据条数  
        paginationPreText: '‹', //指定分页条中上一页按钮的图标或文字,这里是<
        paginationNextText: '›', //指定分页条中下一页按钮的图标或文字,这里是>
        responseHandler: function (res) {
            typeof loadFun === "function" && loadFun(res);
            console.log(res)
            return {
                "page": res.data.page,  //默认显示页
                "total": res.data.count,//总条数
                "rows": res.data.list   //数据
            };
        },
        search: false, //显示搜索框
        data_local: "zh-US", //表格汉化
        sidePagination: "server", //服务端处理分页
        queryParams: queryfun,
        // idField: "userId", //指定主键列
        columns: arrs
    });

    ele.on('load-success.bs.table', function (res) { //table加载成功后的监听函数
        typeof successFun === "function" && successFun();
    });
}
//获取当前时间年-月-日
function getNowTime() {
    var date = new Date();
    var seperator1 = "-";

    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

    return currentdate;
}
