
class ChatService {
	constructor() {
		this.messageList = []
		this.userList = []

		this.url = ''
		this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZ…3QifQ.AoSHHKEybm7_OLNLUtYHa8zt_9HBOUawbyqPaBU9BNc'
	}
	clearToken() {
		this.messageList = []
		this.userList = []
		this.token = ''
	}
	
	login(url, username, password) {
		this.url = url
		
		return new Promise((resolve, reject) => {
			var form = new FormData();
			form.append("password", password);
			form.append("username", username);

			console.log('[ChatService] login start')

			fetch(this.url + "/login", {
				method: 'POST',
				body: form
			}).then(
				res => {

					console.log('[ChatService] login response:', res)

					if (res.status === 201) {
						res.json().then(body => {
							console.log('[ChatService login get body:', body)
							this.token = body.token
							resolve(true)
						});
					} else if (res.status === 403) {
						reject("Invalid username or password");
					} else {
						reject("fail to /login, status:", res.status);
					}
				},
				err => {
					reject(err)
				}
			)
		})
	}	
	_bindListener(source, name, handler) {
		source.addEventListener(name, event => {
			// console.log(`EventSource[${name}]:`, handler)

			var data = JSON.parse(event.data);
			// var origin = event.origin;
			// var lastEventId = event.lastEventId;
			handler(data)
			this.callback({
				messageList: this.messageList,
				userList: this.userList
			})
		}, false);
	}
	initUsers(data) {
		let users = new Set(data.users)
		this.userList = [...users]
	}
	addUser(data) {
		this.userList.push(data.user)
		this.messageList.push({
			type: 'join',
			time: this.date_format(data.created),
			user: data.user
		})
	}
	deleteUser(data) {
		let user = data.user
		let list = this.userList
		for(var i in list){
		    if(list[i] == user){
		        list.splice(i,1);
		        break;
		    }
		}
		this.messageList.push({
			type: 'part',
			time: this.date_format(data.created),
			user: data.user
		})
    }
    date_format(timestamp) {
	    var date = new Date(timestamp * 1000);
	    return (
	        date.toLocaleDateString("en-US") +
	        " " +
	        date.toLocaleTimeString("en-US")
	    );
	}
	addServerStatus(data) {
		this.messageList.push({
			type: 'status',
			time: this.date_format(data.created),
			status: data.status
		})
	}
	addMessage(data) {
		// console.log('addMessage:', this)
		this.messageList.push({
			type: 'msg',
			time: this.date_format(data.created),
			user: data.user,
			msg: data.message
		})

	}
	listen(callback, onDisconnect, onError) {
		console.log('[ChatService] listen')
		this.callback = callback
		var source = new EventSource(this.url + '/stream/' + this.token);
		// source.onopen = function (event) {
		// 	console.log('onopen:', event)
		// };

		this._bindListener(source, 'Users', this.initUsers.bind(this))
		this._bindListener(source, 'Join', this.addUser.bind(this))
		this._bindListener(source, 'Part', this.deleteUser.bind(this))
		this._bindListener(source, 'ServerStatus', this.addServerStatus.bind(this))
		this._bindListener(source, 'Disconnect', onDisconnect)
		this._bindListener(source, 'Message', this.addMessage.bind(this))

		source.addEventListener(
			"error",
			event => {
				if (event.target.readyState == 2) {
                	this.clearToken()
                	onDisconnect()
            	}
			},
			false
		);
	}
	send(message) {
		return new Promise((resolve, reject) => {
			var form = new FormData()
			form.append("message", message)

			var headers = new Headers()
			headers.append("Authorization", `Bearer ${this.token}`)


			console.log('[ChatService] send:', message)

			fetch(this.url + "/message", {
				method: 'POST',
				headers: headers,
				body: form
			}).then(
				res => {
					resolve(res)
				},
				err => {
					reject(err)
				}
			)
		})
	}
}

export default new ChatService();