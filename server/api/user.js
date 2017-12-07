// Module dependencies.
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.models.User,
  Tenant = mongoose.models.Tenant,
  api = {},
  auth = require('../utils/apiAuth'),
  _ = require("lodash"),
  multer = require("multer"),
  path = require('path'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
  bcrypt = require("bcryptjs");

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	  	cb(null, 'uploads/')
	  },
	  filename: function (req, file, cb) {
			const partsArray = file.originalname.split('.');
			const extension = partsArray[partsArray.length - 1];
			cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
	  }
	});

	var upload = multer({ storage: storage });


// ALL
api.users = function (req, res) {
  User.find(function(err, users) {
  if (err) {
    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																	500, req, res);
  } else {
    return apiResponse.sendResponse(users, 200, req, res);
  }
  });
};

// GET
api.user = function (req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
  if (err) {
    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																	400, req, res);
  } else {
    return apiResponse.sendResponse(user, 200, req, res);
  }
  });
};

api.getprofile = function(req, res) {
  var id = req.user_id;
  User.findOne({ '_id': id }, function(err, user) {
  if (err) {
    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																	400, req, res);
  } else {
    return apiResponse.sendResponse(user.getMinorDetails, 200, req, res);
  }
  });
};

// POST
api.addUser = function (req, res) {

  var user;

  if(typeof req.body.user == 'undefined') {
  return apiResponse.sendError(apiErrors.APPLICATION.INVALID_PARAMETERS, null,
																500, req, res);
  }

  user = new User(req.body.user);

  user.save(function (err) {
  if (!err) {
    console.log("created user");
    return apiResponse.sendResponse(user.toObject(), 200, req, res);
  } else {
    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																	500, req, res);
  }
  });
};

// PUT
api.editUser = function (req, res) {
  var id = req.params.id;

  User.findById(id, function (err, user) {

	  if(typeof req.body["name"] != 'undefined') {
	    user["name"] = req.body["name"];
	  }

	  if(typeof req.body["email"] != 'undefined') {
	    user["email"] = req.body["email"];
	  }

	  if(typeof req.body["password"] != 'undefined') {
	    user["password"] = req.body["password"];
	  }

	  if(typeof req.body["is_verified"] != 'undefined') {
	    user["is_verified"] = req.body["is_verified"];
	  }

	  if(typeof req.body["sa_user"] != 'undefined') {
	    user["sa_user"] = req.body["sa_user"];
	  }

	  if(typeof req.body["dx_user"] != 'undefined') {
	    user["dx_user"] = req.body["dx_user"];
	  }

	  if(typeof req.body["da_user"] != 'undefined') {
	    user["da_user"] = req.body["da_user"];
	  }

		if(typeof req.body["ma_user"] != 'undefined') {
	    user["ma_user"] = req.body["ma_user"];
	  }

	  if(typeof req.body["last_login"] != 'undefined') {
	    user["last_login"] = req.body["last_login"];
	  }

	  if(typeof req.body["is_logged_in"] != 'undefined') {
	    user["is_logged_in"] = req.body["is_logged_in"];
	  }

		if(user.tenant._id !== req.body.tenant_id) {
			Tenant.findById(req.body.tenant_id, function(err, tenant) {
				if (!err) {
			    user.tenant = tenant;
					saveUser(user, req, res);
		    } else {
					apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																500, req, res);
				}
			});
		}
		else{
			saveUser(user, req, res);
		}

  });

};


api.updateUserThumb = function(req, res) {
	User.findById(req.params.id, function(err, tenant) {
		tenant.thumbnail = path.basename(req.file.path);
		tenant.save(function(err, updated) {
			if(err) {
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			else {
				apiResponse.sendResponse(updated, 200, req, res);
			}
		});
	});
};

// DELETE
api.deleteUser = function (req, res) {

  var id = req.params.id;
  console.log(id);
  // if(req.user_role === config.USER_ROLE.USER && req.user_id !== id) {
	//   return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_ERROR, null,
	//                   							401, req, res);
  // }

  return User.findById(id, function (err, user) {
	  return user.remove(function (err) {
	    if (!err) {
		    console.log("removed user");
		    return apiResponse.sendResponse(null, 204, req, res);
	    } else {
		    console.log(err);
		    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																			500, req, res);
	    }
	  });
  });

};

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var saveUser = function(user, req, res) {
	user.save(function (err) {
		if (!err) {
			console.log("updated user");
			return apiResponse.sendResponse(user.toObject(), 200, req, res);
		} else {
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null,
																		500, req, res);
		}
		return apiResponse.sendResponse(user, 200, req, res);
	});
};


/*= End of Private methods =*/
/*=============================================<<<<<*/

//router.get('/users', auth.adminAuthorization, api.users);
router.get('/users', api.users);

router.post('/user', auth.adminAuthorization, api.addUser);

router.get('/user/me', auth.authorizationCheck, api.getprofile);

router.route('/user/:id')
  .get(api.user)
  .put(api.editUser)
  .delete(api.deleteUser);

router.post('/user/thumb/:id', upload.single('file'), api.updateUserThumb);

module.exports = router;
