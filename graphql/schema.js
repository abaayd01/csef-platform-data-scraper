const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const DataScraper = require('../modules/csef-website-data-scraper/DataScraper');
const dataScraper = new DataScraper();
const util = require('util');

const Query = `
	type Query{
		_empty: String
		allIssuers: [Issuer]
		Issuer: Issuer
		Platform: Platform
	}

	type Issuer{
		name: String,
		capitalRaised: Float
		hostPlatform: Platform
	}

	type Platform{
		name: String
	}
`;

//const Book = require('./Book').typeDefs;
//const bookResolvers = require('./Book').resolvers;

baseResolvers = {
	Query: {
		allIssuers: async () => {
			const issuers = await dataScraper.issuers;
			console.log('util.inspect(issuers, false, null): ', util.inspect(issuers, false, null));

			return await dataScraper.issuers;
		},

		Issuer: (root, args) => {
			return {
				name: "Test Issuer",
				capitalRaised: 123456.78,
				hostPlatform: {
					name: "Test CSEF Platform"
				}
			}
		},

		Platform: (root, args) => {
			return {
				name: "Test CSEF Platform"
			}
		}
	},

	Issuer:{
		name: issuer => issuer.name,
		capitalRaised: issuer => issuer.capitalRaised,
		hostPlatform: issuer => issuer.hostPlatform
	},

	Platform:{
		name: platform => platform.name
	}
};

const typeDefs = [Query];
const resolvers = merge(baseResolvers);

const schema = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers
});

module.exports.typeDefs = typeDefs;
module.exports.schema = schema;
