# encoding: utf-8

class MyApp < Sinatra::Application
  get "/employees" do
    @title = "Tous les employés"
    @form_action = "/employees"
    @employee = Employee.new
    @employees = Employee.order(:id).where('state < 4')
    @route_name = "employees"
    @employees.to_json
    # haml :reglages	
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
    emp = Employee.create(:name => params[:name], 
                          :supervisor => (params[:employees_type_id] == "0"), 
                          :employees_type_id => params[:employees_type_id], 
                          :notes => params[:notes], 
                          :state => params[:state])
    @employee = Employee.new
    @employees = Employee.all
    @route_name = 'employees'
    emp.to_json
    # haml :reglages
  end

  put "/employees/:id" do |id|
    Employee.find(:id => id).update(:name => params[:name], 
                                    :supervisor => (params[:employees_type_id] == "0"), 
                                    :employees_type_id => params[:employees_type_id], 
                                    :notes => params[:notes], 
                                    :state => params[:state]).to_json
  end

  delete "/employees/:id" do |id|
    employee = Employee.find(:id => id).update(:state => 4)
    employee.to_json
  end
end
