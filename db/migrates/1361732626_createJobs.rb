class CreateJobsTable < Sequel::Migration
  def up
    create_table(:Jobs) do
      primary_key :id
      String :name
      Text :notes
    end
  end
  def down
    drop_table(:Jobs)
  end
end
