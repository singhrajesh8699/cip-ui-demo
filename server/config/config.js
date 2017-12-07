module.exports = {
  // App Settings
  MONGO_URI: process.env.MONGO_URI || 'localhost',

  //API key info
  API_KEY_HEADER_NAME: 'api_key',
  API_KEY: 'dj123rouv13yro',

	// API base path
	API_BASEPATH: '/dataxylo/v1',

	// Request timeout (milliseconds)
  // REQUEST_TIMEOUT: 300000, // 5 min
  //REQUEST_TIMEOUT: 300000 * 12 * 24, // 24 hours

  REQUEST_TIMEOUT: 30000,

  //Payload checksum header key
  PAYLOAD_CHECKSUM_HEADER_NAME: 'payload_checksum',

  // Session token header key
  X_AUTHORIZATION_HEADER: 'authorization',

  // JWT encryption salt
  TOKEN_SECRET: 'mongoose_project',

  // Email client smtp config
  poolConfig: {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'testingemail12341234@gmail.com',
      pass: 'testingemail'
    }
  },

  // Log file storage location
  logPath: 'log/app.log',

  // Log status
  LOG_STATUS: {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
  },

  // User role
  USER_ROLE: {
    ADMIN: 'admin',
    USER: 'user'
  },

	CUSTOMER_FILTER_TYPE: {
		RANGE: 'range',
		LIST: 'list',
		SPECIFIC: 'specific'
	},

  // Client website base URL
  WEBSITE_BASE_URL: 'http://test.com',

  // Email verification page relative path (path after above base URL)
  WEBSITE_EMAIL_VERIFICATION_API: '/user/emailverify'
};
