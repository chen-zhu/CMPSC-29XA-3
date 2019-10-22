class ChatService {

	constructor() {
	    this.url = '';
	}
	login(url, username, password) {
		console.log('[ChatService] login')
		this.url = url
		var request = new XMLHttpRequest();
	    var form = new FormData();
	    form.append("password", password);
	    form.append("username", username);
	    request.open("POST", url + "/login");
	    request.onreadystatechange = function() {
	    	console.log('========', this)
	        if (this.readyState != 4) return;
	        if (this.status === 201) {
	            // login_modal.style.display = "none";
	            // password.value = "";
	            // username.value = "";
	            // sessionStorage.accessToken = JSON.parse(this.responseText).token;
	            // this.listen();
	        } else if (this.status === 403) {
	            alert("Invalid username or password");
	        } else {
	            alert(this.status + " failure to /login");
	        }
	    };
	    request.send(form);
	}
	listen() {
		var source = new EventSource(this.url + '/stream');
		source.onopen = function (event) {
			console.log('onopen:', event)
		  // ...
		};
		source.onmessage = function (event) {
			console.log('onmessage:', event)

		  var data = event.data;
		  var origin = event.origin;
		  var lastEventId = event.lastEventId;
		  // handle message
		};
	}
}

export default new ChatService();