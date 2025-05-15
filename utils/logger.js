
const SimpleNodeLogger = require('simple-node-logger');


  opts = {
    logFilePath: 'logs.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
  },
  logger = SimpleNodeLogger.createSimpleLogger(opts);

  
module.exports = {
  logger
};