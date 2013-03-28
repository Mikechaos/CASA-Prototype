# encoding: utf-8

class MyApp < Sinatra::Application
  get "/trucks" do
    @title = "Tous les employés"
    @form_action = "/trucks"
    @truck = Truck.new
    @trucks = Truck.all
    @route_name = "trucks"
    @trucks.to_json
    # haml :reglages	
  end

  get "/trucks/:id" do |id|
    @truck = Truck.find(:id => id)
    @trucks = Truck.all	
    @title = "Fiche de #{@truck.name}"
    @form_action = "/trucks/#{@truck.id}"
    @route_name = "trucks"
    haml :reglages
  end

  post "/trucks" do
    Truck.create(:name => params[:name], :notes => params[:notes], :state => params[:state])
    @truck = Truck.new
    @trucks = Truck.all
    @route_name = 'trucks'
    # haml :reglages
  end

  put "/trucks/:id" do |id|
    Truck.find(:id => id).update(:name => params[:name], :supervisor => params[:supervisor])
    redirect "/trucks"
  end

  delete "/trucks/:id" do |id|
    truck = Truck.find(:id => id).delete
    redirect "/trucks"
  end
end
