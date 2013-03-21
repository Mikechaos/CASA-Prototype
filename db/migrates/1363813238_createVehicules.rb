class CreateVehicule < Sequel::Migration
	def up
		create_table(:Vehicules) do
			primary_key :id
			String  :name
			Text    :note
			Integer :state
		end
	end
	def down
		drop_table(:Vehicules)
	end
end