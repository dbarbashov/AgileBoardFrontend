module.exports = {
    context: __dirname,
    entry: "./main.js",
    // node: {
    //     fs: "empty"
    // },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "transform?brfs"
            }
        ],
        noParse: [
            'js/vendor/*.js'
        ]
    }
};