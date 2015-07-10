// 跨浏览器的事件处理工具
/*
 *	addHandler 			|	添加事件
 *----------------------------------------------------------
 *	removeHandler 		|	移除事件
 *----------------------------------------------------------
 *	getEvent 			|	取得事件对象
 *----------------------------------------------------------
 *	getTarget 			|	取得事件的目标
 *----------------------------------------------------------
 *	preventDefault 		|	取消事件默认行为
 *----------------------------------------------------------
 *	stopPropagation 	|	停止事件在DOM中传播
 *----------------------------------------------------------
 *	getRelatedTarget 	|	取得事件相关元素
 *----------------------------------------------------------
 *	getButton 			|	取得触发事件的鼠标按键
 *----------------------------------------------------------
 *	getCharCode 		|	取得键盘的字符码
 *----------------------------------------------------------
 *	getWheelDlta 		|	当鼠标中键触发事件时取得中键是向上滚还是向下滚
*/

var EventUtil = {
	/*
	 * 添加事件
	 *	element:绑定事件的目标元素
	 *	eventType:事件类型
	 *	handler:事件函数
	*/ 
	addHandler : function(element, eventType, handler){
		if(element.addEventListener){
			element.addEventListener(eventType, handler, false);
		}else if(element.attachEvent){
			element.attachEvent("on"+eventType, handler);
		}else{
			element["on"+eventType] = handler;
		}
	},

	/*
	 * 移除事件
	 *	element:移除事件的目标元素
	 *	eventType:将要移除的事件类型
	 *	handler:将要移除的事件函数
	*/
	removeHandler : function(element, eventType, handler){
		if(element.removeEventListener){
			element.removeEventListener(eventType, handler, false);
		}else if(element.detachEvent){
			element.detachEvent("on"+eventType, handler);
		}else{
			element["on"+eventType] = null;
		}
	},

	/*
	 * 取得事件对象
	 *	event:事件对象
	*/
	getEvent : function(event){
		return event ? event : window.event;
	},

	/*
	 * 取得事件的目标
	 *	event:事件对象
	*/
	getTarget : function(event){
		return event.target || event.srcElement;
	},

	/*
	 * 取消事件默认行为
	 *	event:事件对象
	*/
	preventDefault : function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},

	/*
	 * 停止事件在DOM中传播(停止事件冒泡过程)
	 *	event:事件对象
	*/
	stopPropagation : function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},

	/*
	 * 取得事件相关元素
	 * 发生mouseover和mouseout事件时，会涉及更多元素。
	 * 两事件都会涉及把鼠标指针从一个元素的边界之内移动到另一个元素的边界之内
	 *	evenrt:事件对象
	*/
	getRelatedTarget : function(event){
		if(event.relatedTarget){
			return event.relatedTarget;
		}else if(event.toElement){
			return event.toElement;
		}else if(event.fromElement){
			return event.fromElement;
		}else{
			return null;
		}
	},

	/*
	 * 取得触发事件的鼠标按键(click事件触发后button值始终为0,只有mousedown事件才能正确区别button值)
	 * DOM中的button属性取值: 0:鼠标主按键 | 1:鼠标中键（滚轮按钮） | 2:鼠标次键
	 * IE中button属性取值: 0:没按键 | 1:主键 | 2:次键(右键) | 3:同时主+次 | 4:中键(滚轮按钮) | 5:主+中 | 6:次+中 | 7:主+次+中
	 * IE中很多返回值正常情况下是无意义的,所以需要合并换回的值
	 *	event:事件对象
	*/
	getButton : function(event){
		// 判断浏览器是否支持DOM二级的方法
		if(document.implementation.hasFeature("MouseEvents","2.0")){
			return event.button;
		}else{
			switch(event.button){
				case 0 : 
				case 1 : 
				case 3 : 
				case 5 : 
				case 7 : 
					return 0; // 都算按了鼠标主键
				case 2:
				case 6:
					return 2; // 都算按了鼠标次键
				case 4:
					return 1; // 都算按了鼠标中键
			}
		}
	},

	/*
	 * 取得键盘的字符码
	 * 只有键盘按钮触发事件的时候才会有值
	 * 	event:事件对象
	*/
	getCharCode : function(event){
		if(typeof event.charCode == "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},

	/*
	 * 当鼠标中键触发事件时取得中键是向上滚还是向下滚
	 * ※特殊说明:ClientBrowserCheck.engine.opera方法需要配合ClientBrowserCheck.js文件中的方法使用,检测客户端浏览器
	 *	event:事件对象
	*/
	getWheelDlta : function(event){
		if(event.wheelDelta){
			if(typeof ClientBrowserCheck !== "undefined"){
				return (ClientBrowserCheck.engine.opera && ClientBrowserCheck.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
			}else{
				alert("无法正确判断浏览器版本,所以无法取得鼠标中键值![EventUtil.js文件 getWheelDlta方法]");
			}
		}else{
			return -event.detail * 40;
		}
	}
};