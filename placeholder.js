/**
 * @authors SX
 * @date    2014-08-11 09:27:48
 * @explain 当浏览器不支持input标签的placeholder属性时的替代方案
 */
 function initPlaceholder(){}
 var placeholder = new initPlaceholder();
 (function($){
 	initPlaceholder.prototype.init = function(){
 		// 判断当前浏览器是否支持input标签的placeholder属性
		if(hasPlaceholder()){return false;}

		// 取得页面中所有带有placeholder属性的input、textarea标签
		var inputLabel = $("input[placeholder], textarea[placeholder]");
		inputLabel.each(function(){
			var that = $(this),
				placeholderVal = that.attr("placeholder"),
				isPassword = that.attr("type")==="password" ? true : false;

			// 如果输入框本身有value值了,就不增加placeholder效果了
			if(that.val().length<=0){
				// 将placeholder属性的值写到输入框的value中
				if(isPassword){
					var placeholderId = that.attr("data-placeholderId");
					if(!placeholderId || placeholderId===""){return false;}
					// 如果输入框类型为密码,那么新建一个div作为显示placeholderVal的容器
					$("body").prepend("<div id=\"passwordPlaceholder\" data-placeholderId=\""+placeholderId+"\" style=\"position:absolute; z-index:9999; display:none;\">"+placeholderVal+"</div>");
					$("div#passwordPlaceholder").css({"top":that.offset().top+"px", "left":that.offset().left+"px", "width":that.width()+"px", "height":that.height()+"px", "line-height":that.height()+"px", "padding-left":"5px"});
					$("div#passwordPlaceholder").show();
				}else{
					that.val(placeholderVal);
				}
			}
			// ---------输入框事件绑定---------
			that.focus(function(){
				var inputVal = $(this).val()._trimAll();
				if(isPassword){
					var placeholderId = $(this).attr("data-placeholderId");
					$("div[data-placeholderId='"+placeholderId+"']").hide();
				}else{
					if(inputVal === placeholderVal){
						$(this).val("");
					}
				}
			});

			that.blur(function(){
				var inputVal = $(this).val()._trimAll();
				if(isPassword){
					if(isNull(inputVal)){
						var placeholderId = $(this).attr("data-placeholderId");
						$("div[data-placeholderId='"+placeholderId+"']").show();
					}
				}else{
					if(isNull(inputVal)){
						$(this).val(placeholderVal);
					}
				}
			});

			$("div#passwordPlaceholder").click(function(){
				var placeholderId = $(this).attr("data-placeholderId");
				$("input[data-placeholderId='"+placeholderId+"']").focus();
				$(this).hide();
			});
		});
 	}

 	$(function(){
 		placeholder.init();
 	})
 })(jQuery)

