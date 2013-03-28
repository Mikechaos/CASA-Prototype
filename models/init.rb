# encoding: utf-8
require 'sequel'
#DB = Sequel.sqlite 'db/data.db'
# DB = Sequel.connect(:adapter => 'postgres',
#                     :host => 'ec2-107-22-165-15.compute-1.amazonaws.com',
#                     :database => 'd563rs3agl1jk7',
#                     :user => 'itvnbulwdbqpbc',
#                     :port => '5432',
#                     :password => 'm9kpPPw2GrhJ-FQVsdBcpfiZca')
# DB = Sequel.connect('postgres://itvnbulwdbqpbc:m9kpPPw2GrhJ-FQVsdBcpfiZca@ec2-107-22-165-15.compute-1.amazonaws.com:5432/d563rs3agl1jk7')
DB = Sequel.postgres('d563rs3agl1jk7', :user=>'itvnbulwdbqpbc', 
       :password=>'m9kpPPw2GrhJ-FQVsdBcpfiZca', :host=>'ec2-107-22-165-15.compute-1.amazonaws.com', :port=>5432, 
       :max_connections=>10)
# DB << "SET CLIENT_ENCODING TO 'UTF8';"

Sequel::Model.plugin :json_serializer

require_relative 'employee'
require_relative 'employees_type'
require_relative 'job'
require_relative 'user'
require_relative 'client'
require_relative 'truck'
require_relative 'box'

