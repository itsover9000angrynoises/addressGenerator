const config = require('./config');
const ExpressServer = require('./middleware/expressServer');
const { logger } = require('./utils/logger');
const onTerminate = require('./utils/terminate');
const pjson = require('./package.json');
let expressServer = null;

async function shutDown() {
    if (expressServer) {
        logger.info("Closing server");
        await expressServer.close();
    }
}

function logStartupMsg() {
    logger.info({ appStart: { version: pjson.version, config: config.getAllConfig() } });
}

const launchServer = async () => {
    try {
        logStartupMsg();
        expressServer = new ExpressServer(config.get('serverPort'));
        expressServer.launch();
        onTerminate(shutDown);
        logger.info('Express server running');
    } catch (error) {
        logger.error('Express Server failure ' , error.message);
        shutDown();
    }
};

launchServer()

