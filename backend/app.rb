require 'sinatra'
require 'json'
require 'digest'
require 'securerandom'
require 'pp'
set :server, 'thin'

# pre-define some important helpers.
def created_time
  Time.now.to_f
end

def server_log(body)
  	PP.pp body
end

$global_users = {'username' => '249ba36000029bbe97499c03db5a9001f6b734ec'} #for debugging purpose!
$connections = {} #username ==> connection goes here.

$server_event_id = SecureRandom.hex(10)
$server_history = {
	$server_event_id => {
		"data" => {"status" => "Server Starts", "created" => created_time}.to_json, 
		"event" => "ServerStatus", 
		"id" => $server_event_id,
	},
}

##################Helpers####################
def global_broadcast(data, event, id)
	if($server_history.size >= 100)
		dumb = $server_history.shift
	end

	$server_history[id] = {
		"data" => data, 
		"event" => event, 
		"id" => id
	}

	$connections.each do |key, out|
		#server_log(broadcast_body)
        out << "data: " + data + "\nevent: " + event + "\nid: " + id + "\n\n\n"
    end
end

#TODO: find a better way to handle this function!
def history_broadcast(stream_object, last_event_id = nil)
	#server_log "LastEventID: [" + last_event_id.to_s + "]\n"
	if(last_event_id && $server_history.key?(last_event_id))
		#server_log "Last Event ID is found in history. perform search.\n"
		skip = true
		$server_history.each do |key, history|
			if(!skip && ["ServerStatus", "Message"].include?(history['event'])) 
				stream_object << "data: " + history['data'] + "\nevent: " + history['event'] + "\nid: " + history['id'] + "\n\n\n"
			end	

			#if found match event id, then we can print out all content after this!
			if(key == last_event_id)
				skip = false
			end 
		end
	else 
		$server_history.each do |key, history|
			#Broadcast ServerStatus & Message only! 
			if(["ServerStatus", "Message"].include?(history['event'])) 
				stream_object << "data: " + history['data'] + "\nevent: " + history['event'] + "\nid: " + history['id'] + "\n\n\n"
			end		
		end
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
		global_broadcast(data_hash.to_json, 'Join', SecureRandom.hex(10))
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
before do
  if request.request_method == 'OPTIONS'
  	response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST"
    response.headers["Access-Control-Allow-Headers"] = "Authorization"
    halt 204
  end
end

# This endpoint is used to grant a user an access token
post '/login' do
  	username = params['username']
  	password = params['password']

  	response['Access-Control-Allow-Origin'] = '*'
  	
  	#check if username or password is given.
  	if(username.to_s.length == 0 || password.to_s.length == 0)
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
  			return Array[403, "username or password does not macth!\n"]
  		end
  	end

  	response.headers['Content-Type'] = 'application/json'
  	resp_token = {"token" => signed_token}

  	return Array[201, resp_token.to_json + "\n"] 
end

# Send a message to all users of the chat system
post '/message' do
	response['Access-Control-Allow-Origin'] = '*'
	message = params['message'].strip
	if(message.length == 0)
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

	Message(message, username)

	return Array[201, "Created"]
end


get '/stream/:token', :provides => 'text/event-stream' do 
	response['Access-Control-Allow-Origin'] = '*'
	token = params['token']
	username = $global_users.key(token)
	if(username.nil?)
		return Array[403, "Invalid token."]
	end

	response.headers['Content-Type'] = 'text/event-stream; charset=utf-8'
	response.headers['Connection'] = 'keep-alive'
	stream(:keep_open) do |out|
		# Thanks to https://github.com/sinatra/sinatra/issues/448
		EventMachine::PeriodicTimer.new(20) { out << "\n" }
		print_join = true

		# Check if duplicate user connection here!
		# Disconnect the old connection if necessary!
		if !$connections[username].nil?
			print_join = false
			Disconnect(username)
		end 
	
		history_broadcast(out, request.env['HTTP_LAST_EVENT_ID'])

		# If last_event_id presents, then its an reconnection!
		# Do not print here then!
		if(request.env['HTTP_LAST_EVENT_ID']) 
			print_join = false
		end

		# Then process this new connection.
		$connections[username] = out
		Join(username, print_join)

		# Add call_back to detect Disconnection!
		out.callback { 
	    	closed_user = $connections.key(out)
	    	if !closed_user.nil?
		    	$connections.delete(closed_user)
		    	Part(closed_user)
		    end 
	    }
	end
end

