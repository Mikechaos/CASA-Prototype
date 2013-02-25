# encoding: utf-8
require 'sequel'
DB = Sequel.sqlite 'db/data.db'
# DB << "SET CLIENT_ENCODING TO 'UTF8';"

require_relative 'employee'
require_relative 'job'