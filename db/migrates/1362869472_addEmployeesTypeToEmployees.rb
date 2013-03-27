class AddEmployeesTypeToEmployees < Sequel::Migration
  def up
    add_column :employees, :employees_type_id, Integer
    # self[:employees].update(:type_id => '1');
  end
  def down
    drop_column :employees, :employees_type_id
  end
end
