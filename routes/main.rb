# encoding: utf-8
class MyApp < Sinatra::Application
	get "/" do
		@title = session[:user_id]	
		haml :main
	end
end