module.exports = function (grunt) {
    'use strict';
    
    require('load-grunt-tasks')(grunt);
    
    var pkg = grunt.file.readJSON('package.json');
    
    var fileList = {
        vendorFiles: [
            'node_modules/znamespace/dist/znamespace.js'
        ],
        appFiles: [ 
            'lib/**/*.js',
            '!lib/**/*.spec.js'
        ],
        testFiles: [
            'lib/**/*.spec.js'
        ]
    };

    grunt.initConfig({
        // Configuration
        'paths': {
            coverage: 'coverage',
            build: 'dist',
            app: 'app',
            name: pkg.name
        },
        // Pre Processing 
        'clean': [
            '<%=paths.build %>',
            '<%=paths.coverage%>'
        ],
        // Checks
        'jshint': {
            options: {
                jshintrc: true
            },
            self: {
                src: ['gruntfile.js']
            },
            app: {
                src: fileList.appFiles
            },
            test: {
                src: fileList.testFiles
            }
        },
        'karma': {
            phantomjs: {
                configFile: 'karma.conf.js'
            }
        },
        'concat': {
            core: {
                src: fileList.appFiles,
                dest: '<%=paths.build%>/<%=paths.name%>.js'
            },
            all: {
                src: fileList.vendorFiles.concat(fileList.appFiles),
                dest: '<%=paths.build%>/<%=paths.name%>.all.js'
            }
        },
        'uglify': {
            main: {
                src: ['<%=paths.build%>/<%=paths.name%>.all.js'],
                dest: '<%=paths.build%>/<%=paths.name%>.all.min.js'
            }
        },
    });
    
    grunt.registerTask('check', [
        'jshint',
        'karma'
    ]);
    
    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);
    
    grunt.registerTask('default', [
        'clean',
        'check',
        'build',
    ]);
};