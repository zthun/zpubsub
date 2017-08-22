
module.exports = function(config) {
    var zbuildtools = require('zbuildtools');
    var isDebug = zbuildtools.karma.isDebug();
    var reporters = isDebug ? ['kjhtml', 'karma-typescript'] : ['progress', 'junit', 'karma-typescript'];
    var paths = require('./paths.config');
    
    var conf = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',
        
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jasmine',
            'karma-typescript'
        ],
        
        // list of files / patterns to load in the browser
        files: [
            'src/**/*.ts'
        ],
        
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.ts': ['karma-typescript']
        },
        
        // Additional mime types
        mime: {
            'text/x-typescript': ['ts']
        },
        
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: reporters,
        
        // the default configuration
        junitReporter: zbuildtools.karma.createJunitReport(paths.reports),
        
        // Configuration file for typescript.
        karmaTypescriptConfig: zbuildtools.karma.createKarmaTypescriptConfig('tsconfig.json', paths.coverage),
        
        // web server port
        port: 8081,
        
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !isDebug
    };
    
    config.set(conf);
};
