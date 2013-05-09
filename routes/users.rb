# encoding: utf-8
require 'bcrypt'
set :sessions => true

class MyApp < Sinatra::Application
  get "/users" do
    users = User.order(:id).where('state < 4').all
    puts "USER FETCH"
    puts users.to_json
    users.to_json
    
  end
  
  get "/users/:name" do |name|
    user = User.find(:name => name)
    
    if user[:password] == BCrypt::Engine.hash_secret(params[:password], user[:salt])
      session[:user_id] = user[:id]
      'true'
    else
      session[:user_id] = nil
      'false'
    end
  end
  
  get "/session" do
    # puts session[:user_id]
    '{"session_id": "' +  session[:user_id].to_s + '"}'
  end

  post "/logout" do
    session.clear
    # session[:user_id] = nil
  end
  
  post "/users" do
    password_salt = BCrypt::Engine.generate_salt
    
    password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
    User.create(:name => params[:name],
                :email => params[:email],
                :password => password_hash,
                :salt => password_salt).to_json
  end
  
  put "/users/:id" do |id|
    password_salt = BCrypt::Engine.generate_salt
    
    password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
    User.find(:id => id).update({:name => params[:name],
                                  :email => params[:email],
                                  :password => password_hash,
                                  :salt => password_salt}).to_json
    # redirect "/users"
  end

  delete "/users/:id" do |id|
    del = user = User.find(:id => id).update(:state => 4)
    del.to_json
    # redirect "/users"
  end
end
