(function(){
	var Base = function(){};
	Base.prototype = {
		constructor:Base,
		baseAjax:function(url,data,type,callback){
			$.ajax({
				url:url,
				data:data,
				type:type,
				dataType:"jsonp",
				success:function(data){
					callback(data);
				}
			});
		}
	};

	var base ={
		base:function(){
			return new Base();
		},
		getSession:function(){
			var str = window.location.search;
			var index = str.indexOf("sessionId");
			var index2 = str.indexOf("&username");
			var x = index2 - (index + 10);
			if(index == -1){
				return null;
			}else{
				var session = str.substr(index+10,x);
				return session;
			}

		},
		getUserName:function(){
			var str=window.location.search;
			var index = str.indexOf("username");
			var index2 = str.indexOf("&class");
			var x = index2 - (index + 9);
			if(index == -1){
				return null;
			}else{
				var username = str.substr(index+9,x);
				return username;
			}
		},
		getClass:function(){
			var str=window.location.search;
			var index = str.indexOf("class");
			if(index == -1){
				return null;
			}else{
				var classname = str.substr(index+6);
				return classname;
			}
		}
	};

	var ScheduleTop = React.createClass({
		mixins:[base],
		propTypes:{
			username:React.PropTypes.string.isRequired,
			classname:React.PropTypes.string.isRequired
		},
		shouldUpdateComponent:function(nextProps){
			return (nextProps.username !== this.props.username || nextProps.classname !== this.props.classname);
		},
		backClickHandle:function(){
			window.location.href = "index.html";
		},
		render:function(){
			return (
				<div id="top">
					<p id="topTitle">{this.props.classname}{this.props.username}</p>
					<div id="topTitleBack" onClick={this.backClickHandle}>退出</div>
				</div>
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
		mixins:[base],
		getInitialState:function(){
			return{
				scheduleData:{},
				nowWeek:"",
				username:"",
				classname:"",
			};
		},
		componentWillMount:function(){
			var session = this.getSession();
			if(!session){
				alert("请先登录!");
				window.location.href="index.html";
			}
			else{
				var data = {session:session};
				var username = this.getUserName();
				var classname = this.getClass();
				var week = new Date().getDay();

				this.base().baseAjax("http://localhost:4000/info",data,"GET",(function (data){
					console.log(data);
					if(data.error === false){
						this.setState({
							username:unescape(username),
							classname:unescape(classname),
							nowWeek:week,
							scheduleData:data.result
						});
					}
				}.bind(this)));
			}
		},
		render:function(){
			return (
				<div>
					<ScheduleTop username={this.state.username} classname={this.state.classname} />
					{/*<ScheduleMain scheduleData={this.state.scheduleData} />
					<ScheduleBottom />*/}
				</div>
			);
		}
	});
	
	ReactDOM.render(
		<Sehedule />,
		document.getElementById("container")
	);
})();