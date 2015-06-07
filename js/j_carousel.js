/** JS Document 
 * 轮播组件
 * 传入一个对象即可
 * Nathan, 2014.5.8 制作
 **/

(function($) {
$.fn.jCarousel = function(oo) {
	var o = {
			frameID: "",
			carouselSpeed: 3000,
			toggleSpeed: 700,
			slideType: "normal",
			pointStyle: "nonum",
			pointPosition: "rb",
			pointRound: "no",
			pointSize: "size_s",
			pointClass: "",
			pointBg: "",
			arrow: "normal",
			arrowClass: ""
		},
		nowIndex = -1,
		lastIndex = 0,
		timeOutRec = null,
		thisFrame,
		j_carousel_len;
		
	o = $.extend(o, oo);
	o.carouselSpeed = parseInt(o.carouselSpeed);
	o.toggleSpeed = parseInt(o.toggleSpeed);
	thisFrame = o.frameID ? $("#"+o.frameID+" .j_carousel") : $(".j_carousel");
	j_carousel_len = thisFrame.find("img").length;
	
	if(!j_carousel_len){
		return "no imgs";
	}
		//初始图片数据
	var basicImgWidth = parseInt(thisFrame.css("width"));
	thisFrame.find("img").css("width", basicImgWidth + "px");
	thisFrame.find(".imgFrame").css("width", basicImgWidth*j_carousel_len + "px");
	if (o.slideType === "fade") {
		thisFrame.find(".imgFrame li").addClass("forFade").css("left",basicImgWidth + "px");
	}
		//插入激活点(快捷小点)列表 和 左右箭头
	var activePointStr = "",
		arrowStr = "",
		classStr = "";
	switch (o.pointStyle) {
		case "no":
			break;
		case "num":
			for (var i=0; i<j_carousel_len; i++) {
				activePointStr = activePointStr + "<li id='"+i+"'>"+(i+1)+"</li>";
			}
			break;
		default : 
			for (var i=0; i<j_carousel_len; i++) {
				activePointStr = activePointStr + "<li id='"+i+"'></li>";
			}
	}
	if (activePointStr) {
		activePointStr = o.pointRound === "yes" ? "<ul class='carousel_round_box'>" + activePointStr + "</ul>" : "<ul>" + activePointStr + "</ul>";
		var classStr = "activePoint";
		if (o.pointSize) {
			classStr = classStr + " " + o.pointSize;
		}
		if (o.pointPosition) {
			classStr = classStr + " " + o.pointPosition;
		}
		if (o.pointBg) {
			classStr = classStr + " " + o.pointBg;
		}
		if (o.pointClass) {
			classStr = classStr + " " + o.pointClass;
		}
		activePointStr = "<div class='" + classStr + "'>" + activePointStr + "</div>";
	}
	
	switch (o.arrow) {
		case "no":
			break;
		case "round":
			arrowStr = "<span class='leftArrow carousel_round'>&lt;</span><span class='rightArrow carousel_round'>&gt;</span>";
			break;
		default : 
			arrowStr = "<span class='leftArrow'>&lt;</span><span class='rightArrow'>&gt;</span>";
			break;
	}
	if (arrowStr && o.arrowClass) {
		arrowStr = "<div class='" + o.arrowClass + "'>" + arrowStr + "</div>";
	}
	thisFrame.append(activePointStr + arrowStr);
		//将当前索引的数据显示出来
	function showNowCarousel() {
		thisFrame.find(".bottonInfo li, .j_carousel .activePoint li").removeClass("active");
		thisFrame.find(".bottonInfo li").eq(nowIndex).addClass("active");
		thisFrame.find(".activePoint li").eq(nowIndex).addClass("active");
		if (o.slideType === "fade") {
			//thisFrame.find(".imgFrame li").eq(lastIndex).stop().css("left",0);
			var leftLastWidth,
				leftNowWidth;
			if (nowIndex > lastIndex) {
				leftNowWidth = basicImgWidth + "px";
				leftLastWidth = "-" + basicImgWidth/2 + "px";
			} else {
				leftNowWidth = "-" + basicImgWidth + "px";
				leftLastWidth = basicImgWidth/2 + "px";
			}
			if (lastIndex > -1) {
				thisFrame.find(".imgFrame li").eq(lastIndex).animate({
					left: leftLastWidth,
					opacity: 0
				}, o.toggleSpeed);
			}
			thisFrame.find(".imgFrame li").eq(nowIndex).css("left",leftNowWidth).animate({
				left: 0,
				opacity: 1
			}, o.toggleSpeed);
		} else {
			thisFrame.find(".imgFrame").stop().animate({left: (-basicImgWidth*nowIndex)+'px'}, o.toggleSpeed);
		}
	}
		//格式化索引序号
	function ruleIndex(newIndex) {
		lastIndex = nowIndex;
		nowIndex = (newIndex + j_carousel_len)%j_carousel_len;
	}
		//自动化变换数据
	function autoPlay() {
		ruleIndex(nowIndex + 1);
		showNowCarousel();
		timeOutRec = setTimeout(autoPlay,o.carouselSpeed);
	}
	function clickPlay() {
		clearTimeout(timeOutRec);
		showNowCarousel();
		timeOutRec = setTimeout(autoPlay,o.carouselSpeed);
	}
		//点击产生的索引号变化
	thisFrame.find(".activePoint li").click(function(){
		lastIndex = nowIndex;
		nowIndex = parseInt($(this).attr("id"));
		clickPlay();
	});
	thisFrame.find(".leftArrow").click(function(){
		ruleIndex(nowIndex - 1);
		clickPlay();
	});
	thisFrame.find(".rightArrow").click(function(){
		ruleIndex(nowIndex + 1);
		clickPlay();
	});
	autoPlay();
};
})(jQuery); 