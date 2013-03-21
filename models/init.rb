# encoding: utf-8
require 'sequel'
DB = Sequel.sqlite 'db/data.db'
# DB << "SET CLIENT_ENCODING TO 'UTF8';"

require_relative 'employee'
require_relative 'employees_type'
require_relative 'job'
require_relative 'user'
require_relative 'client'
require_relative 'vehicule'