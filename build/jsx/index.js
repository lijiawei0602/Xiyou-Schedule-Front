(function(){
    var Base = function(){};
    Base.prototype = {
        constructor : Base,
        baseAjax : function(url, data, type, callback){
            if(data === false){
                 $.ajax({
                    type : type,
                    url : url,
                    dataType : 'jsonp',
                    success : function(data){
                        callback(data);
                    }
                });
            }else{
                 $.ajax({
                    type : type,
                    url : url,
                    data : data,
                    dataType : 'jsonp',
                    success : function(data){
                        callback(data);
                    }
                });
            }
        }
    };
    var base = {
        base : function(){
            return new Base();
        }
    };

    var isFinish = true;
    var session;
    var InputMainBox = React.createClass({
        mixins:[base],//此代码块要复用，所以采用mixins
        propTypes:{
            userid:React.PropTypes.string.isRequired,
            password:React.PropTypes.string.isRequired,
            inputChangeWatch : React.PropTypes.func.isRequired
        },
        getInitialState:function(){
            return {
                ifRemember:true
            };
        },
        loadVerCode:function(){
            this.base().baseAjax("http://localhost:4000/verCode",false,"GET",(function (data){
                // console.log(data);
                if(!data.error){
                    this.refs.verCodeImg.src=data.result.verCode;
                    session = data.result.session;
                }
            }).bind(this));
        },
        componentWillMount:function(){
            this.loadVerCode();
        },
        trim:function(str){
            return str.replace(/[ ]/g , "");
        },
        checkUserInput:function(inputData){
            var flag = false;
            for(var name in inputData){
                var thisData = this.trim(inputData[name]);
                if(!thisData){
                    flag = true;
                    alert("不允许账号或密码或验证码为空！");
                    return flag;
                }else{
                    var result = thisData.search(/select|insert|update|delete|union|into|load_file|outfile/);
                    if(result != -1){
                        flag = true;
                        alert("输入字符非法!");
                        return flag;
                    }
                }
            }
        },
        loginClickHandle:function(){
            var studentData = {
                userid:this.props.userid,
                password:this.props.password,
                verCode:this.refs.verCodeTxt.value,
                session:session
            };
            var checkResult = this.checkUserInput(studentData);
            if(checkResult === true){
                return;
            }
            if(isFinish){
                isFinish = false;
                this.base().baseAjax("http://localhost:4000/login",studentData,"GET" , (function (data){
                    isFinish = true;
                    console.log(data);
                    if(!data.error){
                        if(this.state.ifRemember){
                            var oDate = new Date();
                            oDate.setDate(oDate.getDate() + 30);
                            document.cookie = "userid=" + escape(studentData.userid) + "; expires=" + oDate.toGMTString();
                            document.cookie = "password=" + escape(studentData.password) + "; expires=" + oDate.toGMTString();
                            // $.cookie("userid",studentData.userid,{expires:1});
                            // $.cookie("password",studentData.password,{expires:1});
                            document.cookie = "ifRemember=true ; expires=" + oDate.toGMTString();
                            // $.cookie("ifRemember",true,{expires:1});
                        }else{
                            document.cookie = "ifRemember=false ; expires=-1";
                            // $.cookie("ifRemember",{expires:-1});
                        }
                        var cookie = data.result.cookie;
                        var totalSession = session +"; "+cookie;
                        // console.log(totalSession);
                        window.location.href  = "main.html?sessionId="+escape(totalSession)+"&username="+escape(data.result.name)+"&class="+escape(data.result.class);
                    }else{
                        alert(data.result);
                    }
                }).bind(this));
            }else{
                alert("点击频率太快，反应不过来哇！");
            }
        },
        rememberClickHandle:function(){
            if(this.state.ifRemember){
                this.refs.remember.checked = true;
            }else{
                this.refs.remember.checked = false;
            }
            this.setState({
                ifRemember: !this.state.ifRemember
            });
        },
        verCodeImgClickHandle:function(){
            this.loadVerCode();
        },
        render:function(){
            return (
                <div id="inputMainBox">
                    <div id="inputBox">
                        <input type="text" id="userid" onChange={this.props.inputChangeWatch} value={this.props.userid} placeholder="账号" />
                        <input type="password" id="password" onChange={this.props.inputChangeWatch} value={this.props.password} placeholder="密码" />
                        <input type="text" id="verCodeTxt" ref="verCodeTxt" placeholder="验证码"/>
                        <img src="" id="verCodeImg" ref="verCodeImg" onClick={this.verCodeImgClickHandle} />
                    </div>
                    <div id="remember">
                        <input type="checkbox" ref="remember" onClick={this.rememberClickHandle} checked={this.state.ifRemember} />
                        <div className="rememberTxt">记住密码</div>
                    </div>
                    <div id="loginButton" onClick={this.loginClickHandle}>登陆</div>
                </div>
            );
        }
    });

    var LoginContainer = React.createClass({
        getInitialState:function(){
            return {
                userid:"",
                password:""
            };
        },
        componentWillMount:function(){
            var arrCookie = document.cookie.split(";");
            var userid,password,ifRemember;
            for(var i=0;i<arrCookie.length;i++){
                var arr = arrCookie[i].split("=");
                if("userid" == arr[0]){
                    userid = unescape(arr[1]);
                }
                if(" password" == arr[0]){
                    password = unescape(arr[1]);
                }
                if(" ifRemember" == arr[0]){
                    ifRemember = arr[1];
                }
            }

            if(ifRemember == "true"){
                this.setState({
                    userid:userid,
                    password:password
                });
            }
        },
        componentDidMount:function(){
            this.refs.login.style.height = document.documentElement.clientHeight + "px";

        },
        inputChangeWatch:function(e){
            var e = e || window.event;
            var target = e.target || e.srcElement;
            var targetId = target.id;
            if(targetId == "userid"){
                this.setState({
                    userid:target.value
                });
            }else if(targetId == "password"){
                this.setState({
                    password:target.value
                });
            }
        },
        render:function(){
            return (
                <div id="login" ref="login">
                    <div id="title">
                    西柚课表
                    </div>
                    <InputMainBox {...this.state} inputChangeWatch={this.inputChangeWatch} />
                </div>
            );
        }

    });
    ReactDOM.render(
        <LoginContainer />,
        document.getElementById("loginBox")
    );
})();