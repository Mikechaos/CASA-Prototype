# encoding: utf-8

class MyApp < Sinatra::Application
  get "/boxes" do
    @title = "Tous les employés"
    @form_action = "/boxes"
    @box = Box.new
    @boxes = Box.order(:id).where('state < 4').all
    @route_name = "boxes"
    @boxes.to_json
    # haml :reglages	
  end

  get "/boxes/:id" do |id|
    @box = Box.find(:id => id)
    @boxes = Box.all	
    @title = "Fiche de #{@box.name}"
    @form_action = "/boxes/#{@box.id}"
    @route_name = "boxes"
    # haml :reglages
  end

  post "/boxes" do
    box = Box.create(:name => params[:name], :notes => params[:notes], :state => params[:state])
    @box = Box.new
    @boxes = Box.all
    @route_name = 'boxes'
    box.to_json
    # haml :reglages
  end

  put "/boxes/:id" do |id|
    Box.find(:id => id).update(:name => params[:name], :supervisor => params[:supervisor])
  end

  delete "/boxes/:id" do |id|
    box = Box.find(:id => id).update(:state => 4)
    box.to_json
  end
end
