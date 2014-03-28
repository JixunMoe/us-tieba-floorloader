/** floorLoader - 贴吧异步截取楼层辅助函数
* @author  Jixun66
* @date    27st Mar. 2014
* @url     http://jixun.org/
* @License MIT License
* @Version 1.0.0.1
*/

var USO = (function () {
	var _ = {};

	// TYPES
	_.isArr = function (arr) {
		return arr instanceof Array;
	};
	_.isObj = function (arr) {
		return arr instanceof Object;
	};
	_.isFun = function (fun) {
		return fun instanceof Function;
	};

	// ARRAY
	_.forEach = _.each = function (arr, cb) {
		for (var i=0; i<arr.length; i++)
			cb (arr[i], i);
	};

	_.last = function (arr) { return arr[arr.length -1] };
	_.first = function (arr) { return arr[0] };

	_.lastSafe = function (arr) { return arr && arr[arr.length -1] };
	_.firstSafe = function (arr) { return arr && arr[0] };

	// Force array-like object to array; Such as DOM elements.
	_.forceArray = function (arr) {
		for (var i=0, ret = []; i<arr.length; i++)
			ret.push (arr[i]);
	}

	// STRING
	_.json = function (str, defValue) {
		if (!defValue) defValue = {};
		str = str.trim();
		if (!str) return defValue;

		try {
			return JSON.parse (str);
		} catch (e) {
			return defValue || {};
		}
	}

	// DOM
	_.T = _.L = function (s) { return document.createTextNode (s) }
	_.C = function (s) { return document.createElement (s) }
	_.inject = function ( tag, src ) {
		var ret = _.C (tag);
		ret.innerHTML = src;
		document.body.appendChild (ret);
		return ret;
	}
	_.injectScript = function (src) {
		return _.inject ('script', src);
	};
	_.injectStyle = function (src) {
		return _.inject ('style', src);
	};
	_.css = function (ele, attr, val) {
		if (ele.length) {
			_.forEach (ele, function (t) {css (t, attr)});
		} else {
			for (x in attr) ele.style[x] = attr[x];
		}
		return ele;
	};
	_.attr = function (ele, name, val) {
		if (_.isObj (name)) {
			// { x: xx, .. }
			for (x in name)
				ele.setAttribute (x, name[x]);
			return ele;
		}
		if (arguments.length != 3)
			return ele.getAttribute (name);
		ele.setAttribute (x, val);
		return ele;
	};
	_.click = function () {

	};
	function insertAfter (what, ref) {
		ref.parentNode.insertBefore (what, ref.nextSibling)
	}
	function insertBefore (what, ref) {
		ref.parentNode.insertBefore (what, ref)
	}
	// Build css for webkit and moz;
	var cssPrefix = ['webkit', 'moz'];
	_.buildCSS = function (name, val) {
		var ret = {};
		ret[name] = val;
		_.forEach (cssPrefix, function (e) {
			ret['-' + e + '-' + name] = 'val';
		});
		return ret;
	}
	_.fire = function (ele, eve, arg) {
		ele.dispatchEvent (new Event(eve));
		return ele;
	};
	_.on   = function (ele, eve, cb) {
		ele.addEventListener (eve, cb, false);
		return ele;
	};
	_.click = function (ele, cb) {
		if (cb && _.isFun(cb))
			return _.on(ele, 'click', cb);
		return _.fire (ele, 'click');
	};
	_.cssSafe = function (ele, styleObj, noMoreTry) {
		// 没写特定浏览器匹配规则 :3
		for (x in styleObj) {
			try {
				ele.style[x.replace(/-(.)/g, function (a,xx) {return xx.toUpperCase ()})] = styleObj[x];
			} catch (e) {
				if (!noMoreTry) {
					_.cssSafe (ele, _.buildCSS (x, styleObj[x]), true)
				}
				console.warn (e);
			}
		}
	};
	_.appendSafe = function (ele, cont) {
		if (cont.nodeType)
			ele.appendChild (cont);
		else
			ele.appendChild (_.T(cont));
	};
	_.append = function (src) {
		for (var i = 1; i < arguments.length; i++)
			_.appendSafe (src, arguments[i]);
		return src;
	};
	_.$ = function (q) {
		return document.querySelector(q);
	};
	_.$$ = function (q, cb) {
		var ret = document.querySelectorAll (q);
		if (cb) _.forEach (ret, cb);
		return ret;
	};

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
			reg: function (floorCallback) {
				return floorCallbacks.indexOf (floorCallback) === -1
					&& floorCallbacks.push (floorCallback) - 1;
			},
			// 移除绑定异步加载的楼层函数
			// funcIndex: 回调函数序号
			// 返回值: 0 序号超出范围
			//		 1 正常
			rm: function (funcIndex) {
				return floorCallbacks.splice (funcIndex, 1).length;
			},
			// 初始化事件监听
			// postsDom: 可忽略; 传入一个 id 为 j_p_postlist 的元素, 用于监视事件。
			_init: function (postsDom) {
				mo.observe(postsDom || _.$('#j_p_postlist'), { childList: true });
			},
			// 销毁事件监听
			_destory: function () {
				if (mo) mo.disconnect();
			}
		};
	})();


	return {
		fl: floorLoader,
		_: _
	}
})();