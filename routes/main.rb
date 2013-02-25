# encoding: utf-8
class MyApp < Sinatra::Application
	get "/" do
		@title = "Bonjour"		
		haml :main
	end
end