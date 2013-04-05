# encoding: utf-8
class MyApp < Sinatra::Application
  get "/clients" do
    @title = "Tous les clients"
    @form_action = "/clients"
    @client = Client.new
    @clients = Client.order(:id).where('state < 4')
    @route_name = "clients"
    @clients.to_json
    # haml :reglages	
  end

  get "/clients/:id" do |id|
    @client = Client.find(:id => id)
    @clients = Client.all	
    @title = "Fiche de #{@client.name}"
    @form_action = "/clients/#{@client.id}"
    @route_name = "clients"
    haml :reglages
  end

  post "/clients" do
    client = Client.create(:name => params[:name],
                           :address => params[:address],
                           :phone => params[:phone],
                           :state => params[:state],
                           :ref_number => params[:ref_number],
                           :contact => params[:contact],
                           :city => params[:city],
                           :postal_code => params[:postal_code],
                           :casa_salesman => params[:casa_salesman],
                           :notes => params[:notes],
                           :state => params[:state])
    
    @client = Client.new
    @clients = Client.all
    @route_name = "clients"
    client.to_json
    # haml :reglages
  end

  put "/clients/:id" do |id|
    Client.find(:id => id).update(:name => params[:name],
                                  :address => params[:address],
                                  :phone => params[:phone],
                                  :state => params[:state],
                                  :ref_number => params[:ref_number],
                                  :contact => params[:contact],
                                  :city => params[:city],
                                  :postal_code => params[:postal_code],
                                  :casa_salesman => params[:casa_salesman],
                                  :notes => params[:notes],
                                  :state => params[:state]).to_json
  end

  delete "/clients/:id" do |id|
    client = Client.find(:id => id).update(:state => 4)
    client.to_json
  end
end
