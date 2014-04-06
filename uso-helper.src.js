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
	_.isNum = function (num) {
		return 'number' == typeof num;
	};
	_.isStr = function (str) {
		return 'string' == typeof str;
	}
	// ARRAY
	_.forEach = _.each = function (arr, cb) {
		for (var i=0, r; i<arr.length; i++)
			r = cb (arr[i], i);
		return r;
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
		str = (str||'').trim();
		if (!str) return defValue;

		try {
			return JSON.parse (str);
		} catch (e) {
			return defValue || {};
		}
	}
	_.rm = function (ele) {
		if (ele.length) return _.each (ele, _.rm);
		return ele.parentNode && ele.parentNode.removeChild (ele);
	};
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
			_.each (ele, function (t) {css (t, attr)});
			return ele;
		}
		// debugger;
		if (_.isObj (attr)) {
			for (var x in attr) ele.style[x] = attr[x];
		} else if (arguments.length == 2) {
			return getComputedStyle(ele)[attr];
		} else {
			ele.style[attr] = val;
		}
		return ele;
	};
	_.ran = function () {
		return String.prototype.slice.apply(Math.random(), [2]);
	}
	_.opacity = function (ele, newOpacity) {
		if (arguments.length == 1)
			return _.css ('opacity')
		ele.display.opacity = newOpacity;
	};
	var animation = function (ele, animationName, delay, callback) {
		console.log (ele);
		var myId  = _.ran(),
			attrName = 'jx-animation-' + animationName,
			customCallback = function () {
				if (_.attr(ele, attrName) == myId && callback (ele, animationName, delay)) {
					setTimeout (customCallback, delay);
				}
			};
		_.attr(ele, attrName, myId);
		setTimeout (customCallback, delay);
	}, findSpeed = function (speed) {
		if (!speed) return 100;
		if (_.isNum(speed)) return speed;
		return speed == 'fast'
			? 10
			: 100;
	}
	_.fadeIn = function (ele, speed) {
		animation (ele, 'opacity', findSpeed(speed), function () {
			var o = parseFloat (_.css(ele, 'opacity'));
			if (1 != o) {
				_.css (ele, 'opacity', o + 0.05);
				return true;
			}
		});
	};
	_.fadeOut = function (ele, speed) {
		animation (ele, 'opacity', findSpeed(speed), function () {
			var o = parseFloat(_.css(ele, 'opacity'));
			if (0 != o) {
				_.css (ele, 'opacity', o - 0.05);
				return true;
			}
		});
	};
	_.show = function (ele) {
		ele.style.display = _.attr(ele, 'hide-method') || 'block';
	};
	_.hide = function (ele) {
		_.attr (ele, 'hide-method', _.css(ele, 'display'));
		_.css(ele, 'display')
		ele.style.display = 'none';
	};
	_.attr = function (ele, name, val) {
		if (ele.length) {
			_.each (ele, function (e) {
				_.attr(e, name, val);
			});
			return ele;
		}
		if (_.isObj (name)) {
			// { x: xx, .. }
			for (var x in name)
				ele.setAttribute (x, name[x]);
			return ele;
		}
		if (arguments.length == 2)
			return ele.getAttribute (name);

		ele.setAttribute (name, val);
		return ele;
	};
	_.insertAfter = function (what, ref) {
		ref.parentNode.insertBefore (what, ref.nextSibling)
	}
	_.insertBefore = function (what, ref) {
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
	_.filter = function (arr, cb) {
		if (arr.filter)
			return arr.filter(cb);
		if (!arr.length)
			return [];
		var ret = [];
		for (var i=0; i<arr.length; i++) {
			if (cb(arr[i]))
				ret.push (arr[i]);
		}
		return ret;
	}
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
				console.group ? console.group ('[floorLoader]') : console.log ('[floorLoader]');
				console.log (m);
				m.forEach (function (q, e, p) {
					_.each (q.addedNodes, function (t) {
						if (!t.className) return;

						var isLzl = 
							t.className.indexOf('lzl_single_post') !== -1
								? true
								: t.className.indexOf('l_post') !== -1
									? false
									: null;
						if (isLzl == null) return;

						floorCallbacks.forEach (function (fCallback) {
							fCallback (t, isLzl);
						});
					});
				});
				console.groupEnd && console.groupEnd ();
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
				mo.observe(postsDom || _.$('#j_p_postlist') || _.$('#thread_list'), {
					childList: true,
					// characterData: true,
					subtree: true
				});
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

var _ = USO._;
