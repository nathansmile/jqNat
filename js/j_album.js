/** JS Document 
 * 相册组件
 * 传入一个对象即可
 * Nathan, 2014.5.8 制作
 **/
 
(function($) {
$.fn.jAlbum = function(oo) {
	var o = {
			toggleSpeed: 700,
			slideType: "normal", //大图切换方案
			showBoxType: "img",
			showBoxClick: "no",
			//showBoxClass: "",
			thumbBoxType: "img",
			thumbBoxClick: "no",
			//thumbBoxClass: "",
			arrow: "metro",
			arrowStyle: "tri",//为no则无箭头
			//arrowClass: "",
			thumbArrow: "metro",
			thumbArrowStyle: "tri",
			//thumbArrowClass: "",
			imgdata: "",
			str: "", //注入的代码
			//一些图片大小的参数
			thumbImgWidth: 150, //包括右边距：thumbImgMR
			thumbHeight: 100
		},
		/*,
		lastIndex = 0,*/
		nowIndex = -1,
		thumbIndex = 0,
		thumbIndexMax = 0,
		thumbImgMR = 10,
		showHeight = 0,
		lastThumbChild = "",
		jImgLen,
		thisFrame = $(this),
		loadImgSrc = "images/loading1.gif",
		fullScreen = false,
		fullScreenImgBorder = 6;
	
	o = $.extend(o, oo);
	//解析图片数据
	if (!o.imgdata) {
		o.imgdata = [];
		$(this).find("li").each(function(){
			var ooo = $.extend({}, {
				src:    $(this).attr("jsrc") || "",
				bigsrc: $(this).attr("jbigsrc") || $(this).attr("jsrc") || "",
				text:   $(this).attr("jtext") || "",
				href:   $(this).attr("jhref") || "",
				target: $(this).attr("jtarget") || ""
			});
			o.imgdata.push(ooo);
		});
	} else {
		o.imgdata.forEach(function(v){
			if (!v.bigsrc) {
				v.bigsrc = v.src || "";
			}
		});
	}
	//初始组件参数
	jImgLen = o.imgdata.length;
	var thumbUlWidth = o.thumbImgWidth * (jImgLen + 1);
	thumbIndexMax = (thumbUlWidth - parseInt($(this).css("width")))/o.thumbImgWidth;
	thumbIndexMax = thumbIndexMax > 0 ? parseInt(thumbIndexMax) + 1 : 0;
	//注入元素
	var showboxStr = "",
		thumbboxStr = "",
		frameClass = "j-album";
		//预览图
	var i;
	for (i = 0; i < jImgLen; i++) {
		var v = o.imgdata[i],
			nodeStr = "<img src=\"" + v.src + "\" imgId=\"" + i + "\"" + ((o.showBoxType === "no" && o.thumbBoxClick === "bigger") ? " class=\"bigger\"" : "") + " />";
		if (o.showBoxType === "no") {
			if (o.thumbBoxClick === "link" && v.href) {
				nodeStr = "<a href=\"" + v.href + "\" target=\"" + (v.target || "_blank") + "\">" + nodeStr + "</a>";
			} else {
				nodeStr = "<a>" + nodeStr + "</a>";
			}
			if (o.thumbBoxType === "underText") {
				nodeStr += "<span>" + v.text + "</span>";
			}
		} else {
			nodeStr = "<a href=\"javascript:;\">" + nodeStr + "</a>";
		}
		thumbboxStr += "<li" + ((o.showBoxType === "no" && o.thumbBoxType === "underText") ? " class=\"has-text\"" : "") + "><div>" + nodeStr + "</div></li>";
	}
	//thumbboxStr += "<li class=\"to-end\">已到结尾</li>";
	thumbboxStr = "<ul style=\"width:" + thumbUlWidth + "px;\">" + thumbboxStr + "</ul>";
		//预览图箭头
	if (o.thumbArrowStyle !== "no") {
		thumbboxStr += "<div class=\"left-arrow arrow-" + o.thumbArrowStyle + " " + o.thumbArrow + "\" onselectstart=\"return false;\"><span></span></div><div class=\"right-arrow arrow-" + o.thumbArrowStyle + " " + o.thumbArrow + "\" onselectstart=\"return false;\"><span></span></div>"
	}
	thumbboxStr = "<div class=\"thumb-box" + (o.showBoxType !== "no" ? " has-show-box" : "") + "\">" + thumbboxStr + "</div>";
		//展示图
	if (o.showBoxType !== "no") {
		showboxStr = "<div class=\"show-box-child show" + (o.showBoxClick === "bigger" ? " bigger" : "") + "\"></div>";
		if (o.slideType !== "normal") {
			showboxStr += "<img src=\"" + loadImgSrc + "\" class=\"loading\" />";
		}
			//展示图箭头
		if (o.arrowStyle !== "no") {
			showboxStr += "<div class=\"left-arrow arrow-" + o.arrowStyle + " " + o.arrow + "\" onselectstart=\"return false;\"><span></span></div><div class=\"right-arrow arrow-" + o.arrowStyle + " " + o.arrow + "\" onselectstart=\"return false;\"><span></span></div>";
		}
		showHeight = parseInt($(this).css("height")) - o.thumbHeight;
		showboxStr = "<div class=\"show-box\" style=\"height: " + showHeight + "px;\">" + showboxStr + "</div>";
	}
	
	$(this).addClass(frameClass).html("").append(showboxStr + thumbboxStr + (o.str || ""));
	//对预览区图片宽度改写（当仅有预览区图片）
	if (o.showBoxType === "no") {
		$(this).find(".thumb-box li").css("width", o.thumbImgWidth - thumbImgMR);
	}
	//当预览区箭头为图片时调整预览区容器宽度
	if (o.thumbArrowStyle === "blue-img" || o.thumbArrowStyle === "orange-img") {
		var onlyForThumbBoxWidth = parseInt($(this).find(".thumb-box").css("width")),
			arrowPd = 10;
		$(this).find(".thumb-box").css({
			width: onlyForThumbBoxWidth - arrowPd * 2,
			left: arrowPd,
			overflow: "visible"
		});
	}
	
	//注入预览图箭头行为
	$(this).find(".thumb-box .left-arrow").click(function(){
		if (thumbIndex - 1 >= 0) {
			thumbIndex--;
			$(this).parent().find("ul").stop().animate({left: (-o.thumbImgWidth*thumbIndex)+'px'}, o.toggleSpeed/2);
		}
	});
	$(this).find(".thumb-box .right-arrow").click(function(){
		if (thumbIndex + 1 < thumbIndexMax) {
			thumbIndex++;
			$(this).parent().find("ul").stop().animate({left: (-o.thumbImgWidth*thumbIndex)+'px'}, o.toggleSpeed/2);
		}
	});
	//注入预览图图片点击联动展示区
	if (o.showBoxType !== "no") {
		$(this).find(".thumb-box li img").click(function(){
			var newIndex = parseInt($(this).attr("imgId"));
			if (newIndex === nowIndex)
				return;
			if (lastThumbChild) {
				lastThumbChild.removeClass("active");
			}
			lastThumbChild = $(this).parent().parent().parent();
			lastThumbChild.addClass("active");
			//展示图变化
			if (ruleIndex(newIndex)) {
				insertImgToShowBox();
			}
		});
	}
	
	//注入展示区箭头行为
	$(this).find(".show-box .left-arrow").click(function(){
		if (nowIndex - 1 >= 0) {
			doThumbChange4Show(nowIndex - 1);
		}
	});
	$(this).find(".show-box .right-arrow").click(function(){
		if (nowIndex + 1 < jImgLen) {
			doThumbChange4Show(nowIndex + 1);
		}
	});
	//关联键盘
	$(document).keyup(function(e){
        var key =  e.which;
        if(key == 37){
			if (nowIndex - 1 >= 0) {
				if (fullScreen) {
					insertImgToFullScreen(nowIndex - 1);
				} else {
					doThumbChange4Show(nowIndex - 1);
				}
			}
        }
        if(key == 39){
			if (nowIndex + 1 < jImgLen) {
				if (fullScreen) {
					insertImgToFullScreen(nowIndex + 1);
				} else {
					doThumbChange4Show(nowIndex + 1);
				}
			}
        }
    });
	
	//放大的行为注入
	$(".bigger").click(function() {
		var bigImgIndex = parseInt($(this).attr("imgId"))
		if(!bigImgIndex && bigImgIndex != 0) {
			bigImgIndex = nowIndex;
		}
		callFullScreen(bigImgIndex);
	});
	
	//将当前的图片放入
	function insertImgToShowBox() {
		//插入节点基本内容
		if (!thisFrame.find(".show-box .show").html()) {
			var str = "",
				imgStr;
			if (o.showBoxType === "rightText" || o.showBoxType === "underText") {
				str += "<div class=\"text-info\"><p></p></div>";
				imgStr = "<img src=\"\" />";
			} else {
				imgStr = "<img class=\"only\" src=\"\" />";
			}
			if (o.showBoxClick === "link" && o.imgdata[nowIndex].href) {
				imgStr = "<a href=\"" + o.imgdata[nowIndex].href + "\" target=\"" + o.imgdata[nowIndex].target + "\">" + imgStr + "</a>";
			}
			str += imgStr;
			thisFrame.find(".show-box .show").addClass(o.showBoxType).html(str);
		}
		
		if (o.slideType === "fade") {
			thisFrame.find(".show-box img.loading").fadeIn("fast");
			thisFrame.find(".show-box .show").fadeOut("fast", function(){
				var newImg = new Image();
				newImg.src = o.imgdata[nowIndex].bigsrc;
				newImg.onload = function() {
					thisFrame.find(".show-box .show img").attr("src", newImg.src);
					thisFrame.find(".show-box img.loading").fadeOut("fast");
					thisFrame.find(".show-box .show").fadeIn("normal");
				}
				newImg.onerror = function() {
				}
			});
		} else {
			thisFrame.find(".show-box .show img").attr("src", o.imgdata[nowIndex].bigsrc);
		}
		if (o.showBoxClick === "link" && o.imgdata[nowIndex].href) {
			thisFrame.find(".show-box .show a").attr({
				"href": o.imgdata[nowIndex].href,
				"target": o.imgdata[nowIndex].target
			});
		}
		if (o.showBoxType === "rightText" || o.showBoxType === "underText") {
			thisFrame.find(".show-box .show .text-info p").html(o.imgdata[nowIndex].text);
		}
	}
	//索引变化判断
	function ruleIndex(newIndex) {
		if (newIndex < 0) {
			return false;
		}
		if (newIndex >= jImgLen) {
			return false;
		}
		nowIndex = newIndex;
		return true;
	}
	function ruleThumbIndex(newIndex) {
		if (newIndex < 0) {
			return false;
		}
		if (newIndex < thumbIndexMax) {
			thumbIndex = newIndex;
			return true;
		}
		thumbIndex = thumbIndexMax - 1;
		return false;
	}
	//改变预览图显示区域，并将最新的图片处于激活状态(需保证传入的值是有效的)
	function doThumbChange4Show(newIndex) {
		//检测是否需要使预览图显示区域发生改变
		if ((newIndex < thumbIndex) || (newIndex > (thumbIndex + jImgLen - thumbIndexMax))) {
			ruleThumbIndex(newIndex);
			thisFrame.find(".thumb-box ul").stop().animate({left: (-o.thumbImgWidth*thumbIndex)+'px'}, o.toggleSpeed/2);
		}
		thisFrame.find(".thumb-box li img").eq(newIndex).click();
	}
	//发起全屏效果
	function callFullScreen(newIndex) {
		var overlayStr = "";
		
		fullScreen = true;
		$("body").append("<div class=\"close-screen\"></div>");//锁屏
		
		overlayStr += "<div class=\"img-box\"></div>";
		overlayStr += "<div class=\"close\" title=\"关闭\"></div>";
		/*overlayStr += "<img src=\"" + loadImgSrc + "\" class=\"loading\" />";*/
		overlayStr += "<div class=\"left-arrow metro arrow-" + (o.arrowStyle === "no" ? "tri" : o.arrowStyle) + " size-l\" onselectstart=\"return false;\"><span></span></div><div class=\"right-arrow metro arrow-" + (o.arrowStyle === "no" ? "tri" : o.arrowStyle) + " size-l\" onselectstart=\"return false;\"><span></span></div>";
		overlayStr += "<div class=\"pages-box\"><span>...</span> / <span>" + jImgLen + "</span></div>";
		overlayStr = "<div class=\"j-album overlay\">" + overlayStr + "</div>";
		$("body").append(overlayStr);
		
		insertImgToFullScreen(newIndex);
		
		//注入放大区箭头行为
		$(".j-album.overlay .left-arrow").click(function(){
			if (nowIndex - 1 >= 0) {
				insertImgToFullScreen(nowIndex - 1);
			}
		});
		$(".j-album.overlay .right-arrow").click(function(){
			if (nowIndex + 1 < jImgLen) {
				insertImgToFullScreen(nowIndex + 1);
			}
		});
		
		//锁屏解除
		$(".j-album.overlay .close").click(function(){
			fullScreen = false;
			//thisFrame.find(".thumb-box li img").eq(nowIndex).click();
			$(".close-screen, .j-album.overlay").remove();
		});
	}
	function insertImgToFullScreen(newIndex) {
		ruleIndex(newIndex);
		$(".j-album.overlay .img-box").fadeOut("fast", function(){
			var newImg = new Image();
			newImg.src = o.imgdata[nowIndex].bigsrc;
			newImg.onload = function() {
				$(".j-album.overlay .img-box").html("<div><img src=\"" + newImg.src + "\" /></div>")
				.fadeIn("normal", function(){
					//调整图片大小
					var imgFrameWidth = parseInt($(".j-album.overlay .img-box").css("width")) - fullScreenImgBorder * 2,
						thisImgWidth = parseInt($(".j-album.overlay .img-box img").css("width"));
					if (thisImgWidth > imgFrameWidth) {
						var imgFrameHeight = parseInt($(".j-album.overlay .img-box").css("height")) - fullScreenImgBorder * 2,
							thisImgHeight = parseInt($(".j-album.overlay .img-box img").css("height")),
							newImgWidth = imgFrameWidth,
							newImgHeight,
							newMT;
							
						newImgHeight = thisImgHeight / thisImgWidth * newImgWidth;
						newMT = (imgFrameHeight - newImgHeight) / 2;
						$(".j-album.overlay .img-box img").css({
							"height": newImgHeight,
							"width": newImgWidth
						});
						$(".j-album.overlay .img-box div").css({
							"marginTop": newMT,
							"height": "auto"
						});
					}
					
					$(".j-album.overlay .pages-box span").eq(0).text(nowIndex + 1);
				});
			}
			newImg.onerror = function() {
				console.warn("img \"" + newImg.src + "\" load error");
			}
		});	
	}
	
	if (o.showBoxType !== "no") {
		thisFrame.find(".thumb-box li img").eq(0).click();
	}
};
})(jQuery); 