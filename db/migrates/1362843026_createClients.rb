class CreateClientsTable < Sequel::Migration
  def up
    create_table(:Clients) do
      primary_key :id
      String  :name
      Text    :address
      String  :phone
      Text    :notes
      Integer :state
    end
  end
  def down
    drop_table(:Clients)
  end
end
