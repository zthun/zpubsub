/*global module*/

module.exports = function (grunt) {
    'use strict';
    
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        // Configuration
        'paths': {
            coverage: 'coverage',
            build: 'bin',
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
                curly: true,
                eqeqeq: true,
                forin: true,
                funcscope: true,
                freeze: true,
                futurehostile: true,
                nonbsp: true,
                nonew: true,
                notypeof: true,
                unused: true,
                undef: true
            },
            main: {
                files: {
                    src: [
                        'app/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    freeze: false,
                    jasmine: true
                },
                files: {
                    src: [
                        'test/**/*.js'
                    ]
                }
            }
        },
        'karma': {
            phantomjs: {
                configFile: 'karma.conf.js'
            }
        },
        'concat': {
            main: {
                files: {
                    '<%=paths.build%>/<%=paths.name%>.js' : [
                        '<%=paths.app%>/**/*.js'
                    ]
                }
            }
        },
        'uglify': {
            main: {
                files: {
                    '<%=paths.build%>/<%=paths.name%>.min.js' : [
                        '<%=paths.build%>/<%=paths.name%>.js'
                    ]
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('check', [
        'jshint',
        'karma'
    ]);
    
    grunt.registerTask('rebuild', [
        'concat',
        'uglify'
    ]);
    
    grunt.registerTask('default', [
        'clean',
        'check',
        'rebuild',
    ]);
};