require 'sinatra'
require 'json'
require 'digest'

# global_users: {username => Digest::SHA1.hexdigest password}
$global_users = {')(*&^Dummy' => ')(*&^Dummy'}
$server_history = {}
$connections = [] #username ==> connection goes here.


##################Defs####################
def server_log(body)
	require 'pp'
  	PP.pp body
end

def global_broadcast(data, event, id)
	$connections.each do |out|
        out << body
    end
end

def lookup_user(token)

end


##################APIs####################
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

  	#TODO: Trigger broadcast JOIN.
  	#TODO: Trigger Users 
  	#TODO: disconnect user connection if exists.
  	#TODO: Send server_history to the new user!


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


	return Array[201, "Created"]
end


get '/stream/:token', :provides => 'text/event-stream' do 
	token = params['token']
	content_type 'text/event-stream'
	stream(:keep_open) do |out|
		$connections << out
		out<<"connected.\n"
		sleep(1);
		out<<"connected.2\n"
		sleep(2);
		out<<"connected.3\n"
	    # purge dead connections
	    #connections.reject!(&:closed?)
	    out.callback { puts "user disconnected" }
	end
end










