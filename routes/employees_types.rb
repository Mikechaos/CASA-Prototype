# encoding: utf-8
class MyApp < Sinatra::Application
  get "/employees_types" do
    @title = "Tous les employés"
    @form_action = "/employees_types"
    @employee_type = Employees_types.new
    @employees_types = Employees_types.order(:id).where('state < 4')
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
    # haml :reglages
  end

  post "/employees_types" do
    employees_type = Employees_types.create(:type => params[:type], :state => params[:state])
    @employee_type = Employees_types.new
    @employees_types = Employees_types.all
    @route_name = 'employees_types'
    employees_type.to_json
  end

  put "/employees_types/:id" do |id|
    Employees_types.find(:id => id).update(:type => params[:type], :state => params[:state]).to_json
  end

  delete "/employees_types/:id" do |id|
    employees_type = Employees_types.find(:id => id).update(:state => 4)
    employees_type.to_json
  end
end
