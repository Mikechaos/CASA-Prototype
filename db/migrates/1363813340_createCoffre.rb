class CreateCoffre < Sequel::Migration
	def up
		create_table(:Coffres) do
			primary_key :id
			String  :name
			Text    :note
			Integer :state
		end
	end
	def down
		drop_table(:Coffres)
	end
end