# # encoding: utf-8
# class MyApp < Sinatra::Application
#   set :sessions => true

#   register do
#     def auth (type)
#       condition do
#         redirect "/login" unless send("is_#{type}?")
#       end
#     end
#   end

#   helpers do
#     def is_user?
#       @user != nil
#     end
#   end

#   before do
#     @user = User.get(session[:user_id]) 
#  end

#   get "/login" do
#     haml :login
#   end

#   post "/login" do
#     session[:user_id] = User.authentificate(params)
#   end

#   get "/logout" do
#     session[:user_id] = nil
#   end

#   get "/register" do
#     haml :register
#   end

#   post "/register" do
#     user = User.register(params)

#     redirect '/register'
#   end
# end
