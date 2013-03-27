class CreateBoxes < Sequel::Migration
  def up
    create_table(:Boxes) do
      primary_key :id
      String  :name
      Text    :notes
      Integer :state
    end
  end
  def down
    drop_table(:Boxes)
  end
end
