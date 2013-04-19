# encoding: utf-8
class Delivery < Sequel::Model(:Deliveries)
  # one_to_one :client
  # one_to_many :employees
  # one_to_many :trucks
  # one_to_many :boxes
end
