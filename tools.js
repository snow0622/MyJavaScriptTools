/**
 * @authors SX
 * @date    2014-08-07 13:31:41
 * @explain 将所有底层工具类JS做统一管理,一律使用tools.js进行引用,页面中引用tools时需要给script标签添加ID属性,值为tools
 */
(function(){

	var contextUrl = getContextUrlForBase();
	// ------------------准备将工具类JS写入到页面中------------------
	loadScript("clienBrowserCheck",contextUrl+"ClientBrowserCheck.js","utf-8");	// 浏览器检测工具
	loadScript("EventUtil",contextUrl+"EventUtil.js","utf-8");	// JS事件相关工具
	loadScript("wresize",contextUrl+"jQuery.wresize.js","utf-8");	// jquery实现的onresize事件
	loadScript("jqMd5",contextUrl+"jQuery.md5.js","utf-8");	// jquery实现的MD5加密
	loadScript("placeholder",contextUrl+"placeholder.js","utf-8");	// 当浏览器不支持input标签的placeholder属性时的替代方案
	loadScript("Dialog",contextUrl+"Dialog.js","utf-8");	// 页面中弹出层JS文件
	loadScript("global",contextUrl+"global.js","utf-8");	// 全局JS(存放一些公共模块的JS效果)

})()

// ------------------------自定义的工具类------------------------

// 取得页面的上下文路径 - base目录
function getContextUrlForBase(){
	// 取得引用JS的上下文路径
	var contextUrl = document.getElementById("tools").src;
	var index_1 = contextUrl.indexOf("/tools.js");
	if(index_1>=0){
		contextUrl = contextUrl.substring(0,index_1)+"/";
	}
	return contextUrl;
}

// 取得页面的上下文路径 - script目录
function getContextUrlForScript(){
	// 取得引用JS的上下文路径
	var contextUrl = document.getElementById("tools").src;
	var index_1 = contextUrl.indexOf("/base/tools.js");
	if(index_1>=0){
		contextUrl = contextUrl.substring(0,index_1)+"/";
	}
	return contextUrl;
}

// 取得页面的上下文路径 - image目录
function getContextUrlForImage(){
	// 取得引用JS的上下文路径
	var contextUrl = document.getElementById("tools").src;
	var index_1 = contextUrl.indexOf("/script/base/tools.js");
	if(index_1>=0){
		contextUrl = contextUrl.substring(0,index_1)+"/image/";
	}
	return contextUrl;
}

// 向页面中动态加入JS文件
function loadScript(scriptId, scriptName, charset){
	var head = $("head");
	if(!charset){
		charset = "utf-8";
	}
	if(head.find("#"+scriptId).size() <= 0){
		head.prepend("<script id=\""+scriptId+"\" src=\""+scriptName+"\" charset=\""+charset+"\"></script>");
	}
}

// 按需加载JS文件
function requireScript(scriptId, scriptName, initFun){
	var body = document.getElementsByTagName('body')[0];
	var oldScript = document.getElementById(scriptId);
	if (oldScript) {
		try{
			// 如果JS脚本已经存在,则不在重新加载文件,直接执行文件中的通用方法RunScript
			initFun();
		}catch(e){
			// throw new Error(scriptName+" 脚本中没有初始化方法,无法运行脚本! 请检查脚本!");
		}
	}else{
		var newScript = document.createElement('script');
		newScript.charset = 'utf-8';
		newScript.id = scriptId;
		newScript.type = 'text/javascript';
		newScript.src = getContextUrlForScript()+scriptName;
		body.appendChild(newScript);
	}
}

// 获取页面滚动条数据
function GetPageScroll(win) {
	var x, y;
	if(win.pageYOffset) {
		// all except IE
		y = win.pageYOffset;
		x = win.pageXOffset;
	} else if(win.document.documentElement  && win.document.documentElement.scrollTop) {
		// IE 6 Strict
		y = win.document.documentElement.scrollTop;
		x = win.document.documentElement.scrollLeft;
	} else if(document.body) {
		// all other IE
		y = win.document.body.scrollTop;
		x = win.document.body.scrollLeft;
	}
	return {X:x, Y:y};
}

// 获取页面大小
function GetPageSize(win) {
	var scrW, scrH;
	if(win.innerHeight && win.scrollMaxY) {
		// Mozilla
		scrW = win.innerWidth + win.scrollMaxX;
		scrH = win.innerHeight + win.scrollMaxY;
	} else if(win.document.body.scrollHeight > win.document.body.offsetHeight){
		// all but IE Mac
		scrW = win.document.body.scrollWidth;
		scrH = win.document.body.scrollHeight;
	} else if(win.document.body) { // IE Mac
		scrW = win.document.body.offsetWidth;
		scrH = win.document.body.offsetHeight;
	}

	var winW, winH;
	if(win.innerHeight) { // all except IE
		winW = win.innerWidth;
		winH = win.innerHeight;
	} else if (win.document.documentElement  && win.document.documentElement.clientHeight) {
		// IE 6 Strict Mode
		winW = win.document.documentElement.clientWidth;
		winH = win.document.documentElement.clientHeight;
	} else if (win.document.body) { // other
		winW = win.document.body.clientWidth;
		winH = win.document.body.clientHeight;
	}

	// for small pages with total size less then the viewport
	var pageW = (scrW<winW) ? winW : scrW;
	var pageH = (scrH<winH) ? winH : scrH;

	return {PageW:pageW, PageH:pageH, WinW:winW, WinH:winH};
}

// 取得数组中最大值
Array.prototype._getMaxVal = function(){
	return Math.max.apply({},this);
}

// 取得数组中最小值
Array.prototype._getMinVal = function(){
	return Math.min.apply({},this);
}

// 删除字符串中的前后空格
String.prototype._trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

// 删除字符串中的所有空格
String.prototype._trimAll = function(){
	return this.replace(/\s/g,"");
}

// 删除字符串中的左侧空格
String.prototype._ltrim = function(){
	return this.replace(/(^\s*)/g, "");
}

// 删除字符串中的右侧空格
String.prototype._rtrim = function(){
	return this.replace(/(\s*$)/g, "");
}

// ------------------------字符串验证通用方法------------------------
/*
** 用途：检查输入字符串是否为空或者全部都是空格
** 输入：str
** 返回：如果全是空返回true,否则返回false
*/
function isNull(str){
    if(str == ""){
      return true;
    }else if(str == "null" || str === null){
      return true;
    }
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

/*
** 用途：检查输入的Email信箱格式是否正确
** 输入：strEmail：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function checkEmail(strEmail){
	var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if(emailReg.test(strEmail)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入手机号码是否正确
** 输入：strMobile：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function checkMobile(strMobile){
    var regu = /^[1][1-9][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(strMobile)) {
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入字符串是否只由英文字母和数字和下划线组成
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isNumberOr_Letter(str){
    var regu = "^[0-9a-zA-Z\_]+$";
    var re = new RegExp(regu);
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入字符串是否纯数字
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isNumber(str){
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入字符串是否数字和字母组成
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isNumberOrLetter(str){
    var regu = "^[0-9a-zA-Z]+$";
    var re = new RegExp(regu);
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入字符串是否含有中文
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isHasChinese(str){
	var regu = "[\u4e00-\u9fa5]";
    var re = new RegExp(regu);
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入字符串是否只有中文
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isOnlyChinese(str){
  var regu = "^[\u4e00-\u9fa5]+$";
  var re = new RegExp(regu);
  if(re.test(str)){
      return true;
  }else{
      return false;
  }
}

/*
** 用途：检查输入字符串是否为有效的身份证号
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isCardNo(card){
   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   if(reg.test(card)){
       return true;
   }else{
      return false;
   }
}

/*
** 用途：检查输入字符串是否以字母开头
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function isLetterStart(str){
    var regu = "^[a-zA-Z]";
    var re = new RegExp(regu);
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

/*
** 用途：检查输入的字符串的长度是否符合标准
** 输入：str：字符串 minNum:最小长度 maxNum:最大长度
** 返回：如果通过验证返回true,否则返回false
*/
function checkDigit(str, minNum, maxNum){
	if(str.length >= minNum && str.length <= maxNum){
		return true;
	}else{
		return false;
	}
}

/*
** 用途：剔除字符串中的敏感字符,防止script代码注入
** 输入：str：字符串
** 返回：如果通过验证返回true,否则返回false
*/
function stripScript(str){
	var pattern = new RegExp("[&*<>;]");
	var rs = "";
	for (var i = 0; i < str.length; i++) {
	 rs = rs+str.substr(i, 1).replace(pattern, '');
	}
	return rs;
}

/*
** 用途：查看字符串的字节数
** 输入：str：字符串
** 返回：字节数
*/
function getBytesLength(str) {
	// 在GBK编码里，除了ASCII字符，其它都占两个字符宽
	return str.replace(/[^\x00-\xff]/g, 'xx').length;
}

/*
** 用途：检测按钮是否有display关键词,如果有,说明按钮不可用,不能有click事件
** 输入：btnObj: 按钮对象
** 返回：返回true或false
*/
function isBtnDisplay(btnObj){
  var className = $(btnObj).attr("class");
  var index_1 = className.indexOf("display");
  if(index_1>=0){
    return true;
  }else{
    return false;
  }
}

/*
** 用途：倒计时方法
** 输入：container: 显示容器  font: 显示文字  time: 倒计时时间(秒)
** 返回：返回true或false
*/
function countdownFun(container, font, time){
	if(!time || time==""){return false;}
	// ------将容器本身的文字内容放在临时属性中以备恢复------
	if(!$(container).attr("data-oldContent")){
		$(container).attr("data-oldContent",$(container).html());
	}

	// 如果容器是个按钮,做样式处理
	var containerClassName = $(container).attr("class");
	if(containerClassName.indexOf("btn")>=0 && containerClassName.indexOf("-grey")<0){
		$(container).addClass("display");
		// 将按钮的样式设为灰色
		var index_1 = containerClassName.indexOf("btn-"),
			index_2 = containerClassName.indexOf("-",index_1+"btn-".length);
		if(index_1>=0 && index_2>=0){
			var temp = containerClassName.substring(index_1+"btn-".length,index_2);
			$(container).addClass("btn-"+temp+"-grey");
		}
	}

	// 设置容器显示内容
	$(container).html("<b>"+time+"</b>"+font);

	// 开始倒计时
	var countdown = setTimeout(function(){
		var countdownTime = $(container).find("b").text()*1;
		--countdownTime;
		$(container).html("<b>"+countdownTime+"</b>"+font);
		if(countdownTime<=0){
		// 恢复容器
		$(container).html($(container).attr("data-oldContent"));

		// 如果容器是按钮,则需要做样式处理
		if(containerClassName.indexOf("btn")>=0 && containerClassName.indexOf("-grey")>=0){
			$(container).removeClass("display");
			// 将按钮的样式设为灰色
			var index_1 = containerClassName.indexOf("btn-"),
				index_2 = containerClassName.indexOf("-",index_1+"btn-".length);
			if(index_1>=0 && index_2>=0){
				var temp = containerClassName.substring(index_1+"btn-".length,index_2);
				$(container).removeClass("btn-"+temp+"-grey");
			}
		}

		clearTimeout(countdown);
		}else{
			clearTimeout(countdown);
			countdownFun(container, font, countdownTime);
		}
	},1000);
}

/*
** 用途：将传入的字符串进行MD5加密并且返回加密后的值
** 输入：str: 要加密的字符串
** 返回：加密后的值
** 依赖模块 : jQuery.md5.js
*/
function handlePassword(str){
	var temp = $.md5(str);
	var temp_2 = temp.substring(8,temp.length);
	return temp+temp_2;
}

/*
** 用途：取得超级密码 -- 从后台取得随机数进行登录验证
** 输入：str: 要加密的字符串
** 返回：加密后的值
*/
function getSuperPasswordd(userName){
  var nonce = "";
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://www.1318.com/interface/check.php",
    data: {uin:userName},
    async: false,
    success: function(result){
      if(result && result.code == "1"){
        nonce = result.data.substring(0,result.data.indexOf(","));
      }
    }
  });
  return nonce;
}

// ------------------------浏览器功能检测------------------------
/*
** 用途：检测浏览器是否支持input输入框的placeholder属性
** 返回：如果支持返回true,否则返回false
*/
function hasPlaceholder(str){
    var input = document.createElement("input");
    if(ClientBrowserCheck){
      return "placeholder" in input && ClientBrowserCheck.browser.ie<=10;
    }
    return false;
}

// ------------------------cookie操作------------------------
/*
** 用途：向浏览器添加cookie
** 输入：objName : 存入的cookie名称  |  objValue : 对应的cookie值  |  objHours : cookie保存时间
** 返回：无返回值
*/
function addCookie(objName,objValue,objHours){
	var str = objName + "=" + escape(objValue);
	if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}

/*
** 用途：根据cookie名称取得cookie值
** 输入：objName : cookie名称
** 返回：与cookie名称对应的cookie值(如果存在的话)
*/
function getCookie(objName){
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName){
			return unescape(temp[1]);
		}
	}
	return null;
}

/*
** 用途：根据cookie名称删除cookie
** 输入：objName : cookie名称
** 返回：无返回值
*/
function delCookie(objName){
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = objName + "=a; expires=" + date.toGMTString();
}

/*
** 用途：取得浏览器中的所有cookie
** 输入：无
** 返回：所有cookie的字符串
*/
function allCookie(){
	return document.cookie;
}

// 传入范围,在范围内生成随机数
function GetRandomNum(Min,Max){
  var Range = Max - Min;
  var Rand = Math.random();
  return(Min + Math.round(Rand * Range));
}
