class CreateEmployeesTable < Sequel::Migration
	def up
		create_table(:employees) do
			primary_key :id
			String :name
			Boolean :supervisor
		end
	end
	def down
		drop_table(:employees)
	end
end