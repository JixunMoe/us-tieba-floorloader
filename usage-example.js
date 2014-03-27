// ==UserScript==
// @name        贴吧楼层捕捉
// @namespace   http://jixun.org/
// @description 捕捉動態加載的樓層
// @include     http://tieba.baidu.com/*
// @version     1
// @grant       none
// ==/UserScript==

// 用法演示
// 注: floorLoader.init 应在 DOMContentLoaded/load 事件后被调用
floorLoader.init ();
floorLoader.regFloor (function (floor) {
	console.log (
		'抓到一只回复; [%s]: %s',
		floor.querySelector('.p_author_name').textContent,
		(function (str) {
			return str.length < 15 ? str : str.slice (0, 13) + '…';
		})(floor.querySelector ('.d_post_content').textContent.replace(/(^\s*|\s*$)/g, ''))
	);
});