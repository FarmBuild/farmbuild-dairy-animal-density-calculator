module.exports = function (config) {
	config.set({

		basePath: '',

		files: [
			'/farmbuild-dairy-animal-density-mapping-master/examples/jquery/animal-density-calculator/index.js'
			'/farmbuild-dairy-animal-density-mapping-master/examples/config.js'
			{pattern: 'examples/data/*'}
		],

		autoWatch: true,
		frameworks: ['jasmine', 'fixture'],
		browsers: ['Chrome'],
		//logLevel: 'LOG_INFO', //this it NOT application log level, it's karma's log level.
		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-fixture',
			'karma-html2js-preprocessor',
			'karma-json-fixtures-preprocessor'
		],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		},
		preprocessors: {
			'**/*.html': ['html2js'],
			'**/*.json': ['json_fixtures']
		},
		jsonFixturesPreprocessor: {
			variableName: '__json__',
			// transform the filename 
			transformPath: function(path) {
				return path + '.js';
			}
		}

	});
};
