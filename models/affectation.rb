# encoding: utf-8
class Affectation < Sequel::Model(:Affectations)
  one_to_one :client
  # one_to_many :employees
  # one_to_many :trucks
  # one_to_many :boxes
end
