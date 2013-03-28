# encoding: utf-8
class Employees_types < Sequel::Model(:Employees_types)
  one_to_many :Employees

  def test
    puts "test"
  end
end
