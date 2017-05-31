(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function () {
    var Base = function Base() {};
    Base.prototype = {
        constructor: Base,
        baseAjax: function baseAjax(url, data, type, callback) {
            if (data === false) {
                $.ajax({
                    type: type,
                    url: url,
                    dataType: 'jsonp',
                    success: function success(data) {
                        callback(data);
                    }
                });
            } else {
                $.ajax({
                    type: type,
                    url: url,
                    data: data,
                    dataType: 'jsonp',
                    success: function success(data) {
                        callback(data);
                    }
                });
            }
        }
    };
    var base = {
        base: function base() {
            return new Base();
        }
    };

    var isFinish = true;
    var session;
    var InputMainBox = React.createClass({
        displayName: 'InputMainBox',

        mixins: [base], //此代码块要复用，所以采用mixins
        propTypes: {
            userid: React.PropTypes.string.isRequired,
            password: React.PropTypes.string.isRequired,
            inputChangeWatch: React.PropTypes.func.isRequired
        },
        getInitialState: function getInitialState() {
            return {
                ifRemember: true
            };
        },
        loadVerCode: function loadVerCode() {
            this.base().baseAjax("http://localhost:4000/verCode", false, "GET", function (data) {
                // console.log(data);
                if (!data.error) {
                    this.refs.verCodeImg.src = data.result.verCode;
                    session = data.result.session;
                }
            }.bind(this));
        },
        componentWillMount: function componentWillMount() {
            this.loadVerCode();
        },
        trim: function trim(str) {
            return str.replace(/[ ]/g, "");
        },
        checkUserInput: function checkUserInput(inputData) {
            var flag = false;
            for (var name in inputData) {
                var thisData = this.trim(inputData[name]);
                if (!thisData) {
                    flag = true;
                    alert("不允许账号或密码或验证码为空！");
                    return flag;
                } else {
                    var result = thisData.search(/select|insert|update|delete|union|into|load_file|outfile/);
                    if (result != -1) {
                        flag = true;
                        alert("输入字符非法!");
                        return flag;
                    }
                }
            }
        },
        loginClickHandle: function loginClickHandle() {
            var studentData = {
                userid: this.props.userid,
                password: this.props.password,
                verCode: this.refs.verCodeTxt.value,
                session: session
            };
            var checkResult = this.checkUserInput(studentData);
            if (checkResult === true) {
                return;
            }
            if (isFinish) {
                isFinish = false;
                this.base().baseAjax("http://localhost:4000/login", studentData, "GET", function (data) {
                    isFinish = true;
                    console.log(data);
                    if (!data.error) {
                        if (this.state.ifRemember) {
                            var oDate = new Date();
                            oDate.setDate(oDate.getDate() + 30);
                            document.cookie = "userid=" + escape(studentData.userid) + "; expires=" + oDate.toGMTString();
                            document.cookie = "password=" + escape(studentData.password) + "; expires=" + oDate.toGMTString();
                            // $.cookie("userid",studentData.userid,{expires:1});
                            // $.cookie("password",studentData.password,{expires:1});
                            document.cookie = "ifRemember=true ; expires=" + oDate.toGMTString();
                            // $.cookie("ifRemember",true,{expires:1});
                        } else {
                            document.cookie = "ifRemember=false ; expires=-1";
                            // $.cookie("ifRemember",{expires:-1});
                        }
                        var cookie = data.result.cookie;
                        var totalSession = session + "; " + cookie;
                        // console.log(totalSession);
                        window.location.href = "main.html?sessionId=" + escape(totalSession) + "&username=" + escape(data.result.name) + "&class=" + escape(data.result.class);
                    } else {
                        alert(data.result);
                    }
                }.bind(this));
            } else {
                alert("点击频率太快，反应不过来哇！");
            }
        },
        rememberClickHandle: function rememberClickHandle() {
            if (this.state.ifRemember) {
                this.refs.remember.checked = true;
            } else {
                this.refs.remember.checked = false;
            }
            this.setState({
                ifRemember: !this.state.ifRemember
            });
        },
        verCodeImgClickHandle: function verCodeImgClickHandle() {
            this.loadVerCode();
        },
        render: function render() {
            return React.createElement(
                'div',
                { id: 'inputMainBox' },
                React.createElement(
                    'div',
                    { id: 'inputBox' },
                    React.createElement('input', { type: 'text', id: 'userid', onChange: this.props.inputChangeWatch, value: this.props.userid, placeholder: '\u8D26\u53F7' }),
                    React.createElement('input', { type: 'password', id: 'password', onChange: this.props.inputChangeWatch, value: this.props.password, placeholder: '\u5BC6\u7801' }),
                    React.createElement('input', { type: 'text', id: 'verCodeTxt', ref: 'verCodeTxt', placeholder: '\u9A8C\u8BC1\u7801' }),
                    React.createElement('img', { src: '', id: 'verCodeImg', ref: 'verCodeImg', onClick: this.verCodeImgClickHandle })
                ),
                React.createElement(
                    'div',
                    { id: 'remember' },
                    React.createElement('input', { type: 'checkbox', ref: 'remember', onClick: this.rememberClickHandle, checked: this.state.ifRemember }),
                    React.createElement(
                        'div',
                        { className: 'rememberTxt' },
                        '\u8BB0\u4F4F\u5BC6\u7801'
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'loginButton', onClick: this.loginClickHandle },
                    '\u767B\u9646'
                )
            );
        }
    });

    var LoginContainer = React.createClass({
        displayName: 'LoginContainer',

        getInitialState: function getInitialState() {
            return {
                userid: "",
                password: ""
            };
        },
        componentWillMount: function componentWillMount() {
            var arrCookie = document.cookie.split(";");
            var userid, password, ifRemember;
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if ("userid" == arr[0]) {
                    userid = unescape(arr[1]);
                }
                if (" password" == arr[0]) {
                    password = unescape(arr[1]);
                }
                if (" ifRemember" == arr[0]) {
                    ifRemember = arr[1];
                }
            }

            if (ifRemember == "true") {
                this.setState({
                    userid: userid,
                    password: password
                });
            }
        },
        componentDidMount: function componentDidMount() {
            this.refs.login.style.height = document.documentElement.clientHeight + "px";
        },
        inputChangeWatch: function inputChangeWatch(e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            var targetId = target.id;
            if (targetId == "userid") {
                this.setState({
                    userid: target.value
                });
            } else if (targetId == "password") {
                this.setState({
                    password: target.value
                });
            }
        },
        render: function render() {
            return React.createElement(
                'div',
                { id: 'login', ref: 'login' },
                React.createElement(
                    'div',
                    { id: 'title' },
                    '\u897F\u67DA\u8BFE\u8868'
                ),
                React.createElement(InputMainBox, _extends({}, this.state, { inputChangeWatch: this.inputChangeWatch }))
            );
        }

    });
    ReactDOM.render(React.createElement(LoginContainer, null), document.getElementById("loginBox"));
})();

},{}]},{},[1]);
