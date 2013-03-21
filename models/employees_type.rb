# encoding: utf-8
class Employees_type < Sequel::Model
	one_to_many :employees

	def test
		puts "test"
	end
end