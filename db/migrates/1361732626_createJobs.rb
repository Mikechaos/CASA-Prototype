class CreateJobsTable < Sequel::Migration
	def up
		create_table(:jobs) do
			primary_key :id
			String :name
			String :phone
			Text :note
		end
	end
	def down
		drop_table(:jobs)
	end
end