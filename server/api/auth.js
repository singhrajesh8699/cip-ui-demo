// Module dependencies.
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.models.User,
	Tenant = mongoose.models.Tenant,
	jwt = require('jwt-simple'),
	moment = require('moment'),
  path = require('path'),
	async = require('async'),
	uuid = require('uuid'),
	multer = require('multer'),
  api = {};

var apiAuth = require('../utils/apiAuth');
var apiResponse = require('../utils/apiResponse');
var apiErrors = require('../utils/apiErrors');
var config = require('../config/config');
var validatorAuth = require('../utils/validators/validatorAuth');
var response = null;

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


/*=============================================>>>>>
= API processing methods =
===============================================>>>>>*/

/**
 * Register user
 */
api.localSignUp = function(req, res) {
  async.waterfall([
  function(callback) {
    User.findOne({"email": req.body.email}, callback);
  },
  function(user, callback) {
    if(null == user) {
	    var user = new User();
	    user.email = req.body.email;
	    user.password = req.body.password;
	    user.name = req.body.name;
	    user.is_logged_in = true;
	    user.last_login = null;
	    user.is_verified = false;
	    user.role = config.USER_ROLE.USER;

	    user.save(user, callback);
    }
    else{
			eventLogger.logEvent(uuid.v1(), null, null, eventLogger.EVENTS.INITIATE_USER_REGISTRATION, apiErrors.USER.EMAIL_EXISTS.errorCode, apiErrors.USER.EMAIL_EXISTS.message, null);
	    return apiResponse.sendError(apiErrors.USER.EMAIL_EXISTS, null, 200, req, res);
    }
  }
  ], function(err, result) {
  if(err || result == null) {
	  eventLogger.logEvent(uuid.v1(), null, null, eventLogger.EVENTS.INITIATE_USER_REGISTRATION, apiErrors.USER.INTERNAL_ERROR.errorCode, apiErrors.USER.INTERNAL_ERROR.message, null);
    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }
  else{
    var data = {};
    data.token = createJWT(result.getMinorDetails, config.USER_ROLE.USER);
	  eventLogger.logEvent(uuid.v1(), null, null, eventLogger.EVENTS.INITIATE_USER_REGISTRATION, apiErrors.SUCCESS, config.LOG_STATUS.SUCCESS, null);
    apiResponse.sendResponse(data, 200, req, res);
  }
  });
};

/**
 * User login
 */
api.localLogin = function(req, res) {

  async.waterfall([
    function(callback) {
	    User.findOne({"email": req.body.email}, function(err, user) {
				if(err) {
					return eventLogger.logEvent(uuid.v1(), null, null, eventLogger.EVENTS.USER_LOGIN_REQUEST, apiErrors.APPLICATION.INTERNAL_ERROR.errorCode, apiErrors.APPLICATION.INTERNAL_ERROR.message, null);
				}
				callback(err, user);
			});
    },
    function(user, callback) {
	    if(null !== user) {
	    	user.comparePassword(req.body.password, function(err, isMatch) {
	        callback(err, user, isMatch);
	      });
	    }
	    else{
	      return apiResponse.sendError(apiErrors.USER.LOGIN_FAILED, null, 200, req, res);
	    }
    },
    function(user, passwordVerified, callback) {
	    if(passwordVerified) {
	      user.last_login = new Date();
	      user.is_logged_in = true;
	      user.save(callback);
	    }
	    else{
	      return apiResponse.sendError(apiErrors.USER.LOGIN_FAILED, null, 200, req, res);
    	}
    }
  ], function(err, result) {
			if(!err && result) {
				var data = {};
				data.user = result.getMinorDetails;
				data.token = createDataxyloJWT(result);

				req.user_id = result._id;
				req.headers[config.X_AUTHORIZATION_HEADER] = data.token;

				apiResponse.sendResponse(data, 200, req, res);
			}
  });
};

/**
 * Admin signup
 * ## DELETE METHOD ONCE SETUP DB ##
 */
api.adminSignUp = function(req, res) {
  AdminUser.findOne({
    "email": req.body.email
  }, function(err, existingUser) {
    if (existingUser) {
      response = apiResponse.showResponse([{
        message: "Email is already taken"
      }], false);
      res.status(200).send(response);
    } else {

      var user = new AdminUser();

      user.email = req.body.email;
      user.password = req.body.password;
      user.first_name = req.body.firstName;
      user.last_name = req.body.lastName;
      user.gender = req.body.gender;
      user.phone_no = req.body.mobileNo;
      user.city = req.body.city;
      user.is_logged_in = true;
      user.last_login = new Date().toISOString(),
      user.register_time = new Date().toISOString(),
      user.is_email_verified = false;

      user.save(function(err, result) {
        console.log(err);
        if (err) {
          res.status(500).send({
            message: err.message
          });
          return;
        }
        response = apiResponse.showResponse([{
          token: createJWT(user, config.USER_ROLE.ADMIN),
          user: user
        }], true);
        res.status(200).send(response);
      });
    }
  });
};

/**
 * Dataxylo user add
 */
api.addTenantUser = function(req, res) {
	async.waterfall([
	  function(callback) {
	    User.findOne({"email": req.body.email}, callback);
	  },
		function(user, callback) {
			Tenant.findById(req.params.id, function(err, tenant) {
				callback(err, user, tenant);
			});
		},
	  function(user, tenant, callback) {
			if(null == tenant) {
				return apiResponse.sendError(apiErrors.TENANT.NO_SUCH_TENANT, null, 400, req, res);
			}

	    if(null == user) {
		    var user = new User();
		    user.email = req.body.email;
		    user.password = req.body.password;
		    user.name = req.body.name;
				user.tenant = tenant;
		    user.is_logged_in = true;
		    user.last_login = null;
		    user.is_verified = false;
				user.thumbnail = path.basename(req.file.path);

				if(typeof req.body.sa_user !== 'undefined') {
					user.sa_user = req.body.sa_user;
				}
				if(typeof req.body.dx_user !== 'undefined') {
					user.dx_user = req.body.dx_user;
				}
				if(typeof req.body.da_user !== 'undefined') {
					user.da_user = req.body.da_user;
				}
				if(typeof req.body.ma_user !== 'undefined') {
					user.ma_user = req.body.ma_user;
				}

		    user.save(user, callback);
	    }
	    else{
		    return apiResponse.sendError(apiErrors.USER.EMAIL_EXISTS, null, 200, req, res);
	    }
	  }
	  ], function(err, result) {
	  if(err || result == null) {
	    return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	  }
	  else{
	    apiResponse.sendResponse(null, 200, req, res);
	  }
	});
};


/**
 * Admin login
 */
api.adminLogin = function(req, res) {

  async.waterfall([
  function(callback) {
    User.findOne({"email": req.body.email}, callback);
  },
  function(user, callback) {
    user.comparePassword(req.body.password, function(err, isMatch) {
    callback(err, user, isMatch);
    });
  },
  function(user, passwordVerified, callback) {
    if(passwordVerified) {
    user.last_login = new Date();
    user.is_logged_in = true;
    user.save(callback);
    }
    else{
    return apiResponse.sendError(apiErrors.USER.LOGIN_FAILED, null, 200, req, res);
    }
  }
  ], function(err, result) {
  var data = {};
  data.token = createJWT(result.getMinorDetails, config.USER_ROLE.ADMIN);
  apiResponse.sendResponse(data, 200, req, res);
  });
};

/*= End of API processing methods =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Private methods Section =
===============================================>>>>>*/

function createJWT(user, userRole) {
  var payload = {
    sub: {id: user._id, role: userRole},
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

function createDataxyloJWT(user) {
	var sub = {id: user._id,
				sa_user: user.sa_user,
				dx_user: user.dx_user,
				da_user: user.da_user,
				ma_user: user.ma_user};

	if(	typeof user.tenant !== 'undefined' &&
			typeof user.tenant._id !== 'undefined') {
		sub.tenant_id = user.tenant._id;
		sub.tenant_name = user.tenant.name;
	}

  var payload = {
    sub: sub,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

function sendNewRegisterEmail(email, name, verificationCode) {
  var verificationLink = config.WEBSITE_BASE_URL + config.WEBSITE_EMAIL_VERIFICATION_API;
  verificationLink += "?code=" + verificationCode;

  var mailData = {
    username: name,
    verification_code: verificationLink
  }


  mailHelper.sendVerificationMail(mailHelper.categories.REGISTER, email, mailData, function(err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log('mail success : ' + success);
    }
  });
}
/*= End of Private Methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Routes =
===============================================>>>>>*/

router.post('/auth/signup', validatorAuth.validateLocalSignup, api.localSignUp);
router.post('/auth/adduser/:id', upload.single('file'), api.addTenantUser);
router.post('/auth/login', validatorAuth.validateLocalLogin, api.localLogin);
router.post('/auth/admin', validatorAuth.validateLocalLogin, api.adminLogin);

module.exports = router;
