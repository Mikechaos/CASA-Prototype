# encoding: utf-8
require 'sequel'

#DEV DB ##
 DB = ###

DB << "SET CLIENT_ENCODING TO 'UTF8';"

Sequel::Model.plugin :json_serializer

require_relative 'employee'
require_relative 'employees_type'
require_relative 'job'
require_relative 'user'
require_relative 'client'
require_relative 'truck'
require_relative 'box'
require_relative 'affectation'
require_relative 'delivery'
require_relative 'settings'
require_relative 'vacation'
require_relative 'vacation_archive'

