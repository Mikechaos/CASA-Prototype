class AddEmployeesTypeToEmployees < Sequel::Migration
  def up
    add_column :Employees, :employees_type_id, Integer
    # self[:employees].update(:type_id => '1');
  end
  def down
    drop_column :Employees, :employees_type_id
  end
end
