// production or development
const mode = 'production';

module.exports = {
    mode: mode,
    entry: ['./index.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'mathsolver.min.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    }
};