var config = {
	"mongo_fu-test-db": {
		starter: 'mongodb',
		username: 'test1',
		password: 'try1',
		hosts: 'localhost',
		replicaSet: 'fu_test',
		database: 'fu-test-db'
	},
	elasticsearch: [{
		protocol: 'http',
		host: 'localhost',
		port: '9200'
	}],
	indices: {
		"test": {
			indexName: "test",
			aliasName: "testAlias"
		},
		"user": {
			indexName: "user",
			aliasName: "userAlias"
		},
		"product": {
			indexName: "product",
			aliasName: "productAlias"
		},
		"video": {
			indexName: "video",
			aliasName: "videoAlias"
		}
	},
	MAIN_DB: "fu-test-db",
	AUTH_BASE_URL: 'http://localhost:4000',
	SENTRY_DSN: 'https://005b49f9aa8945b29d3938a0e4ed70b2@sentry.io/1813560'
};

module.exports = config;