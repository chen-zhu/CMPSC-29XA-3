(this["webpackJsonpchat-client"]=this["webpackJsonpchat-client"]||[]).push([[0],{50:function(e,t,a){e.exports=a(61)},55:function(e,t,a){},56:function(e,t,a){},61:function(e,t,a){"use strict";a.r(t);var s=a(0),n=a.n(s),i=a(8),r=a.n(i),o=(a(55),a(15)),c=a(16),l=a(26),u=a(25),m=a(27),h=(a(56),a(41)),d=a(43),g=new(function(){function e(){Object(o.a)(this,e),this.messageList=[],this.userList=[],this.url="",this.token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZ\u20263QifQ.AoSHHKEybm7_OLNLUtYHa8zt_9HBOUawbyqPaBU9BNc"}return Object(c.a)(e,[{key:"clearToken",value:function(){this.messageList=[],this.userList=[],this.token=""}},{key:"login",value:function(e,t,a){var s=this;return this.url=e,new Promise((function(e,n){var i=new FormData;i.append("password",a),i.append("username",t),console.log("[ChatService] login start"),fetch(s.url+"/login",{method:"POST",body:i}).then((function(t){console.log("[ChatService] login response:",t),201===t.status?t.json().then((function(t){console.log("[ChatService login get body:",t),s.token=t.token,e(!0)})):403===t.status?n("Invalid username or password"):n("fail to /login, status:",t.status)}),(function(e){n(e)}))}))}},{key:"_bindListener",value:function(e,t,a){var s=this;e.addEventListener(t,(function(e){var t=JSON.parse(e.data);a(t),s.callback({messageList:s.messageList,userList:s.userList})}),!1)}},{key:"initUsers",value:function(e){var t=new Set(e.users);this.userList=Object(d.a)(t)}},{key:"addUser",value:function(e){this.userList.push(e.user),this.messageList.push({type:"join",time:this.date_format(e.created),user:e.user})}},{key:"deleteUser",value:function(e){var t=e.user,a=this.userList;for(var s in a)if(a[s]==t){a.splice(s,1);break}this.messageList.push({type:"part",time:this.date_format(e.created),user:e.user})}},{key:"date_format",value:function(e){var t=new Date(1e3*e);return t.toLocaleDateString("en-US")+" "+t.toLocaleTimeString("en-US")}},{key:"addServerStatus",value:function(e){this.messageList.push({type:"status",time:this.date_format(e.created),status:e.status})}},{key:"addMessage",value:function(e){this.messageList.push({type:"msg",time:this.date_format(e.created),user:e.user,msg:e.message})}},{key:"listen",value:function(e,t,a){var s=this;console.log("[ChatService] listen"),this.callback=e;var n=new EventSource(this.url+"/stream/"+this.token);this._bindListener(n,"Users",this.initUsers.bind(this)),this._bindListener(n,"Join",this.addUser.bind(this)),this._bindListener(n,"Part",this.deleteUser.bind(this)),this._bindListener(n,"ServerStatus",this.addServerStatus.bind(this)),this._bindListener(n,"Disconnect",(function(){n.close(),t()})),this._bindListener(n,"Message",this.addMessage.bind(this)),n.addEventListener("error",(function(e){2==e.target.readyState&&(s.clearToken(),t())}),!1)}},{key:"send",value:function(e){var t=this;return new Promise((function(a,s){var n=new FormData;n.append("message",e);var i=new Headers;i.append("Authorization","Bearer ".concat(t.token)),console.log("[ChatService] send:",e),fetch(t.url+"/message",{method:"POST",headers:i,body:n}).then((function(e){a(e)}),(function(e){s(e)}))}))}}]),e}()),f=a(97),v=a(98),p=a(94),b=a(95),E=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).onSubmit=function(e){e.preventDefault(),console.log("submit"),g.login(a.state.url,a.state.username,a.state.password).then((function(e){a.props.afterLogin(!0)}),(function(e){alert(e)}))},a.onChange=function(e){console.log(e),a.setState(Object(h.a)({},e.target.id,e.target.value))},a.state={url:"http://chat.cs291.com",username:"test",password:"test"},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return n.a.createElement(f.a,{open:!0},n.a.createElement(v.a,null,"Enter Server URL to login"),n.a.createElement("div",{className:"login-modal"},n.a.createElement("form",{onSubmit:this.onSubmit},n.a.createElement(p.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,id:"url",label:"URL",autoFocus:!0,defaultValue:this.state.url,onChange:this.onChange}),n.a.createElement(p.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,id:"username",label:"Username",defaultValue:this.state.username,onChange:this.onChange}),n.a.createElement("br",null),n.a.createElement(p.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,label:"Password",type:"password",id:"password",defaultValue:this.state.password,onChange:this.onChange}),n.a.createElement("br",null),n.a.createElement(b.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary"},"LOGIN"))))}}]),t}(n.a.Component),L=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).scrollToBottom=function(){console.log("scrollToBottom"),setTimeout((function(){a.messagesEnd&&a.messagesEnd.scrollIntoView({behavior:"auto"})}),0)},a.onDataUpdate=function(e){a.setState({userList:e.userList,messageList:e.messageList}),e.messageList&&a.scrollToBottom()},a.onDisconnect=function(){a.props.onDisconnect()},a.onInputChange=function(e){a.setState({message:e.target.value})},a.onSend=function(e){e.preventDefault(),g.send(a.state.message).then((function(e){a.setState({message:""})}))},a.state={message:"",userList:[],messageList:[]},g.listen(a.onDataUpdate,a.onDisconnect),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;function t(e){var t=e.item;switch(t.type){case"status":return n.a.createElement("li",{className:"status-item"},n.a.createElement("p",{className:"time"},t.time," [STATUS]: ",t.status));case"join":return n.a.createElement("li",{className:"status-item"},n.a.createElement("p",{className:"time"},t.time," [JOIN]: ",t.user));case"part":return n.a.createElement("li",{className:"status-item"},n.a.createElement("p",{className:"time"},t.time," [PART]: ",t.user));case"msg":return n.a.createElement("li",{className:"item"},n.a.createElement("p",{className:"time"},t.time," ",t.user,":"),n.a.createElement("p",{className:"message"},t.msg));default:return n.a.createElement("li",null)}}return n.a.createElement("div",{className:"chat-window"},n.a.createElement("div",{className:"left"},n.a.createElement("div",{className:"top"},n.a.createElement("ul",{className:"message-list"},this.state.messageList.map((function(e,a){return n.a.createElement(t,{key:a,item:e})})),n.a.createElement("div",{style:{float:"left",clear:"both"},ref:function(t){e.messagesEnd=t}}))),n.a.createElement("div",{className:"bottom"},n.a.createElement("form",{className:"input-form",onSubmit:this.onSend},n.a.createElement("input",{name:"message",type:"text",onChange:this.onInputChange,value:this.state.message}),n.a.createElement("button",{type:"submit"},"send")))),n.a.createElement("div",{className:"right"},n.a.createElement("ul",{className:"user-list"},this.state.userList.map((function(e,t){return n.a.createElement("li",{key:t},e)})))))}}]),t}(n.a.Component),y=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).loginCallback=function(e){e&&a.setState({isLoggedIn:!0})},a.onDisconnect=function(){a.setState({isLoggedIn:!1})},a.state={isLoggedIn:!1},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e;return console.log("[App] render"),e=this.state.isLoggedIn?n.a.createElement(L,{onDisconnect:this.onDisconnect}):n.a.createElement(E,{afterLogin:this.loginCallback}),n.a.createElement("div",{className:"App"},n.a.createElement("div",{className:this.state.isLoggedIn?"content":"content snow"},e),n.a.createElement("div",{className:"logo"},"@CS291A"))}}]),t}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[50,1,2]]]);
//# sourceMappingURL=main.c7e34110.chunk.js.map