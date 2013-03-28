# encoding: utf-8
class MyApp < Sinatra::Application
  get "/jobs" do
    @title = "Toutes les jobs"
    @form_action = "/jobs"
    @job = Job.new
    @jobs = Job.all	
    @route_name = "jobs"
    @jobs.to_json
    # haml :reglages	
  end

  get "/jobs/:id" do |id|
    @job = Job.find(:id => id)
    @jobs = Job.all	
    @title = "Fiche de #{@job.name}"
    @form_action = "/jobs/#{@job.id}"
    @route_name = "jobs"
    # haml :reglages
  end

  post "/jobs" do
    Job.create(:name => params[:name], :client_id => params[:client_id], :notes => params[:notes], :state => 1)
    @job = Job.new
    @jobs = Job.all	
    @route_name = "jobs"	
    # haml :reglages
  end

  put "/jobs/:id" do |id|
    Job.find(:id => id).update(:name => params[:name], :phone => params[:phone], :note => params[:note])
    redirect "/jobs"
  end

  delete "/jobs/:id" do |id|
    Job.find(:id => id).delete
    redirect "/jobs"
  end
end
