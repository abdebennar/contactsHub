require('dotenv').config();


module.exports = {
	mongodb: {
		url: process.env.MONGO_URI,
		databaseName: "dashboard",
		options: {
		},
	},
	migrationsDir: "migrations",
	changelogCollectionName: "changelog",
};
