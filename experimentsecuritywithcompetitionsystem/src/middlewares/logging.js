const {createLogger,
    transports,
    format
} = require('winston');

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.simple())

        }),
        new transports.Console({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.simple())
        })
   
    ]   
})





module.exports = logger;