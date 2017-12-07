'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId,
		bcrypt = require("bcryptjs");

var fields = {
	name: { type: String },
	email: { type: String },
	password: { type: String },
	sa_user: { type: Boolean,
	 						default: false},
	dx_user: { type: Boolean,
	 						default: false },
	da_user: { type: Boolean,
	 						default: false },
	ma_user: { type: Boolean,
	 						default: false },
	thumbnail: { type: String },
	tenant: {},
	is_verified: { type: Boolean },
	last_login: { type: Date , default: Date.now },
	is_logged_in: { type: Boolean },
	salt: {type: String}

};

var userSchema = new Schema(fields, {timestamps: true});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { //Returns true if this document was modified, else false
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) { //generates salt
		console.log("SALT: "+salt);
		user.salt = salt;
    bcrypt.hash(user.password, salt, function(err, hash) {//Hashes password and concatenates with salt and stores in DB. Output is concatenated string => hash
			console.log("HASH: "+hash);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.virtual("getMinorDetails").get(function() {
	return {_id: this._id,
					name: this.name,
					email: this.email,
					tenant: this.tenant,
					sa_user: this.sa_user,
					dx_user: this.dx_user,
					da_user: this.da_user,
					ma_user: this.ma_user,
					thumbnail: this.thumbnail,
					createdAt: this.createdAt};
});

module.exports = mongoose.model('User', userSchema);
