class CreateTrucks < Sequel::Migration
  def up
    create_table(:Trucks) do
      primary_key :id
      String  :name
      Text    :notes
      Integer :state
    end
  end
  def down
    drop_table(:Trucks)
  end
end
