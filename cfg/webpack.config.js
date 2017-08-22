/* global __dirname */

module.exports = (function() {
    var path = require('path');
    var paths = require('./paths.config');
    var zbuildtools = require('zbuildtools');
    
    var entry = {
        zpubsub: './src/index.ts'
    };
 
    var output = {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', paths.dist),
        libraryTarget: 'umd',
        library: 'zpubsub'
    };
    
    var typescriptLoader = zbuildtools.webpack.loader('awesome-typescript-loader');
    
    var ruleTs = zbuildtools.webpack.rule(/\.ts$/, [typescriptLoader]);

    var module = {
        rules: [
            ruleTs
        ]
    };
    
    var resolve = {
        extensions: ['.ts', '.js']
    };
    
    return {
        entry: entry,
        output: output,
        module: module,
        resolve: resolve,
        devtool: 'cheap-module-source-map'
    };
})();
