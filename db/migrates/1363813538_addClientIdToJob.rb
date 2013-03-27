class AddClientIdToJob < Sequel::Migration
  def up
    add_column :jobs, :client_id, Integer
    add_column :jobs, :state, Integer
    # self[:employees].update(:type_id => '1');
  end
  def down
    drop_column :jobs, :client_id
    drop_column :jobs, :state
    add_column :jobs, :client_id, String
  end
end
