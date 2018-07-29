const Books = [
	{
		id: '1',
		name: 'Dune',
		author: 'Frank Herbert'
	},
	{
		id: '2',
		name: '1984',
		author: 'George Orwell'
	},
	{
		id: '3',
		name: 'Foundation',
		author: 'Isaac Asimov'
	}
]

module.exports.typeDefs = `
	extend type Query {
		Book(name: String): Book
	}

	type Book{
		id: ID,
		name: String,
		author: String
	}
`;

module.exports.resolvers = {
	Query: {
		Book: (root, args) => {
			return Books.find( book => (book.name === args.name) );
		}
	},

	Book: {
		id: book => book.id,
		name: book => book.name,
		author: book => book.author,
	}
};
