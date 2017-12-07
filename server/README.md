# Dataxylo web-server

### Description
The repository contains NodeJS API server implementation for Dataxylo.

### Features
Following features have been implemented in the project :

- `Express` server
- `Mongoose` for MongoDB
- User Registration
- User and Admin authentication with JWT using `Simple-JWT` library
- `BcryptJS` for encrypting user passwords.
- API key check middleware. (API keys are set in config.js)
- `apiResponse.js` for returning standard JSON response.
- `apiError.js` storing all the errors.
- `mailer.js` for sending emails using the smtp configuration in config.js
- `async` for making mongoose callbacks readable and managable.
- `lodash` for optimizing the iterations over lists.
- `WebHDFS` for reading and writing files to HDFS server.


### Setup
- Update the project name and description in `packages.json` and `bower.json`
- Update the configuration and URLs in  `/config/config.js`
- Update mongo DB server configuration in `/config/db.js`
- Update HDFS server config in `/config/hdfs.js`
- Update email template html in `/utils/mailer.js`

- Install `npm` and `bower` dependancies
```
$ npm install & bower install
```


### Start server
Execute following command to start the server :
```
$ npm start
```

To run the project even after closing the terminal, use process manager [forever](github.com/foreverjs/forever) or [PM2](github.com/Unitech/pm2)
