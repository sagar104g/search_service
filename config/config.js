var config = {
	mongo: {
		connectionString: 'mongodb://localhost/fu-test-db?replicaSet=fu_test',
		database: 'du-test-db'
	},
	elasticsearch: {
		protocol: 'http',
		host    : 'localhost',
		port    : '9200'
	},
	indices: {
		"test":{
		indexName: "test",
		aliasName: "testAlias"
	},
		"user":{
		indexName: "user",
		aliasName: "userAlias"
	},
		"product":{
		indexName: "product",
		aliasName: "productAlias"
	},
		"video":{
		indexName: "video",
		aliasName: "videoAlias"
	}},
    SENTRY_DSN: 'https://005b49f9aa8945b29d3938a0e4ed70b2@sentry.io/1813560'
};

module.exports = config;