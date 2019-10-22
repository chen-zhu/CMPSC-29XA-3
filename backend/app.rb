require 'sinatra'
require 'json'

#Sinatra: params

# This endpoint is used to grant a user an access token
post '/login' do
  	
  	
  	#status 200
  	#body SHA256_list.to_json
  	return Array[200, SHA256_list.to_json] #use explicit return here!
end

# Send a message to all users of the chat system
post '/message' do

	return Array[201, return_digest.to_json]
end


get '/stream/:token' do 
	token = params['token']


end

