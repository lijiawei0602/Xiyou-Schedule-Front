(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
	var Base = function Base() {};
	Base.prototype = {
		constructor: Base,
		baseAjax: function baseAjax(url, data, type, callback) {
			$.ajax({
				url: url,
				data: data,
				type: type,
				dataType: "jsonp",
				success: function success(data) {
					callback(data);
				}
			});
		}
	};

	var base = {
		base: function base() {
			return new Base();
		},
		getSession: function getSession() {
			var str = window.location.search;
			var index = str.indexOf("sessionId");
			var index2 = str.indexOf("&username");
			var x = index2 - (index + 10);
			if (index == -1) {
				return null;
			} else {
				var session = str.substr(index + 10, x);
				return session;
			}
		},
		getUserName: function getUserName() {
			var str = window.location.search;
			var index = str.indexOf("username");
			var index2 = str.indexOf("&class");
			var x = index2 - (index + 9);
			if (index == -1) {
				return null;
			} else {
				var username = str.substr(index + 9, x);
				return username;
			}
		},
		getClass: function getClass() {
			var str = window.location.search;
			var index = str.indexOf("class");
			if (index == -1) {
				return null;
			} else {
				var classname = str.substr(index + 6);
				return classname;
			}
		}
	};

	var ScheduleTop = React.createClass({
		displayName: "ScheduleTop",

		propTypes: {
			username: React.PropTypes.string.isRequired,
			classname: React.PropTypes.string.isRequired
		},
		componentWillMount: function componentWillMount() {//服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用
		},
		componentDidMount: function componentDidMount() {//在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）
		},
		componentWillReceiveProps: function componentWillReceiveProps() {//在组件接收到新的 props 的时候调用
		},
		componentWillUpdate: function componentWillUpdate() {//组件接收到新的props或者state之前调用
		},
		componentDidUpdate: function componentDidUpdate() {
			//组件的更新同步到DOM后调用
			this.refs.topTitle.innerText = this.props.classname + this.props.username + "";
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
			//在接收到新的 props 或者 state，将要渲染之前调用
			return nextProps.username !== this.props.username || nextProps.classname !== this.props.classname;
		},
		backClickHandle: function backClickHandle() {
			if (confirm("确定退出吗？")) {
				$.cookie("userid", null);
				$.cookie("password", null);
				window.location.href = 'index.html';
			}
		},
		render: function render() {
			return React.createElement(
				"div",
				{ id: "top" },
				React.createElement("p", { ref: "topTitle", id: "topTitle" }),
				React.createElement(
					"div",
					{ ref: "topTitleBack", id: "topTitleBack", onClick: this.backClickHandle },
					"\u9000\u51FA"
				)
			);
		}
	});

	var ScheduleMain = React.createClass({
		displayName: "ScheduleMain",

		propTypes: {
			scheduleData: React.PropTypes.array.isRequired
		},
		getInitialState: function getInitialState() {
			return {
				nowWeek: ""
			};
		},
		componentWillMount: function componentWillMount() {
			var nowWeek = new Date().getDay();
			this.setState({
				nowWeek: nowWeek
			});
		},
		touchHandle: function touchHandle() {
			var that = this;
			var week = this.state.nowWeek - 1;
			var width = document.documentElement.clientWidth;
			that.refs.slider.style.left = -week * width + "px";
			var slider = {
				//判断设备是否支持touch事件
				touch: "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
				slider: that.refs.slider,
				events: {
					width: width,
					index: week,
					slider: this.slider,
					startPos: '',
					endPos: '',
					isScrolling: -1, //用于判断是横向滑动还是纵向滑动  0：横向 1：纵向
					handleEvent: function handleEvent(event) {
						var self = this;
						if (event.type == 'touchstart') {
							self.start(event);
						} else if (event.type == 'touchmove') {
							self.move(event);
						} else if (event.type == "touchend") {
							self.end(event);
						}
					},
					start: function start(event) {
						var touch = event.targetTouches[0];
						this.startPos = { x: touch.pageX, y: touch.pageY };
						that.refs.slider.addEventListener("touchmove", this, false);
						that.refs.slider.addEventListener("touchend", this, false);
					},
					move: function move(event) {
						//当屏幕有多个touch或者页面被锁放过，就不执行move操作
						if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) {
							return;
						}
						var touch = event.targetTouches[0];
						this.endPos = { x: touch.pageX - this.startPos.x, y: touch.pageY - this.startPos.y };
						this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0; //0为横向滑动，1为纵向滑动
						if (this.isScrolling === 0) {
							event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
							that.refs.slider.className = "cnt";
							that.refs.slider.style.left = -this.index * this.width + this.endPos.x + "px";
						}
					},
					end: function end(event) {
						if (this.isScrolling === 0) {
							if (this.endPos.x > 10) {
								//向右滑动偏移量大于10
								if (this.index !== 0) {
									this.index -= 1;
								}
							} else if (this.endPos.x < -10) {
								//向左滑动偏移量大于10
								if (this.index !== 4) {
									this.index += 1;
								}
							}
							that.refs.slider.className = "cnt f-anim";
							that.refs.slider.style.left = -this.index * this.width + "px";
						}
						that.refs.slider.removeEventListener("touchmove", this, false);
						that.refs.slider.removeEventListener("touchend", this, false);
					}
				},
				init: function init() {
					var self = this;
					if (self.touch) {
						//addEventListener的第二个参数为一个对象的时候，会调用对象里的handleEvent属性
						self.slider.addEventListener("touchstart", self.events, false);
					}
				}
			};
			slider.init();
		},
		componentDidMount: function componentDidMount() {
			this.touchHandle();
		},
		shouldUpdateComponent: function shouldUpdateComponent(nextProps) {
			return nextProp.scheduleData !== this.props.scheduleData;
		},
		render: function render() {
			return React.createElement(
				"div",
				{ className: "m-slider" },
				React.createElement(
					"ul",
					{ className: "cnt", id: "slider", ref: "slider" },
					this.props.scheduleData.map(function (value, index) {
						var str, strSchedule1, strSchedule2, strSchedule3, strSchedule4, strData1, strData2, strData3, strData4;
						switch (index) {
							case 0:
								str = "星期一";break;
							case 1:
								str = "星期二";break;
							case 2:
								str = "星期三";break;
							case 3:
								str = "星期四";break;
							case 4:
								str = "星期五";break;
							default:
								break;
						}
						if (!value['1-2']['scheduleName']) {
							strSchedule1 = "无课";
							strData1 = "";
						} else {
							strSchedule1 = value['1-2']['scheduleName'];
							strData1 = value['1-2']['classRoom'] + " " + value['1-2']['teacher'];
						}
						if (!value['3-4']['scheduleName']) {
							strSchedule2 = "无课";
							strData2 = "";
						} else {
							strSchedule2 = value['3-4']['scheduleName'];
							strData2 = value['3-4']['classRoom'] + " " + value['3-4']['teacher'];
						}
						if (!value['5-6']['scheduleName']) {
							strSchedule3 = "无课";
							strData3 = "";
						} else {
							strSchedule3 = value['5-6']['scheduleName'];
							strData3 = value['5-6']['classRoom'] + " " + value['5-6']['teacher'];
						}
						if (!value['7-8']['scheduleName']) {
							strSchedule4 = "无课";
							strData4 = "";
						} else {
							strSchedule4 = value['7-8']['scheduleName'];
							strData4 = value['7-8']['classRoom'] + " " + value['7-8']['teacher'];
						}

						return React.createElement(
							"li",
							{ key: index },
							React.createElement(
								"div",
								{ id: "cardTop" },
								str
							),
							React.createElement(
								"div",
								{ id: "cardMain" },
								React.createElement(
									"p",
									{ className: "per" },
									"1-2",
									React.createElement(
										"span",
										{ "data-attr": strData1 },
										strSchedule1
									)
								),
								React.createElement(
									"p",
									{ className: "per" },
									"3-4",
									React.createElement(
										"span",
										{ "data-attr": strData2 },
										strSchedule2
									)
								),
								React.createElement(
									"p",
									{ className: "per" },
									"5-6",
									React.createElement(
										"span",
										{ "data-attr": strData3 },
										strSchedule3
									)
								),
								React.createElement(
									"p",
									{ className: "per" },
									"7-8",
									React.createElement(
										"span",
										{ "data-attr": strData4 },
										strSchedule4
									)
								)
							)
						);
					}.bind(this))
				)
			);
		}
	});

	// var ScheduleBottom = React.createClass({

	// });
	var Sehedule = React.createClass({
		displayName: "Sehedule",

		mixins: [base],
		getInitialState: function getInitialState() {
			return {
				scheduleData: [],
				nowWeek: "",
				username: "",
				classname: ""
			};
		},
		componentWillMount: function componentWillMount() {
			var session = this.getSession();
			if (!session) {
				alert("请先登录!");
				window.location.href = "index.html";
			} else {
				var data = { session: session };
				var username = this.getUserName();
				var classname = this.getClass();

				this.base().baseAjax("http://localhost:4000/info", data, "GET", function (data) {
					console.log(data);
					if (data.error === false) {
						this.setState({
							username: unescape(username),
							classname: unescape(classname),
							scheduleData: data.result
						});
					}
				}.bind(this));
			}
		},
		componentDidMount: function componentDidMount() {
			this.refs.mainBox.style.height = document.documentElement.clientHeight + "px";
		},
		render: function render() {
			return React.createElement(
				"div",
				{ ref: "mainBox", style: { backgroundColor: "#F2F2F2" } },
				React.createElement(ScheduleTop, { username: this.state.username, classname: this.state.classname }),
				React.createElement(ScheduleMain, { scheduleData: this.state.scheduleData })
			);
		}
	});

	ReactDOM.render(React.createElement(Sehedule, null), document.getElementById("container"));
})();

},{}]},{},[1]);
