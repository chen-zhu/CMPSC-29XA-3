require 'sinatra'
require 'json'
require 'digest'
require 'securerandom'
require 'pp'
set :server, 'thin'

# pre-define some helpers.
def created_time
  Time.now.to_f
end

def server_log(body)
  	PP.pp body
end

$server_start = "data: " + {"status" => "Server start", "created" => created_time}.to_json + "\nevent: ServerStatus\nid: " + SecureRandom.hex(10) + "\n\n"
$global_users = {'username' => 'token_goes_here'}
$server_history = [$server_start]
$connections = {} #username ==> connection goes here.

##################Helpers####################
def global_broadcast(data, event, id)
	broadcast_body = "data: " + data + "\nevent: " + event + "\nid: " + id + "\n\n"

	if($server_history.size >= 100)
		dumb = $server_history.shift
	end

	$server_history << broadcast_body

	$connections.each do |key, out|
		#server_log(broadcast_body)
        out << broadcast_body
    end
end

def history_broadcast(stream_object)
	$server_history.each do |history|
		stream_object << history
	end
end

#disconnect is only used for connections that are duplicated by a single user. 
def Disconnect(user)
	data_hash = {
	#	"user" => user, 
		"created" => created_time
	}
	
	out = $connections[user]
	out << "data: " + data_hash.to_json + "\nevent: Disconnect\nid: " + SecureRandom.hex(10) + "\n\n"
	out.close
	$connections.delete(user)
end

def Users(users_array)
	data_hash = {
		"users" => users_array, 
		"created" => created_time
	}
	global_broadcast(data_hash.to_json, 'Users', SecureRandom.hex(10))
end

def Join(user, print_join)
	if print_join
		data_hash = {
			"user" => user, 
			"created" => created_time
		}
		global_broadcast(data_hash.to_json, 'Joins', SecureRandom.hex(10))
	end 

	#also broadcast users here!
	Users($connections.keys)
end

def Message(message, user)
	data_hash = {
		"message" => message,
		"user" => user, 
		"created" => created_time
	}
	global_broadcast(data_hash.to_json, 'Message', SecureRandom.hex(10))
end

def Part(user)
	data_hash = {
		"user" => user, 
		"created" => created_time
	}
	global_broadcast(data_hash.to_json, 'Part', SecureRandom.hex(10))

	Users($connections.keys)
end

def ServerStatus(status)
	data_hash = {
		"status" => status, 
		"created" => created_time
	}
	global_broadcast(data_hash.to_json, 'ServerStatus', SecureRandom.hex(10))
end


##################API Endpoints####################
# This endpoint is used to grant a user an access token
post '/login' do
  	username = params['username']
  	password = params['password']
  	
  	#check if username or password is given.
  	if(username.nil? || password.nil? )
  		return Array[422, "Username or Password is blank!"]
  	end

  	signed_token = Digest::SHA1.hexdigest password

  	if($global_users[username].nil?) 
  		#if user does not exist!
  		#insert user first.
  		$global_users[username] = signed_token
  	else 
  		#user exist, then validate username and password here!
  		if($global_users[username] != signed_token)
  			return Array[403, "username or password does not macth!"]
  		end
  	end

  	response = {"token" => signed_token}

  	return Array[201, response.to_json] #use explicit return here!
end

# Send a message to all users of the chat system
post '/message' do
	message = params['message']
	if(message.nil?)
		return Array[422, "No message provided."]
	end

	if(env['HTTP_AUTHORIZATION'].nil?)
		return Array[403, "No Bearer token provided."]
	end

	token = env['HTTP_AUTHORIZATION'].split('Bearer ')[1]
	if(token.nil?)
		return Array[403, "No Bearer token provided."]
	end
	
	username = $global_users.key(token)
	if(username.nil?)
		return Array[403, "Invalid token."]
	end

	#TODO: Trigger stream action to post message here!
	Message(message, username)

	return Array[201, "Created"]
end


get '/stream/:token', :provides => 'text/event-stream' do 
	token = params['token']
	username = $global_users.key(token)
	if(username.nil?)
		return Array[403, "Invalid token."]
	end

	response.headers['Content-Type'] = 'text/event-stream'
	response.headers['Connection'] = 'keep-alive'
	stream(:keep_open) do |out|
		#Thanks to https://github.com/sinatra/sinatra/issues/448
		EventMachine::PeriodicTimer.new(20) { out << "\0" }
		print_join = true

		#check if duplicate user connection here!
		#disconnect the old connection if necessary!
		if !$connections[username].nil?
			print_join = false
			Disconnect(username)
		end 
	
		history_broadcast(out)

		#then process this new connection.
		$connections[username] = out
		#server_log($connections.key(out))
		Join(username, print_join)
		#add call_back to detect Disconnection!
		out.callback { 
	    	closed_user = $connections.key(out)
	    	if !closed_user.nil?
		    	$connections.delete(closed_user)
		    	Part(closed_user)
		    end 
	    }
	end
end

