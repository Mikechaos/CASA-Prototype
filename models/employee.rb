# encoding: utf-8
class Employee < Sequel::Model
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