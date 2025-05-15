const _ = require('lodash');
const { logger } = require("./logger");

const sendErrorResponse = function (res, err) {
    let respMsg = {};
    respMsg.code = _.get(err, 'code', 500);
    if (typeof respMsg.code !== 'number') {
        respMsg.code = 500;
    }
    if (respMsg.code < 400 || respMsg > 599) {
        respMsg.code = 500;
    }
    respMsg.message = _.get(err, 'message', 'Unknown Error');
    res.status(respMsg.code).json(respMsg);
};

exports.handleErrorResponse = function (err, req, res) {
    sendErrorResponse(res, err);
    logger.error("serverError ", err);
}
