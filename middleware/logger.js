var winston = require('winston');
winston.emitErrs = true;

var env = process.env.NODE_ENV || 'development';
var fs = require('fs');
var path = require('path');
var logDirectory = path.join(__dirname, '../log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: env == 'development' ? 'debug' : 'info',
            filename: `${logDirectory}/application.log`,
            handleExceptions: true,
            json: true,
            maxsize: '50m',
          //  maxFiles: 5,
            colorize: false,
            timestamp: true
        }),
        new winston.transports.Console({
            level: env == 'development' ? 'debug' : 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
