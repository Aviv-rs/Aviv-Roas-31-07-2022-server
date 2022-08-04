"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('../services/logger.service');
async function log(req, res, next) {
    logger.info('Req was made to ', req.url);
    next();
}
module.exports = {
    log,
};
//# sourceMappingURL=logger.middleware.js.map