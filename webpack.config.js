module.exports = (env) => ({
    mode: env.mode,
    entry: ['./index.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'mathsolver.min.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    }
});