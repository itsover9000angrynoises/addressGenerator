'use strict';

var { userService } = require('../service/userService');
const { handleErrorResponse } = require('../utils/error');
const { handleResponse } = require('../utils/response');

function getAddressByUserId(req, res, next) {
  userService.getAddressByUserId(req.params.id)
    .then(response => handleResponse(response, req, res))
    .catch((err) => handleErrorResponse(err, req, res));
};

exports.userController = {
  getAddressByUserId
}
