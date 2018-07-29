const GraphQLJSON = require('graphql-type-json');
const request = require('request-promise-native');
const otNodeDataSynchroniser = require('../modules/OTNode_data_synchroniser/OTNode_data_synchroniser');
const pubsub = require('../pubsub').pubsub;

const TRAIL_DATA_UPDATED = 'TRAIL_DATA_UPDATED';

const exampleTrailData = require('../get_trail_response_example');

const resolvers = {
};


//const resolvers = {
	//JSON: GraphQLJSON,

	//Subscription: {
		//trailDataUpdated: {
			//subscribe: () => {
				//return pubsub.asyncIterator([ TRAIL_DATA_UPDATED ]);
			//},
		//},
	//},

	//Query: {
		//trailData: () => { 
			//return JSON.stringify(otNodeDataSynchroniser.currentResponse);
		//}
	//},

//};

module.exports = resolvers;
