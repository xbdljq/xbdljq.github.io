function msgBox(text, func) {

	var temp = "</div>	<div class=\"vAlertBox\" style=\" width: 100%;  height: 100%;  display: none;  position: fixed;  top: 0;  left: 0;  z-index: 999; \"> ";
	temp += "<div class=\"vAlertbg\" style=\"  width: 100%;  height: 100%;  background: rgba(0,0,0,0.3); \" ></div>";
	temp += "<div class=\"vAlerttc\" style=\"display:block;    width: 250px;      background: rgba(255,255,255,0.9); ";
	temp += " position: fixed;    top: 45%;    margin-top: -65px;    left: 50%;    margin-left: -125px;    z-index: 999;    border-radius: 9px; \" >";
	temp += "	<span class=\"vAlertP\" style=\"  display: block;    text-align: center;    position: relative;    padding:20px 10px; \" >"
			+ text + "</span>";
	temp += "	<span class=\"vAlertBtn\" style=\"  display: block;    text-align: center;    position: relative;    padding: 10px 10px 10px; border-top: 1px solid #777777; \" >确定</span>";
	temp += "</div></div>";
	$("body").after(temp);
	$(".vAlertBox").show();
	$(".vAlertBtn").on("click", function() {
		$(".vAlertBox").css("display", "none");
		$(".vAlertBox").remove();
		func();
	});

}