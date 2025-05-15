const _ = require('lodash');
const { logger } = require('./logger');

logReqRes = function(req,res){
    let msg = _.pick(req,['method','url','body','params','query'])
    msg.status = res.statusCode;
    logger.info(msg);
  }
  
  exports.handleResponse = function(resp,req,res){
    res.status(200).json(resp);
    logReqRes(req,res);
  }

