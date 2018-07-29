/**
 * NPM Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const multer = require('multer');
const { createServer } = require('http');

const cors = require('cors');

// GraphQL - USING APOLLO SERVER v1
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { execute, subscribe } = require('graphql');

const { schema } = require('./graphql/schema');
//const { typeDefs, resolvers } = require('./graphql/schema');

// Connect to DB
//const DB_URI = 'mongodb://localhost:27017/links';
//mongoose.connect(DB_URI);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });


/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('host', '0.0.0.0');
app.set('port', 8080);

app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// for development purposes, dummy client is on port 3000
app.use(
	cors({
		origin: 'http://localhost:3000'
	})
);

app.use('/graphql', bodyParser.json(),
	graphqlExpress({
		schema
	})
);

app.get('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: 'ws://localhost:8080/subscriptions'
}));

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const webSocketServer = createServer(app);
webSocketServer.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');

});

module.exports = app;
