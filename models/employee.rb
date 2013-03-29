# encoding: utf-8
class Employee < Sequel::Model(:Employees)
  many_to_one :employees_types
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
