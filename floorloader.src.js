/** floorLoader - 贴吧异步截取楼层辅助函数
* @author  Jixun66
* @date    27st Mar. 2014
* @url     http://jixun.org/
* @License MIT License
* @Version 1.0.0.1
*/

var floorLoader = (function () {
	var floorCallbacks = [],
		mo = new MutationObserver(function (m) {
			m.forEach (function (q, e) {
				e = q.addedNodes;
				if (!e.length)
					return;
				// 调用回调
				for (var i=0; i<e.length; i++)
					floorCallbacks.forEach (function (fCallback) {
						fCallback (e[i]);
					});
			});
		});
	
	return {
		// 绑定异步加载的楼层函数
		// floorCallback: 回调函数; 回调参数 1 为带有 l_post 类名的 DOM 元素
		// 返回值:
		// false: 已经存在
		// 数值 : 绑定的函数序号
		regFloor: function (floorCallback) {
			return floorCallbacks.indexOf (floorCallback) === -1
				&& floorCallbacks.push (floorCallback) - 1;
		},
		// 移除绑定异步加载的楼层函数
		// funcIndex: 回调函数序号
		// 返回值: 0 序号超出范围
		//		 1 正常
		rmFloor: function (funcIndex) {
			return floorCallbacks.splice (funcIndex, 1).length;
		},
		// 初始化事件监听
		// postsDom: 可忽略; 传入一个 id 为 j_p_postlist 的元素, 用于监视事件。
		init: function (postsDom) {
			mo.observe(postsDom || document.querySelector('#j_p_postlist'), { childList: true });
		},
		// 销毁事件监听
		destory: function () {
			if (mo) mo.disconnect();
		}
	};
})();
