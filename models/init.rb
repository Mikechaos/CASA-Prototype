# encoding: utf-8
require 'sequel'
# DB = Sequel.sqlite 'db/data.db'
DB = Sequel.connect(:adapter => 'postgres',
                    :host => 'ec2-107-22-165-15.compute-1.amazonaws.com',
                    :database => 'd563rs3agl1jk7',
                    :user => 'itvnbulwdbqpbc',
                    :port => '5432',
                    :password => 'm9kpPPw2GrhJ-FQVsdBcpfiZca')
# DB << "SET CLIENT_ENCODING TO 'UTF8';"

require_relative 'employee'
require_relative 'employees_type'
require_relative 'job'
require_relative 'user'
require_relative 'client'
require_relative 'truck'
require_relative 'box'
