class CreateEmployeesType < Sequel::Migration
  def up
    create_table(:Employees_types) do
      primary_key :id
      String  :type
    end
  end
  def down
    drop_table(:Employees_types)
  end
end
