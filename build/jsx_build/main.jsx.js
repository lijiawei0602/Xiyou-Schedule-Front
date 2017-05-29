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

		mixins: [base],
		propTypes: {
			username: React.PropTypes.string.isRequired,
			classname: React.PropTypes.string.isRequired
		},
		shouldUpdateComponent: function shouldUpdateComponent(nextProps) {
			return nextProps.username !== this.props.username || nextProps.classname !== this.props.classname;
		},
		backClickHandle: function backClickHandle() {
			window.location.href = "index.html";
		},
		render: function render() {
			return React.createElement(
				"div",
				{ id: "top" },
				React.createElement(
					"p",
					{ id: "topTitle" },
					this.props.classname,
					this.props.username
				),
				React.createElement(
					"div",
					{ id: "topTitleBack", onClick: this.backClickHandle },
					"\u9000\u51FA"
				)
			);
		}
	});

	// var ScheduleMain = React.createClass({
	// 	propTypes:{
	// 		scheduleData:React.PropTypes.object.isRequired
	// 	},
	// 	shouldUpdateComponent:function(nextProps){
	// 		return nextProp.scheduleData !== this.props.scheduleData;
	// 	},
	// 	componentWillMount:function(){

	// 	},
	// 	conponentDidMount:function(){

	// 	},
	// 	render:function(){
	// 		return (
	// 			<div className="m-slider">
	// 				<ul className="cnt" id="slider">
	// 					{
	// 						this.prop.scheduleData.map(function(value,index){
	// 							return (
	// 								<li>
	// 									<div id="cardTop">
	// 										{value.}
	// 									</div>
	// 									<div>
	// 										<p>1-2<span>{value.}</span></P>
	// 										<p>3-4<span>{value.}</span></p>
	// 										<p>5-6<span>{value.}</span></P>
	// 										<p>7-8<span>{value.}</span></p>
	// 									</div>
	// 								</li>
	// 							);
	// 						});
	// 					}
	// 				</ul>
	// 			</div>
	// 		);
	// 	}
	// });

	// var ScheduleBottom = React.createClass({

	// });
	var Sehedule = React.createClass({
		displayName: "Sehedule",

		mixins: [base],
		getInitialState: function getInitialState() {
			return {
				scheduleData: {},
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
				var week = new Date().getDay();

				this.base().baseAjax("http://localhost:4000/info", data, "GET", function (data) {
					console.log(data);
					if (data.error === false) {
						this.setState({
							username: unescape(username),
							classname: unescape(classname),
							nowWeek: week,
							scheduleData: data.result
						});
					}
				}.bind(this));
			}
		},
		render: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(ScheduleTop, { username: this.state.username, classname: this.state.classname })
			);
		}
	});

	ReactDOM.render(React.createElement(Sehedule, null), document.getElementById("container"));
})();

},{}]},{},[1]);
