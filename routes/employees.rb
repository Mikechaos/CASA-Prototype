# encoding: utf-8
class MyApp < Sinatra::Application
	get "/employees" do
		@title = "Tous les employés"
		@form_action = "/employees"
		@employee = Employee.new
		@employees = Employee.all
		@route_name = "employees"
		haml :reglages	
	end

	get "/employees/:id" do |id|
		@employee = Employee.find(:id => id)
		@employees = Employee.all	
		@title = "Fiche de #{@employee.name}"
		@form_action = "/employees/#{@employee.id}"
		@route_name = "employees"
		haml :reglages
	end

	post "/employees" do
		Employee.create(:name => params[:name], :supervisor => params[:supervisor])
		@employee = Employee.new
		@employees = Employee.all
		@route_name = "employees"
		haml :reglages
	end

	put "/employees/:id" do |id|
		Employee.find(:id => id).update(:name => params[:name], :supervisor => params[:supervisor])
		redirect "/employees"
	end

	delete "/employees/:id" do |id|
		employee = Employee.find(:id => id).delete
		redirect "/employees"
	end
end