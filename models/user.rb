# encoding: utf-8
require 'bcrypt'

class User < Sequel::Model(:Users)
	
	def self.authentificate (params)
		user = self.find( :name => params[:name] )

		if defined?(user[:id])
			return user.id if user[:password] == BCrypt::Engine.hash_secret(params[:password], user[:salt])
		end
	end

	def self.register (params)
		password_salt = BCrypt::Engine.generate_salt
  	password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)

  	self.name = params[:name]
  	self.email = params[:email]
  	self.password = password_hash
  	self.salt = password_salt

  	self.save
	end

end
