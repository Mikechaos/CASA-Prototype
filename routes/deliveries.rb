# encoding: utf-8

class MyApp < Sinatra::Application
  get "/deliveries" do
    @title = "Tous les employÃ©s"
    @form_action = "/deliveries"
    @delivery = Delivery.new
    @deliveries = Delivery.order(:id).where('state < 4').all
    @route_name = "deliveries"
    @deliveries.to_json
    # haml :reglages	
  end

  get "/deliveries/:id" do |id|
    @delivery = Delivery.find(:id => id)
    @deliveries = Delivery.all	
    @title = "Fiche de #{@delivery.name}"
    @form_action = "/deliveries/#{@delivery.id}"
    @route_name = "deliveries"
    # haml :reglages
  end

  post "/deliveries" do
    a = Delivery.create(:deliverer_id => params[:supervisor_id], 
                        :link_number => params[:link_number],
                        :clients => params[:clients],
                        :elements => params[:elements],
                        :user_id => params[:user_id],
                        :state => params[:state],
                        :day => params[:day],
                        :start_time => params[:start_time],
                        :report_sent => 0)
    # # puts params
    # Delivery.create(Delivery.from_json(params))
    @delivery = Delivery.new
    @deliveries = Delivery.all
    @route_name = 'deliveries'
    a.to_json
    # haml :reglages
  end

  put "/deliveries/:id" do |id|

    Delivery.find(:id => id).update({:deliverer_id => params[:supervisor_id], 
                                      :link_number => params[:link_number],
                                      :clients => params[:clients],
                                      :elements => params[:elements],
                                      :user_id => params[:user_id],
                                      :state => params[:state],
                                      :day => params[:day],
                                      :start_time => params[:start_time],
                                      :report_sent => params[:report_sent]}).to_json
    # redirect "/deliveries"
  end

  delete "/deliveries/:id" do |id|
    del = delivery = Delivery.find(:id => id).update(:state => 4)
    del.to_json
    # redirect "/deliveries"
  end
end
