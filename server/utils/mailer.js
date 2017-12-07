"use strict";

/**
    Required packages
**/
var nodemailer = require('nodemailer'),
    config = require('../config/config'),
    emailConfig = null;

exports.setConfig = function(userEmailConfig) {
    emailConfig = userEmailConfig;
}

/**
    Export categories object.
**/
exports.categories = {
    REGISTER: "reg",
    LOGIN: "login",
    INFO: "info",
    WELCOME: "welcome",
    RECOVER_PASS: "recover_pass"
};

/*##################################################################################################################################################
    SAMPLE TEMPLATES
*/
/**
    registerTemplate
    placeholders : username , password
**/
var registerTemplate = {
    subject: 'Test : Verify Your Email.',
    text: 'Hello, {{username}}',
    html: '<!DOCTYPE html><html> <body> <div id="parent" style="width:auto; text-align: center; padding: 20px; font-family: helvetica, sans-serif;"><div id="content" style="margin: 20px; color: #888; padding: 20px;"> <div class="row" style="font-size:32px; padding-bottom:20px;"> Just one more step...  </div><div class="row"> Click the big button below to activate your account. </div><div class="row"> <a href="{{verification_link}}" > <button id="verify_button" style="padding: 10px; background: #a53692; color: #fff; font-style: bold; font-size: 22px; border: none; margin: 30px 20px 0px 20px; padding: 20px 30px; border-radius: 10px; cursor: pointer;">Activate Account</button> </a> </div></div><div class="row" id="copyright" style="color: #888; font-size: 12px;"> &copy; 2016 Test Pvt. Ltd </div></div></body></html>',
    from: 'info@test.com'
};

/**
    welcomeTemplate
    placeholders : username
**/
var welcomeTemplate = {
    subject: 'Test : Welcome',
    text: 'Hello, {{username}}',
    html: '<!DOCTYPE html><html><body><div id="parent" style="width:auto; text-align: center; padding: 20px; font-family: helvetica, sans-serif;"><div id="content" style="margin: 20px; color: #888; padding: 20px;"><div class="row" style="font-size:32px; padding-bottom:20px;"> Welcome to Test! </div><div class="row"> You tagline goes here. </div><div class="row"><a href="http://test.com" ><button id="verify_button" style="padding: 10px; background: #a53692; color: #fff; font-style: bold; font-size: 22px; border: none; margin: 30px 20px 0px 20px; padding: 20px 30px; border-radius: 10px; cursor: pointer;">Visit Website</button></a></div></div><div class="row" id="copyright" style="color: #888; font-size: 12px;"> &copy; 2016 Test PVT ltd </div></div></body></html>',
    from: 'info@test.com'
};

/**
    loginTemplate
    placeholders : name , email
**/
var loginTemplate = {
    subject: 'Hello',
    text: 'Hello, {{name}}',
    html: '<b>Login template <br> Hello, <i>{{name}}</i> and your email is {{email}}</b>',
    from: 'test'
};
/**
    infoTemplate
    placeholders : username , name , address , contact
**/
var infoTemplate = {
        subject: 'Info template',
        text: 'Hello {{username}}',
        html: 'Hello {{username}} <br> you have registered to the system and your credentials are <br> name : {{name}} <br> address : {{address}} <br> contact : {{contact}}',
        from: 'info@test.com'
    }

  /**
      recoverPasswordTemplate
      placeholders : username , recovery_code
  **/
  var recoverPasswordTemplate = {
          subject: 'Recover password',
          text: 'Hello {{username}}',
          html: '<!DOCTYPE html><html><body><div id="parent" style="width:auto; text-align: center; padding: 20px; font-family: helvetica, sans-serif;"><div id="content" style="margin: 20px; color: #888; padding: 20px;"><div class="row"> Click update button to Update your Password. </div><div class="row"><a href="{{recovery_code}}"><button id="verify_button" style="padding: 10px; background: #a53692; color: #fff; font-style: bold; font-size: 22px; border: none; margin: 30px 20px 0px 20px; padding: 20px 30px; border-radius: 10px; cursor: pointer;">Update Password</button></a></div></div><div class="row" id="copyright" style="color: #888; font-size: 12px;"> &copy; 2016 Test Pvt. Ltd </div></div></body></html>',
          from: 'info@test.com'
      }
    /*################################################################################################################################################################################

    /**
        mapCategoryNameWithTemplate
        @description: map the category object key with its respective template object.
    **/
var mapCategoryNameWithTemplate = {
    "reg": registerTemplate,
    "login": loginTemplate,
    "info": infoTemplate,
    "welcome": welcomeTemplate,
    "recover_pass": recoverPasswordTemplate
};

/**
    @function: getWordsBetweenCurlies
    @param: string
    @description: get placeholders between {{ }}
**/
function getWordsBetweenCurlies(str) {
    var results = [],
        re = /{([^{}]+)}/g,
        text;
    while (text = re.exec(str)) {
        results.push(text[1]);
    }
    return results;
}


/**
    Export sendMail method
    @function: sendMail
    @param: category , recipient email , placeholders , callback function
    @description: validates placeholders and then sends email to given recipient and on error sends the response to callback function
**/
exports.sendMail = function(category, recipient, mailData, callback) {
    /**
        if user set his own email config then it is used
        else the default config is used
    **/
    emailConfig = (emailConfig) ? emailConfig : config.poolConfig;
    /**
        transporter
        @description: main object required for sending emails.
    **/
    var transporter = nodemailer.createTransport(emailConfig);

    /**
        categoryKey contains the given category template object
    **/
    var categoryKey = mapCategoryNameWithTemplate[category];
    var matchedPlaceholdersInText = getWordsBetweenCurlies(categoryKey.text);
    var matchedPlaceholdersInHtml = getWordsBetweenCurlies(categoryKey.html);
    /**
        totalPlaceholdersMatched contains all placeholders from matchedPlaceholdersInHtml and matchedPlaceholdersInText
    **/
    var totalPlaceholdersMatched = [];
    for (var i = 0; i < matchedPlaceholdersInText.length; i++) {
        totalPlaceholdersMatched[i] = matchedPlaceholdersInText[i];
    }
    for (var i = 0, j = totalPlaceholdersMatched.length; i < matchedPlaceholdersInHtml.length; i++, j++) {
        totalPlaceholdersMatched[j] = matchedPlaceholdersInHtml[i];
    }
    /**
        uniquePlaceholders contains unique placeholders from totalPlaceholdersMatched
    **/
    var uniquePlaceholders = totalPlaceholdersMatched.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });
    var keyNotFound = "";
    /**
        loop to make sure that only if all the placeholders in mailData are their in
        templates then only proceed to send mail
    **/
    for (var match in uniquePlaceholders) {
        keyNotFound = uniquePlaceholders[match];
        var matched = false;
        for (var key in mailData) {
            if (key == uniquePlaceholders[match]) {
                matched = true;
            }
        }
        if (!matched) {
            /**
                if the placeholders dont match with mailData keys throw an error
            **/
            callback({
                massage: "Placeholder mismatch"
            }, false);
            return;
        }
    }
    /**
        template contains the function transporter.templateSender mapped to given category
    **/
    /*----------- For nodemailer implementation -----------*/

    var template = transporter.templateSender(mapCategoryNameWithTemplate[category]);
    template({
        to: recipient
    }, mailData, function(err, info) {
        if(err) {
            /**
                error sending email then call the callback function with error and success state
                and log the error in a file
            **/
            var info = {
                recipient: recipient,
                subject: categoryKey.subject,
                text: categoryKey.text,
                html: categoryKey.html
            };
            logger.warn({info: info},"Email sending failed Incorrect email or password");
            callback(err, false);
        }else{
            callback(null, true);
        }
    });

};
