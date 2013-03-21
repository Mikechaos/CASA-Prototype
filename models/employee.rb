# encoding: utf-8
class Employee < Sequel::Model
	many_to_one :employees_type
	def position
		if self.supervisor
			"Superviseur"
		else
			"Employee"
		end
	end

	def supervisor?
		self.supervisor
	end
end