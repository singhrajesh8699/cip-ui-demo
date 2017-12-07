/**
 * List of errors
 *
 * @author DroidBoyJr
 * created on 2016-08-23
 */

var placeHolderFormatter = require('strformat');

 /*
 * Defines the error object to be thrown or returned in case of any error condition.
 * It stores the error code that encapsulates error number, severity of error, facility that created an error.
 * Additional parameters can be put in this class, which could be used in cases where the additional
 * information is required to describe an error.
 *
 *
 *  Values are 32 bit values laid out as follows:
 *
 *  +---+-+-+-----------------------+-------------------------------+
 *  |Sev|R|R|   Facility      |         Code      |
 *  +---+-+-+-----------------------+-------------------------------+
 *
 *  where
 *
 *    Sev - is the severity code (2 bits)
 *
 *      00 - Success
 *      01 - Informational
 *      10 - Warning
 *      11 - Error
 *
 *    R - is a reserved bit.
 *
 *    R - is a reserved bit
 *
 *    Facility - is the facility code (12 bits)
 *
 *    Code - is the facility's error number (16 bits)
 *
 */

/*=============================================>>>>>
= Base error codes =
===============================================>>>>>*/

var SEVERITY_ERROR = 0x00000003;
var SEVERITY_WARNING = 0x00000002;
var SEVERITY_INFORMATIONAL = 0x00000001;

var SUCCESS = 0;

var FACILITIES =
  {
  APPLICATION: 0x100,
  USER: 0x101,
	HDFS: 0x102,
	FTP: 0x103,
	TENANT: 0x104,
	SOURCES: 0x105
  };

/*= End of Base error codes =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Application errors =
===============================================>>>>>*/

var applicationErrors =
  {
    INVALID_API_KEY :
    {
      errorCode : 0xC1000001,
      message: "Invalid API key"
    },
    INVALID_SESSION :
    {
      errorCode : 0xC1000002,
      message: "Invalid session"
    },
    INTERNAL_ERROR :
    {
      errorCode : 0xC1000003,
      message: "Server error"
    },
    UNAUTHORIZED_REQUEST :
    {
      errorCode : 0xC1000004,
      message: "Unauthorized request"
    },
    INVALID_PARAMETERS :
    {
      errorCode : 0xC1000005,
      message: "Invalid parameters"
    },
    INVALID_PAYLOAD_CHECKSUM :
    {
      errorCode : 0xC1000006,
      message: "Incorrect payload checksum"
    },
    REQUEST_TIMEOUT :
    {
      errorCode : 0xC1000007,
      message: "Request timeout"
    },
		NO_RESOURCE_FOUND :
		{
			errorCode : 0xC1000008,
      message: "No such resource exist"
		},
		PARSE_ERROR :
		{
			errorCode : 0xC1000009,
      message: "Incorrect content found."
		},
		INVALID_PAYLOAD :
    {
      errorCode : 0xC1000010,
      message: "Invalid payload."
    }
  };

/*= End of Application errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= User errors =
===============================================>>>>>*/

var userErrors =
  {
    REGISTRATION_FAILED :
    {
      errorCode : 0xC1010001,
      message: "Registration failed"
    },
    LOGIN_FAILED :
    {
        errorCode : 0xC1010002,
        message: "Username or password incorrect"
    },
    NO_SUCH_USER :
    {
        errorCode : 0xC1010003,
        message: "No such user exist"
    },
    EMAIL_EXISTS :
    {
      errorCode : 0xC1010004,
      message: "Email already exists"
    },
		NO_PARAMETERS_RECEIVED :
		{
			errorCode : 0xC1010005,
      message: "No parameters found"
		},
		NO_NAME_RECEIVED :
		{
			errorCode : 0xC1010006,
      message: "No name field found"
		},
		NO_PASSWORD_RECEIVED :
		{
			errorCode : 0xC1010007,
      message: "No password field found"
		},
		NO_EMAIL_RECEIVED :
		{
			errorCode : 0xC1010008,
      message: "No email field found"
		},
		INVALID_EMAIL_RECEIVED :
		{
			errorCode : 0xC1010009,
      message: "No email field found"
		}
  };

/*= End of User errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= HDFS errors =
===============================================>>>>>*/

var hdfsErrors =
{
	HDFS_FILE_WRITE_FAILED : {
		errorCode : 0xC1020001,
		message: "Failed to write file to HDFS"
	}
};

/*= End of HDFS errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= FTP errors =
===============================================>>>>>*/

var ftpErrors =
{
	AUTH_FAILED : {
		errorCode : 0xC1030001,
		message: "Incorrect FTP credentials"
	},
	REQUEST_FAILED : {
		errorCode : 0xC1030002,
		message: "Request failed"
	},
	GET_FILE_FAILED : {
		errorCode : 0xC1030003,
		message: "Failed to read file"
	}
};

/*= End of FTP errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Tenant errors =
===============================================>>>>>*/

var tenantErrors =
{
	NO_SUCH_TENANT : {
		errorCode : 0xC1040001,
		message: "No such tenant exist"
	}
};


/*= End of Tenant errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Source errors =
===============================================>>>>>*/

var sourceErrors =
{
	SOURCE_FILE_INVALID : {
		errorCode : 0xC1050001,
		message: "Invalid file"
	}
};


/*= End of Source errors =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

/**
 * Get error object with formatted message with place holders replaced with
 * arguments
 * @return {Object} error object
 */
var getFormattedError = function() {
  var paramsArray = Array.prototype.splice.call(arguments, 0);
  var error = paramsArray[0];
  var placeHolderParams = paramsArray.slice(1, paramsArray.length);

  var errorMessage = error.message;
  error.message = placeHolderFormatter(errorMessage, placeHolderParams);

  return error;
}

/*= End of Private methods =*/
/*=============================================<<<<<*/

module.exports = {
	SUCCESS: SUCCESS,
  APPLICATION: applicationErrors,
  USER: userErrors,
	HDFS: hdfsErrors,
	FTP: ftpErrors,
	TENANT: tenantErrors,
	SOURCE: sourceErrors,
  getFormattedError : getFormattedError
};
