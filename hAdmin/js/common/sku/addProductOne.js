var skuFields;
var cellFields; //ajax获取回来的规格数组ID，如有大小，颜色，重量等规格，其数组内容为[101.102,103]

var skuTableHolder; //下拉选择规格的下拉框
var skuFieldHolder; //收起的规格盒子
var skuTable, tableBody, tableHeader;

//根据规格类别以{类别ID：类别内容}组成的哈希表,
//如htSkuFields.items = [
//{
//     SkuId:101,
//    SkuName:"大小"
//    ValueList: [
//        {
//            ValueId: 1120.
//            ValueName:"6寸"
//        }
//        ......
//    ]
//}
//......
//]
var htSkuFields = new jQuery.Hashtable();
//规格遍历出来的每一行数据,记录存在于表格里的规格ID组合
//如，表格里有一项大小为6寸，颜色为红色的组合，那么数组为htSkuItems.items = ["10101-10234-",......]
var htSkuItems = new jQuery.Hashtable();

// 以下为点击开起规格以后需要显示的项目
//var skuRow; // 规格操作区域（默认不显示）


//定义新增的规格的行排名，可理解为tr.index
var newRowIndex = 0;
//是否显示规格表格
var skuEnabled = false;
//判断是新增还是编辑，0新增
var _id = 1;

var product_type;  //商城类型
var category_id;   //商品分类
var IconUrls = []; //上传的图片集合
var ue;  //商品详情

$(function () {

    //商品图片上传
    $("#file").on("change", function () {
        var formData = new FormData();
        formData.append('file', $('#file')[0].files[0]);
        formData.append('type', 4);

        commonPostImg(formData, function (result) {

            var _li = $('<li class="fileImg"></li>');
            var str = "";
            str += ' <input type="hidden" name="IconUrls[]" id="" value="' + result.data + '" />';
            str += ' <img src="' + result.data + '" />';
            str += '<div class="delImg">×</div>';
            _li.html(str);
            $(".imgUl").append(_li)
            $(".fileImg").show();
            IconUrls.push(result.data);
            if ($(".imgUl").find("li").length >= 5) {
                $("#file").hide()
            } else {
                $("#file").show()
            }
        })
    });
    //删除图片
    $(".delImg").on("click", function () {
        $(this).parents(".fileImg").remove()
    })
    //实例化编辑器
    ue = UE.getEditor('container', {
        toolbars: [
             [
                 'undo', //撤销
        'bold', //加粗
        'indent', //首行缩进
        'italic', //斜体
        'underline', //下划线
        'strikethrough', //删除线
        'formatmatch', //格式刷
        'pasteplain', //纯文本粘贴模式
        'horizontal', //分隔线
        'date', //日期
        'unlink', //取消链接
        'fontsize', //字号
        'paragraph', //段落格式
        'simpleupload', //单图上传
        'insertimage', //多图上传
        'link', //超链接
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        'forecolor', //字体颜色
        'backcolor', //背景色
        'rowspacingtop', //段前距
        'rowspacingbottom', //段后距
        'imagenone', //默认
        'imageleft', //左浮动
        'imageright', //右浮动
        'imagecenter', //居中
        'lineheight', //行间距
             ]
        ]
    });
    ue.ready(function () {
        ue.setContent($("#ueHtml").html());

    });


    skuTableHolder = $("#skuTableHolder"); //下拉选择规格的下拉框
    skuFieldHolder = $("#skuFieldHolder"); //收起规格

    //开启多商品规格
    $("#btnEnableSku").on("click", function () { enableSku(); });
    //关闭规格
    $("#btnCloseSku").on("click", function () { closeSku(); });
    //增加一个规格
    $("#btnAddItem").on("click", function () { addItem(); });
    //生成所有规格
    $("#btnGenerateAll").on("click", function () {
        if (cellFields.length == 0) {
            layer.alert("生成所有规格以前至少需要加入一个规格项！");
            return false;
        }

        var dataRows = $(".SpecificationTr");
        if (dataRows.length > 0) {
            layer.confirm('生成所有规格前会先删除已编辑的所有规格，确定吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                generateAll();
                layer.close(index)
            }, function () {

            });
        }
        if (dataRows.length == 0) {
            generateAll();
        }

    });
    //生成部分规格按钮
    $("#btnshowSkuValue").on("click", function () { showSkuValue(); });

    //页面初始化请求数据   
    _id = GetQueryString("pid");  //商品ID
    product_type = GetQueryString("type");   //商城类型
    $("[name='Id']").val(_id);   //添加时id为0
    //判断是否为新增商品
    if (_id == 0) {
        //新增页面        
        category_id = GetQueryString("cid");   //商品分类
        $("[name='CategoryId']").val(category_id);
        ProductInfo(category_id);
    } else {
        ProductInfo(cid);
        setTimeout(function () {
            initSku();
        }, 500)
    }

    $(".checkNumS").on("change", function () {
        var _this = $(this);
        if (_this.is(":checked")) {
            $("[name='SIntegral']").attr("readonly", "readonly").val(_this.val())
            if ($(".skuItem_numS").length > 0) {
                $(".skuItem_numS").val(_this.val()).attr("readonly", "readonly");
            }
        } else {
            $("[name='SIntegral']").removeAttr("readonly").val("")
            if ($(".skuItem_numS").length > 0) {
                $(".skuItem_numS").val("").removeAttr("readonly");
            }
        }
    })

    // 保存商品
    $("#save").click(function () {
        save();
    });
    //页面初始化
    checkSkuShow();

});

function initSku(id) {

    // 判断是否开启规格
    if (hasSku == 1) {
        //开启规格
        enableSku();
        //置设置属性的规格收起来
        var ths = $(".SpecificationTh .fieldCell");
        for (var i = 0; i < ths.length; i++) {
            var itemSku = ths.eq(i);
            for (var j = 0; j < unSelectSku.length; j++) {
                if (itemSku.attr("skuid") == unSelectSku[j].sku_value_id) {
                    removeSkuField2(unSelectSku[j].sku_value_id, unSelectSku[j].sku_value_name, true)
                }
            }
        }
        setTimeout(function () {
            //将数据绑定到表格上
            for (var i = 0; i < selectDatas.length; i++) {
                newRowIndex++;
                var trs = $('<tr id="sku_' + newRowIndex + '" rowindex="' + newRowIndex + '" class="SpecificationTr"></tr>')
                var selectSku = selectDatas[i].select_sku;

                for (var j = 0; j < selectSku.length; j++) {
                    var tds = $("<td></td>");

                    var panel = $('<div  rowId="' + newRowIndex + '" title="' + selectSku[j].sku_value_name + '" class="specdiv" >' + selectSku[j].sku_value_name + '</div>');
                    panel.attr("id", 'skuDisplay_' + newRowIndex + '_' + selectSku[j].sku_id);
                    panel.attr("skuId", selectSku[j].sku_id);
                    panel.attr("valueId", selectSku[j].sku_value_id);
                    panel.append('<input type="hidden" name="CategoryId" id="" value="" />')

                    $(panel).powerFloat({
                        eventType: "click",
                        target: $("#skuBox_" + selectSku[j].sku_id),
                        showCall: adjustSkuBox
                    });

                    tds.append(panel);
                    console.log(tds.html())
                    trs.append(tds);

                }

                var tds1 = $('<td><input type="text" class="skuItem_SkuCode" id="skuCode_' + newRowIndex + '" value="' + selectDatas[i].sku_bar_code + '" maxlength="30"></td>')
                var tds2 = $('<td><input type="text" class="skuItem_SalePrice" id="salePrice_' + newRowIndex + '"  value="' + selectDatas[i].sku_price + '" maxlength="10" style="width:100px"></td>')
                var tds3 = $('<td><input type="text" class="skuItem_Qty" id="qty_' + newRowIndex + '"  value="' + selectDatas[i].sku_stock + '" maxlength="7" style="width:100px"></td>');
                var tds4 = $('<td><input type="text" class="skuItem_numS" id="numS_' + newRowIndex + '"  value="' + selectDatas[i].sku_s_integral + '" maxlength="10" style="width:100px"></td>')
                var tds5 = $('<td><button type="button" class="btn1 table_btn" onclick="removeSku(' + newRowIndex + ');">删除</button></td>')

                trs.append(tds1)
                trs.append(tds2)
                trs.append(tds3)
                trs.append(tds4)
                trs.append(tds5)
                $(".table tbody").append(trs)
            }

            htSkuItems.clear();
            $.each($(".SpecificationTr"), function () {
                var rowId = $(this).attr("rowindex");
                var rowIdentity = getRowIdentity(rowId);
                if (htSkuItems.containsValue(rowIdentity)) {
                    $(this).remove();
                } else {
                    htSkuItems.add(rowId, rowIdentity);
                }
            });
        }, 1000)
    }
}

// 保存商品
function save() {

    var skuGroup = [];
    console.log(skuEnabled)
    if (skuEnabled) {
        // 商品规格数量需大于等于2
        if ($(".SpecificationTr").length < 1) {
            layer.alert("开启规格以后，您至少需要增加一个商品规格！");
            return false;
        }
        // 检查有无规格值为空的情况
        if ($(".specdefault").length > 0) {
            layer.alert("您需要为每一个规格项选择一个值！");
            return false;
        }
        if (!checkSkuCode()) return false;
        if (!checkNumS()) return false;
        if (!checkQty()) return false;
        if (!checkSalePrice()) return false;

        $(".SpecificationTr").each(function (i, valitem) {
            var rowIndex = $(valitem).attr("rowindex");
            //商家编码
            var skuCode = $("#skuCode_" + rowIndex).val();
            //现价
            var salePrice = $("#salePrice_" + rowIndex).val();
            //库存
            var skuStock = $("#qty_" + rowIndex).val();
            //S积分
            var skuNumS = $("#numS_" + rowIndex).val();

            var selectSku = "";
            var skus = $(valitem).find(".specdiv");
            skus.each(function (j, skuitem) {
                selectSku += "_" + $(skuitem).attr("valueid");
            })

            var datas = {
                BarCode: skuCode, //商家编码
                Price: salePrice, //现价
                Stock: skuStock, //库存
                SIntegral: skuNumS, //S积分
                SkuId: selectSku //商品规格                 
            }
            skuGroup.push(datas);

        })
    } else {
        console.log("我到这了")
        if ($("[name='VIPPrice']").val().trim() == "") {
            layer.alert("价格不能为空");
            return false;
        }
        if ($("[name='Stock']").val().trim() == "") {
            layer.alert("库存不能为空");
            return false;
        }
        if ($("[name='BarCode']").val().trim() == "") {
            layer.alert("条形码不能为空");
            return false;
        }
        if ($("[name='BarCode']").val().trim() == "") {
            layer.alert("条形码不能为空");
            return false;
        }
        if ($("[name='SIntegral']").val().trim() == "") {
            layer.alert("S积分不能为空");
            return false;
        }
    }
    console.log(skuGroup);

    if ($("[name='IconUrls[]']").length <= 0) {
        layer.alert("至少上传一张图片");
        return false;
    }

    //表单提交   
    $("#signupForm").validate({
        submitHandler: function (form) {

            var data = $("#signupForm").serializeArray();
            var temp = typeJ(data);
            temp["Skus"] = skuGroup;

            commonPost("/ProductApi/ApiProduct/EditProduct", temp, function (result) {
                layer.closeAll();
                layer.alert(result.msg, function () {
                    location.href = "/Admin/Order/ProductManaged"
                })
            })
        }
    });
    $("#signupForm").submit();
}

function typeJ(data) {
    var json = {};
    $.each(data, function () {
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

function ProductInfo(id) {
    commonGet("../data/CategorySku.json?cid=" + id, function (result) {
        var SkuList = result.data.skus;
        //判断规格数
        if (SkuList.length == 0) {
            $(".sku_box").hide()
        } else if (SkuList.length > 0) {
            cellFields = new Array(SkuList.length);
            $.each(SkuList, function (i, skuItem) {
                //属性ID
                console.log(skuItem.sku_id)
                cellFields[i] = skuItem.sku_id;
                htSkuFields.add(skuItem.sku_id, skuItem);
            });
            console.log("我到这了")

            $(".sku_box").show();
            $("#skuRow").hide()

            skuTableHolder.empty();
            htSkuItems.clear();
            skuEnabled = false;
        }
    })
}

//生成所有规格
function generateAll() {
    if ($(".SpecificationTr").length > 0) {
        $(".SpecificationTr").remove();
    }

    var dataRows = $(".SpecificationTr");
    var skuValues = htSkuFields.get(cellFields[0]).sku_value;

    //创建一个跟第一个规格种类的同样大的数组
    var skuArray = new Array(skuValues.length);
    if (skuArray.length == 0) {
        layer.alert("生成所有规格以前规格值不能为空！");
        return false;
    }
    $.each(skuValues, function (i, skuValue) {

        skuArray[i] = new Array(1);
        skuArray[i][0] = skuValue;
    });
    var index;

    for (index = 1; index < cellFields.length; index++) {
        skuValues = htSkuFields.get(cellFields[index]).sku_value;

        var tmpArray = new Array(skuArray.length * skuValues.length);
        var rowCounter = 0;

        for (var sindex = 0; sindex < skuValues.length; sindex++) {

            for (var cindex = 0; cindex < skuArray.length; cindex++) {
                tmpArray[rowCounter] = new Array(index + 1);

                for (var rindex = 0; rindex < (index + 1) ; rindex++) {
                    if (rindex == index)
                        tmpArray[rowCounter][rindex] = skuValues[sindex];
                    else {
                        tmpArray[rowCounter][rindex] = skuArray[cindex][rindex];
                    }
                }
                rowCounter++;
            }
        }
        skuArray = tmpArray;
    }
    //除表头外内容都删除
    $.each(dataRows, function () { $(this).remove(); });

    for (i = 0; i < skuArray.length; i++) {
        var rowIndex = addItem();
        for (j = 0; j < cellFields.length; j++) {
            var skuItem = skuArray[i][j];
            selectSkuValue(rowIndex, cellFields[j], skuItem.sku_value_id, skuItem.sku_value_value);
        }
    }
    return true;

}
// 开启规格提示及操作按钮的显示（默认不显示样式控制

// 开启规格
function enableSku() {
    $("#enableSkuRow").hide();
    $("#skuRow").show()
    //创建规格表格
    prepareSkus();
    skuEnabled = true;
    checkSkuShow()
}

function checkSkuShow() {
    ///var c = $("#skuRow").css("display");
    if (skuEnabled) {
        $("#div_ShowPrice").hide(); //现价
        $("#div_Stock").hide(); //总库存
        $("#div_Code").hide() //商家编码
        $("#checkNumSInp").hide() //S积分
    } else {
        $("#div_ShowPrice").show(); //现价
        $("#div_Stock").show(); //总库存
        $("#div_Code").show() //商家编码
        $("#checkNumSInp").show() //S积分
    }
}
// 关闭规格
function closeSku() {
    layer.confirm('确定要删除规格吗？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        skuEnabled = false;
        //开启多商品规格按钮显示
        $("#enableSkuRow").show();

        $("#skuRow").hide();
        skuTableHolder.empty();
        htSkuItems.clear();

        checkSkuShow();
        layer.close(index);
    }, function () { });


}
//创建规格表格
function prepareSkus() {
    skuTable = $('<table width="99%" class="table"></table>');
    tableBody = $('<tbody></tbody>');
    tableHeader = $('<tr class="SpecificationTh"></tr>');

    for (var cellIndex = 0; cellIndex < cellFields.length; cellIndex++) {
        var skuId = cellFields[cellIndex];
        var skuItem = htSkuFields.get(skuId);
        var fieldCell = createFieldCell(skuId, skuItem.sku_name);
        tableHeader.append(fieldCell);
        var skuBox = $('<div style="display: none;" id="skuBox_' + skuId + '" class="target_box"></div>')

        fillSkuBox(skuBox, skuId, skuItem.sku_value);

        skuTableHolder.append(skuBox);
    }

    tableHeader.append($('<td>条形码</td>'));
    tableHeader.append($('<td><em >*</em>现价(元)</td>'));
    tableHeader.append($('<td><em >*</em>库存</td>'));
    tableHeader.append($('<td><em >*</em>S积分比例</td>'));
    tableHeader.append($('<td width="80">操作</td>'));
    tableBody.append(tableHeader);

    skuTable.append(tableBody);
    skuTableHolder.append(skuTable);

}

function selectSkuValue(rowId, skuId, valueId, valueStr) {
    var displayCtl = $("#skuDisplay_" + rowId + "_" + skuId);

    displayCtl.html(valueStr);
    displayCtl.attr("title", valueStr);
    displayCtl.attr("valueId", valueId);
    displayCtl.addClass("specdiv").removeClass("specdefault");

    var rowIdentity = getRowIdentity(rowId);
    if (htSkuItems.containsKey(rowId))
        htSkuItems.items[rowId] = rowIdentity;
    else
        htSkuItems.add(rowId, rowIdentity);

    $.powerFloat.hide();
}

function getRowIdentity(rowId) {
    var rowIdentity = "";
    for (index = 0; index < cellFields.length; index++) {
        rowIdentity += $('#skuDisplay_' + rowId + '_' + cellFields[index]).attr("valueId") + "-";
    }
    return rowIdentity;
}

//创建规格类型
function createFieldCell(skuId, skuName) {

    var fieldCell = $('<td class="fieldCell"  skuId="' + skuId + '"><span>' + skuName + '</span></td>');
    var delCtl = $('<button type="button" class="closeClo" onclick="removeSkuField1(\'' + skuId + '\',\'' + skuName + '\', true);" title="删除此规格项">×</button>');
    fieldCell.append(delCtl);
    return fieldCell;
}
//创建规格下拉框的选项
function fillSkuBox(box, skuId, skuValues) {
    $.each(skuValues, function (valIndex, val) {
        box.append($('<span valueId="' + val.sku_value_id + '" skuId="' + skuId + '" class="sku' + skuId + 'values">' + val.sku_value_value + '</span>'))

    });
}

// 增加一个规格
function addItem() {
    if (cellFields.length == 0) {
        layer.alert("增加一个规格前必须先选择一个规格名！");
        return false;
    }
    newRowIndex++;
    var dataRow = $('<tr id="sku_' + newRowIndex + '" rowindex="' + newRowIndex + '" class="SpecificationTr"></tr>')

    //创建规格列
    for (var itemIndex = 0; itemIndex < cellFields.length; itemIndex++) {
        dataRow.append(createSkuCell(newRowIndex, cellFields[itemIndex]));
    }
    dataRow.append(createSkuCodeCell(newRowIndex));   //创建商家编码列
    dataRow.append(createSalePriceCell(newRowIndex));  //创建现价列
    dataRow.append(createQtyCell(newRowIndex));			//创建库存列
    dataRow.append(createNumS(newRowIndex));            //创建S积分比例列
    dataRow.append(createActionCell(newRowIndex));		//创建操作列

    tableBody.append(dataRow);
    return newRowIndex;
}

//创建一个规格
function createSkuCell(rowIndex, skuId) {
    var cell = createCell();
    var panel = $('<div id="skuDisplay_' + rowIndex + '_' + skuId + '" rowId="' + rowIndex + '" skuId="' + skuId + '" valueId="" class="specdefault">请选择</div>')
    $(panel).powerFloat({
        eventType: "click",
        target: $("#skuBox_" + skuId),
        showCall: adjustSkuBox
    });
    cell.append(panel);
    return cell;
}
//点击表格里的规格后出现的弹窗层
function adjustSkuBox() {
    var rowId = $(this).attr("rowId");
    var skuId = $(this).attr("skuId");
    var skuBox = $("#skuBox_" + skuId);
    var valueList = $('.sku' + skuId + 'values')

    $.each(valueList, function (i, listItem) {
        //因为每个规格都是用的同一个弹出层，所以必须先取消上一次事件绑定
        $(listItem).unbind("click");

        if (checkValue(rowId, skuId, $(this).attr("valueId"))) {
            //禁用状态
            $(listItem).addClass("specsna");
        } else {
            //可选择状态
            $(listItem).addClass("specspan").removeClass("specsna");
            $(listItem).bind("click", function () {
                selectSkuValue(rowId, skuId, $(this).attr("valueId"), $(this).html());
            });
        }
    });
}

//检查改规格是否已被选择
function checkValue(rowId, skuId, valueId) {
    var rowIdentity = "";
    for (index = 0; index < cellFields.length; index++) {
        if (cellFields[index] == skuId) {
            rowIdentity += valueId + "-";
        } else {
            rowIdentity += $('#skuDisplay_' + rowId + '_' + cellFields[index]).attr("valueId") + "-";
        }
    }
    return htSkuItems.containsValue(rowIdentity);

}

//创建一行里面的商家编码
function createSkuCodeCell(rowIndex) {
    var cell = createCell();
    var skuCodeCell = $('<input type="text" class="skuItem_SkuCode" id="skuCode_' + rowIndex + '"  maxlength="30"/>');

    cell.append(skuCodeCell);
    return cell;
}

//创建一行里面的现价
function createSalePriceCell(rowIndex) {
    var cell = createCell();
    var priceCell = $('<input type="text" class="skuItem_SalePrice" id="salePrice_' + rowIndex + '"  maxlength="10" style="width:100px"/>')
    var gradePrice = $('<input type="text" id="gradeSalePrice_' + rowIndex + '" style="display:none" maxlength="10" style="width:100px" />')
    cell.append(priceCell);
    cell.append(gradePrice);

    return cell;
}
//创建一行里面的库存
function createQtyCell(rowIndex) {
    var cell = createCell();
    var quantityCell = $('<input type="text" class="skuItem_Qty" id="qty_' + rowIndex + '" maxlength="7" style="width:100px"/>')
    // $(quantityCell).val($("#ctl00_ContentPlaceHolder1_txtStock").val());
    cell.append(quantityCell);
    return cell;
}
//创建一行里面的S积分比例
function createNumS(rowIndex) {
    var cell = createCell();
    var NumS = $('<input type="text" class="skuItem_numS" id="numS_' + rowIndex + '" maxlength="10" style="width:100px"/>')
    // $(NumS).val($("#ctl00_ContentPlaceHolder1_txtStock").val());
    cell.append(NumS);
    return cell;
}
//创建一行里面的操作
function createActionCell(rowIndex) {
    var cell = createCell();
    var actionCell = $('<button type="button" class="btn1 table_btn" onclick="removeSku(' + rowIndex + ');">删除</button>')
    cell.append(actionCell);
    return cell;
}
//创建一行里面的一列
function createCell() {
    return $('<td></td>');
}
//生成部分规格按钮， 展示要生成的部分规格内容的方法
var layerFormHtml = $("#modelSkuItems").html();
$("#modelSkuItems").remove();
function showSkuValue() {
    if (cellFields.length == 0) {
        layer.alert("生成部分规格以前至少需要加入一个规格项！");
        return;
    }
    layer.open({
        type: 1,
        area: ['650px', '500px'],
        //shadeClose: true, //点击遮罩关闭
        title: "选择规格",
        content: layerFormHtml,
        offset: "15%",
        btn: ['保存', '取消'],
        yes: function () {
            if (generateSku()) {
                $("#modelSkuItems").hide();
                layer.closeAll();
            }

        },
        btn2: function () { layer.closeAll(); }
    });

    //清空内容
    $("#skuItems").empty();
    var ulTag = $("<ul><\/ul>");
    $("#skuItems").append(ulTag);

    //生成规格选项
    var values;
    for (var index = 0; index < cellFields.length; index++) {
        var liTag = $('<li class="skuItem clearfix" skuId="' + cellFields[index] + '"></li>')
        var titleSpan = $('<span class="formitemtitle4">' + htSkuFields.get(cellFields[index]).sku_name + '：</span>')

        values = htSkuFields.get(cellFields[index]).sku_value;
        var contentSpan = $('<span class="skuItemList"></span>');
        var contentUl = $("<ul></ul>");
        contentSpan.append(contentUl);
        liTag.append(titleSpan);
        liTag.append(contentSpan);
        ulTag.append(liTag);

        $.each(values, function (i, skuValue) {
            var contentLi = $('<li style="clear:none;"><\/li>');

            var chkItem = $('<input  type="checkbox"/>')
            chkItem.attr("name", "cp_" + cellFields[index]);
            chkItem.attr("id", "prop_" + cellFields[index] + "_" + skuValue.sku_value_id);
            chkItem.attr("value", cellFields[index] + ":" + skuValue.sku_value_id);
            chkItem.attr("valueId", skuValue.sku_value_id);
            chkItem.attr("valueName", skuValue.sku_value_value);

            var valueSpan = $("<span></span>")
            valueSpan.attr("itemId", "prop_" + cellFields[index] + "_" + skuValue.sku_value_id);
            valueSpan.text(skuValue.sku_value_value)

            contentLi.append(chkItem);
            contentLi.append(valueSpan);
            contentUl.append(contentLi);
        });

    }

    // 已经生成的规格默认选中
    $.each($(".specdiv"), function (itemIndex, itemNode) {
        var skuItems = $("input[type='checkbox']");
        $.each(skuItems, function (attIndex, attNode) {
            if ($(itemNode).attr("valueId") == $(attNode).attr("valueId"))
                $(attNode).attr("checked", true);
        });
    });

    $("#skuItems").show()
}

// 点击弹框的确定按钮 生成部分规格
function generateSku() {
    newRowIndex = 0;
    htSkuItems.clear();
    $(".SpecificationTr").remove();
    //一行tr的类
    var dataRows = $(".SpecificationTr");

    //获取要生成的规格的内容,获取回来的是一个哈希列表，内容为选择的规格数组，规格里有选择的规格值数组
    var currentSkuFields = getSkuFields();

    var skuValues = currentSkuFields.get(cellFields[0]).sku_value;

    var skuArray = new Array(skuValues.length);

    $.each(skuValues, function (i, skuValue) {
        skuArray[i] = new Array(1);
        skuArray[i][0] = skuValue;
    });

    //cellFields.length   指规格的种类有几种，如颜色，尺寸，长度3种类别
    var tmpArray;
    var rowCounter;
    for (var index = 1; index < cellFields.length; index++) {
        var d = currentSkuFields.get(cellFields[0]).sku_value;

        //获取该规格下选了几种类别，如颜色规格下，选了黄色，蓝色2种规格
        skuValues = currentSkuFields.get(cellFields[index]).sku_value;

        //假如该规格种类下有一种规格被选中，则提示至少要选择一个规格值
        if (skuValues.length == 0 || d.length == 0) {
            layer.alert("每种规格至少要选择一个规格值");
            return false;
        }

        tmpArray = new Array(skuArray.length * skuValues.length);
        //tmpArray = new Array(skuArray.length);
        rowCounter = 0;
        for (var sindex = 0; sindex < skuValues.length; sindex++) {

            for (var cindex = 0; cindex < skuArray.length; cindex++) {
                tmpArray[rowCounter] = new Array(index + 1);

                for (var rindex = 0; rindex < (index + 1) ; rindex++) {
                    if (rindex == index)
                        tmpArray[rowCounter][rindex] = skuValues[sindex];
                    else {
                        tmpArray[rowCounter][rindex] = skuArray[cindex][rindex];
                    }
                }
                rowCounter++;
            };
        }
        skuArray = tmpArray;
    }

    $.each(dataRows, function () { $(this).remove(); });
    //skuArray.length为要生成多少条数据
    for (var i = 0; i < skuArray.length; i++) {

        var rowIndex = addItem();
        // cellFields.length规格的种类数目
        for (var j = 0; j < cellFields.length; j++) {

            var skuItem = skuArray[i][j];
            selectSkuValue(rowIndex, cellFields[j], skuItem.sku_value_id, skuItem.sku_value_value);
        }
    }
    var objId = 'skuValueBox';
    $('#' + objId).hide();


    return true;
}
// 弹框获取要生成哪些规格
function getSkuFields() {

    var currentSkuFields = new jQuery.Hashtable();

    for (i = 0; i < cellFields.length; i++) {
        var skuItems = $('input[type="checkbox"][name="cp_' + cellFields[i] + '"]:checked')
        var skuStr = '({';
        skuStr += '"sku_name":"' + htSkuFields.get(cellFields[i]).sku_name + '",';
        skuStr += '"sku_id":"' + cellFields[i] + '",'

        var skuValueStr = "";
        $.each(skuItems, function (itemIndex, skuItem) {
            skuValueStr += '{"sku_value_id":"' + $(skuItem).attr("valueId") + '", "sku_value_value":"' + $(skuItem).attr("valueName") + '"},';
        });

        if (skuValueStr != "") {
            skuValueStr = skuValueStr.substring(0, skuValueStr.length - 1);
        }

        skuStr += '"sku_value":[' + skuValueStr + ']';
        skuStr += '})'
        currentSkuFields.add(cellFields[i], eval(skuStr));

    }
    console.log(currentSkuFields);
    return currentSkuFields;
}
//删除一列规格
function removeSkuField1(skuId, skuName, showConfirmsss) {
    if (showConfirmsss) {
        layer.confirm("确定要从商品规格中删除 " + skuName + " 吗？", {
            btn: ['确定', '取消'] //按钮
        }, function (index) {
            var fieldCell = $(".table td[skuId='" + skuId + "']");
            var cellIndex = fieldCell.parent("tr").children().index(fieldCell);

            $(".table tr").each(function () {
                $("td:eq(" + cellIndex + ")", $(this)).remove();
            });

            var tmpArr = new Array(cellFields.length - 1);
            var counter = 0;
            for (i = 0; i < cellFields.length; i++) {
                if (cellFields[i] != skuId) {
                    tmpArr[counter] = cellFields[i];
                    counter++;
                }
            }
            cellFields = tmpArr;

            var skuField = $('<span class="skufield" onclick="addSkuField($(this));"></span>')
            skuField.attr("cellIndex", cellIndex);
            skuField.attr("skuId", skuId);
            skuField.attr("skuName", skuName);

            var _a = $('<button type="button" class="table_btn" title="添加此规格项">' + skuName + '＋</button>')
            skuField.append(_a);

            skuFieldHolder.append(skuField);
            skuFieldHolder.css("display", "");

            htSkuItems.clear();

            $.each($(".SpecificationTr"), function () {
                var rowId = $(this).attr("rowindex");
                var rowIdentity = getRowIdentity(rowId);
                if (htSkuItems.containsValue(rowIdentity))
                    $(this).remove();
                else
                    htSkuItems.add(rowId, rowIdentity);
            });

            layer.close(index)
        }, function () { });
    }
}

function removeSkuField2(skuId, skuName, showConfirm) {
    var fieldCell = $(".table td[skuId='" + skuId + "']");
    var cellIndex = fieldCell.parent("tr").children().index(fieldCell);
    $(".table tr").each(function () {
        $("td:eq(" + cellIndex + ")", $(this)).remove();
    });
    var tmpArr = new Array(cellFields.length - 1);
    var counter = 0;
    for (i = 0; i < cellFields.length; i++) {
        if (cellFields[i] != skuId) {
            tmpArr[counter] = cellFields[i];
            counter++;
        }
    }
    cellFields = tmpArr;
    var skuField = $('<span class="skufield" onclick="addSkuField($(this));"></span>')
    skuField.attr("cellIndex", cellIndex);
    skuField.attr("skuId", skuId);
    skuField.attr("skuName", skuName);
    var _a = $('<button type="button" class="table_btn" title="添加此规格项">' + skuName + '＋</button>')
    skuField.append(_a);
    skuFieldHolder.append(skuField);
    skuFieldHolder.css("display", "");
    htSkuItems.clear();
    $.each($(".SpecificationTr"), function () {
        var rowId = $(this).attr("rowindex");
        var rowIdentity = getRowIdentity(rowId);
        if (htSkuItems.containsValue(rowIdentity))
            $(this).remove();
        else
            htSkuItems.add(rowId, rowIdentity);
    });
}

//删除一行规格
function removeSku(rowIndex) {
    layer.confirm('规格数据删除以后不能恢复，确定要删除吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $("#sku_" + rowIndex).css("background-color", "red");
        $("#sku_" + rowIndex).remove();
        htSkuItems.remove(rowIndex);
    }, function () { });
}

//添加一列规格
function addSkuField(skuField) {
    var skuId = $(skuField).attr("skuId");
    var fieldCell = createFieldCell(skuId, $(skuField).attr("skuName"));

    $(fieldCell).insertBefore($("td:eq(0)", $(tableHeader)));
    $.each($(".SpecificationTr"), function () {
        var skuCell = createSkuCell($(this).attr("rowindex"), skuId);
        $(skuCell).insertBefore($("td:eq(0)", $(this)));
    });

    var tmpArr = new Array(cellFields.length + 1);
    tmpArr[0] = skuId;
    for (i = 1; i <= cellFields.length; i++) {
        tmpArr[i] = cellFields[i - 1];
    }
    cellFields = tmpArr;

    $(skuField).remove();
    if ($(skuFieldHolder).children().length == 0)
        skuFieldHolder.css("display", "none");
}

//点击保存，做的验证，验证商家编码
function checkSkuCode() {
    var validated = true;
    $.each($(".skuItem_SkuCode"), function () {
        if ($(this).val().length == 0) {
            layer.alert("商品规格的条形码为必填项")
            $(this).focus();
            validated = false;
            return false;
        }
        if ($(this).val().length > 30) {
            layer.alert("条形码的长度不能超过30个字符！");
            $(this).focus();
            validated = false;
            return false;
        }
    });
    return validated;
}
//验证S积分
function checkNumS() {
    var validated = true;
    $.each($(".skuItem_numS"), function () {
        if ($(this).val().length == 0) {
            layer.alert("S积分比例不能为空")
            $(this).focus();
            validated = false;
            return false;
        }
    });
    return validated;
}

//点击保存，做的验证，验证销售价
function checkSalePrice() {
    return checkPrice($(".skuItem_SalePrice"), true, "现价");
}
function checkQty() {
    return checkNumber($(".skuItem_Qty"), true, "库存");
}
function checkPrice(inputItems, required, priceName) {

    var validated = true;
    var exp = new RegExp("^(0|(0+(\\.[0-9]{1,2}))|[1-9]\\d*(\\.\\d{1,2})?)$", "i");
    $.each(inputItems, function () {
        var val = $(this).val().trim();
        // 检查必填项是否填了
        if (required && val.length == 0) {
            layer.alert("商品规格的" + priceName + "为必填项")
            $(this).focus();
            validated = false;
            return false;
        }
        if (val.length > 0) {
            // 检查输入的是否是有效的金额
            if (!isFloat(val)) {

                layer.alert("商品规格的" + priceName + "输入有误")
                $(this).focus();
                validated = false;
                return false;
            }

            // 检查金额是否超过了系统范围
            var num = parseFloat(val);
            if (!((num >= 0.01) && (num <= 10000000))) {
                // ShowMsg(String.format("商品规格的{0}超出了系统表示范围！", priceName),false);
                layer.alert("商品规格的" + priceName + "必须大于0")
                $(this).focus();
                validated = false;
                return false;
            }
        }
    });

    return validated;
}

function checkNumber(inputItems, required, numberName) {
    var validated = true;
    var exp = new RegExp("^-?[0-9]\\d*$", "i");

    $.each(inputItems, function () {
        var val = $(this).val().trim();

        // 检查必填项是否填了
        if (required && val.length == 0) {
            //ShowMsg(String.format("商品规格的{0}为必填项！", numberName),false);
            layer.alert("商品规格的" + numberName + "为必填项")
            $(this).focus();
            validated = false;
            return false;
        }

        if (val.length > 0) {
            // 检查输入的是否是有效的数字
            if (!isInt(val)) {
                // ShowMsg(String.format("商品规格的{0}输入有误！", numberName), false);
                layer.alert("商品规格的" + numberName + "输入有误！")
                $(this).focus();
                validated = false;
                return false;
            }

            // 检查数字是否超过了系统范围
            var num = parseInt(val);
            if (!((num >= 0) && (num <= 9999999))) {
                //  ShowMsg(String.format("商品规格的{0}超出了系统表示范围！", numberName), false);
                layer.alert("商品规格的" + numberName + "必须大于0")
                $(this).focus();
                validated = false;
                return false;
            }
        }
    });
    return validated;
}
