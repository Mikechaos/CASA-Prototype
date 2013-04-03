# encoding: utf-8

class MyApp < Sinatra::Application
  get "/affectations" do
    @title = "Tous les employés"
    @form_action = "/affectations"
    @affectation = Affectation.new
    @affectations = Affectation.order(:id).all
    @route_name = "affectations"
    @affectations.to_json
    # haml :reglages	
  end

  get "/affectations/:id" do |id|
    @affectation = Affectation.find(:id => id)
    @affectations = Affectation.all	
    @title = "Fiche de #{@affectation.name}"
    @form_action = "/affectations/#{@affectation.id}"
    @route_name = "affectations"
    # haml :reglages
  end

  post "/affectations" do
    Affectation.create(:supervisor_id => params[:supervisor_id], 
                       :link_number => params[:link_number],
                       :client_id => params[:client_id],
                       :elements => params[:elements],
                       :affectation_type => params[:affectation_type],
                       :user_id => params[:user_id],
                       :notes => params[:notes],
                       :state => params[:state],
                       :day => params[:day],
                       :start_time => params[:start_time],
                       :end_time => params[:end_time])
    # # puts params
    # Affectation.create(Affectation.from_json(params))
    @affectation = Affectation.new
    @affectations = Affectation.all
    @route_name = 'affectations'
    puts @affectation[:id]
    # haml :reglages
  end

  put "/affectations/:id" do |id|
    # Affectation.find(:id => id).update(:name => params[:name], :supervisor => params[:supervisor])
    redirect "/affectations"
  end

  delete "/affectations/:id" do |id|
    affectation = Affectation.find(:id => id).delete
    redirect "/affectations"
  end
end
