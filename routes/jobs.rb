# encoding: utf-8
class MyApp < Sinatra::Application
  get "/jobs" do
    @title = "Toutes les jobs"
    @form_action = "/jobs"
    @job = Job.new
    @jobs = Job.order(:id).where('state < 4').all
    Job.all.each {|a| a.update(:state => 1)}
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
    job = Job.create(:name => params[:name], :client_id => params[:client_id], :notes => params[:notes], :state => params[:state])
    @job = Job.new
    @jobs = Job.all	
    @route_name = "jobs"	
    # haml :reglages
    job.to_json
  end

  put "/jobs/:id" do |id|
    Job.find(:id => id).update(:name => params[:name], :phone => params[:phone], :note => params[:note])
  end

  delete "/jobs/:id" do |id|
    job = Job.find(:id => id).update(:state => 4)
    job.to_json
  end
end
