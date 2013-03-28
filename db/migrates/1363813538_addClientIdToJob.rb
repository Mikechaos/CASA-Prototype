class AddClientIdToJob < Sequel::Migration
  def up
    add_column :Jobs, :client_id, Integer
    add_column :Jobs, :state, Integer
    # self[:employees].update(:type_id => '1');
  end
  def down
    drop_column :Jobs, :client_id
    drop_column :Jobs, :state
    add_column :Jobs, :client_id, String
  end
end
