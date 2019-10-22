require 'sinatra'
require 'json'
require 'digest'

# global_users: {username => Digest::SHA256.hexdigest password}
global_users = {')(*&^Dummy' => ')(*&^Dummy'}
signed_in_users = {}
server_history = {}

# This endpoint is used to grant a user an access token
post '/login' do
  	username = params['username']
  	password = params['password']
  	
  	#check if username or password is given.
  	if(username.nil? || password.nil? )
  		return Array[422, "Username or Password is blank!"]
  	end

  	signed_token = Digest::SHA256.hexdigest password

  	if(global_users[username].nil?) 
  		#if user does not exist!
  		#insert user first.
  		global_users[username] = signed_token
  	else 
  		#user exist, then validate username and password here!
  		if(global_users[username] != signed_token)
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
	
	username = global_users.key(token)
	if(username.nil?)
		return Array[403, "Invalid token."]
	end

	#TODO: Trigger stream action to post message here!


	return Array[201, "Created"]
end


get '/stream/:token' do 
	token = params['token']

	#verify token here.

end

