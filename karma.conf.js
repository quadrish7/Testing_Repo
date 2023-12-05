// Karma configuration
// Generated on Tue Mar 14 2017 10:10:06 GMT+1100 (AUS Eastern Daylight Time)

let _ = require('underscore');

module.exports = function(config) {
    // set default config
    let cfg = getDefaultConfig(config);
    // merge code coverage config
    cfg = process.argv.indexOf('--reporters=coverage,progress') ? _.extend(cfg, mergeCodeCoverageConfig(config)) : cfg;
    // set test runner configuration
    config.set(cfg);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDefaultConfig(config) {
    return {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        //frameworks: ['jasmine', 'requirejs'],
        frameworks: ['jasmine', 'browserify'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'spec/ncg/test_cases/*-ts.js', included: true},
            {pattern: 'spec/ncg/test_templates/*.html', included: true}
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['browserify'],
            'spec/ncg/test_cases/*-ts.js': ['browserify'],
            'spec/ncg/test_templates/*.html': ['html2js']
        },

        browserify: {
            debug: true,
            transform: [
                'brfs'
            ]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress','verbose', "junit"],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'], //'Chrome',


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        //report
        junitReporter: {
            outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'junit-report.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {} // key value pair of properties to add to the section of the report
        }
    };
}

function mergeCodeCoverageConfig(config) {

    var istanbul = require('browserify-istanbul');

    return {
        // list of files / patterns to load in the browser
        files: [
            {pattern: 'src/lib/**/*.js', included: true},
            {pattern: 'spec/ncg/test_cases/*-ts.js', included: true},
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/lib/**/*.js': ['commonjs','coverage'],
            'spec/ncg/test_cases/*-ts.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [
                'brfs',
                istanbul({
                    ignore: ['**/spec/**'],
                })
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress','coverage','verbose'],
        coverageReporter: {
            reporters: [
                {type: 'html', dir : 'test-reports/coverage/'},
                {type: 'clover', dir: 'test-reports', subdir: '.', file: 'clover.xml'}
            ]
        }
    };
}