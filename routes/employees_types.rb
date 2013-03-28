# encoding: utf-8
class MyApp < Sinatra::Application
  get "/employees_types" do
    @title = "Tous les employés"
    @form_action = "/employees_types"
    @employee_type = Employees_types.new
    @employees_types = Employees_types.all
    @route_name = "employees_types"
    @employees_types.to_json
    # haml :reglages	
  end

  get "/employees_types/:id" do |id|
    @employee_type = Employees_types.find(:id => id)
    @employees_types = Employees_types.all	
    @title = "Fiche de #{@employee.name}"
    @form_action = "/employees_types/#{@employee.id}"
    @route_name = "employees_types"
    haml :reglages
  end

  post "/employees_types" do
    Employees_types.create(:type => params[:type])
    @employee_type = Employees_types.new
    @employees_types = Employees_types.all
    @route_name = 'employees_types'
    # haml :reglages
  end

  put "/employees_types/:id" do |id|
    Employees_types.find(:id => id).update(:type => params[:type])
    redirect "/employees_types"
  end

  delete "/employees_types/:id" do |id|
    employee = Employees_types.find(:id => id).delete
    redirect "/employees_types"
  end
end
