# encoding: utf-8

class MyApp < Sinatra::Application
  get "/settings" do
    Settings.all.to_json
  end

  post "/settings" do
    Settings.find(:id => 1).update({:default_time => params[:default_time]}).to_json
  end
end
