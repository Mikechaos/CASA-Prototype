class CreateUsersTable < Sequel::Migration
	def up
		create_table(:Users) do
			primary_key :id
			String :name
			String :email
			Integer :type
			String :password
			String :salt
		end
	end
	def down
		drop_table(:Users)
	end
end