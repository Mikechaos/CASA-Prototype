# encoding: utf-8

class MyApp < Sinatra::Application
  get "/affectations" do
    @title = "Tous les employés"
    @form_action = "/affectations"
    @affectation = Affectation.new
    @affectations = Affectation.order(:id).where('state < 4').all
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
    a = Affectation.create(:supervisor_id => params[:supervisor_id], 
                           :link_number => params[:link_number],
                           :client_id => params[:client_id],
                           :elements => params[:elements],
                           :affectation_type => params[:affectation_type],
                           :user_id => params[:user_id],
                           :notes => params[:notes],
                           :state => params[:state],
                           :day => params[:day],
                           :start_time => params[:start_time],
                           :end_time => params[:end_time],
                           :report_sent => 0)
    # # puts params
    # Affectation.create(Affectation.from_json(params))
    @affectation = Affectation.new
    @affectations = Affectation.all
    @route_name = 'affectations'
    a.to_json
    # haml :reglages
  end

  put "/affectations/:id" do |id|

    Affectation.find(:id => id).update({:supervisor_id => params[:supervisor_id], 
                                         :link_number => params[:link_number],
                                         :client_id => params[:client_id],
                                         :elements => params[:elements],
                                         :affectation_type => params[:affectation_type],
                                         :user_id => params[:user_id],
                                         :notes => params[:notes],
                                         :state => params[:state],
                                         :day => params[:day],
                                         :start_time => params[:start_time],
                                         :end_time => params[:end_time],
                                         :report_sent => params[:report_sent]}).to_json
    # redirect "/affectations"
  end

  delete "/affectations/:id" do |id|
    del = affectation = Affectation.find(:id => id).update(:state => 4)
    del.to_json
    # redirect "/affectations"
  end
end
