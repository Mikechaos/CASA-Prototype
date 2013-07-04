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
                          :supervisor => (params[:supervisor]), 
                          :employees_type_id => params[:employees_type_id], 
                          :notes => params[:notes], 
                          :state => params[:state])
    @employee = Employee.new
    @employees = Employee.all
    @route_name = 'employees'
    emp.to_json
    # haml :reglages
  end

  post "/vacation" do
    puts '----- FIND ----- '
    
    vac = Vacation.find_or_create(:element_id => params[:element_id], :element_class => params[:element_class]) {|vac|
      puts params[:start_day]
      vac.element_id = params[:element_id]
      vac.element_class = params[:element_class]
      vac.start_day = params[:start_day]
      vac.end_day = params[:end_day]
      vac.reason = params[:reason]
    }.update(:start_day => params[:start_day],
             :end_day => params[:end_day],
             :reason => params[:reason]).to_json
      #else
      #  Vacation.find
  end

  get  "/vacation" do
    Vacation.order(:id).to_json
  end
  
  put "/employees/:id" do |id|
    Employee.find(:id => id).update(:name => params[:name], 
                                    :supervisor => (params[:supervisor]), 
                                    :employees_type_id => params[:employees_type_id], 
                                    :notes => params[:notes], 
                                    :state => params[:state]).to_json
  end

  delete "/employees/:id" do |id|
    employee = Employee.find(:id => id).update(:state => 4)
    employee.to_json
  end
end
