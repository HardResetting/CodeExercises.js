const path = require('path');

module.exports = [
    // ES Module Configuration
    {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'codeExercises.esm.js', // Output file name for ES module
            library: {
                type: 'module', // Specify ES module output
            },
        },
        experiments: {
            outputModule: true, // Enable ES module output
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        externals: {
            // Exclude Monaco Editor from the bundle
            'monaco-editor': 'monaco',
            'constrained-editor-plugin': 'constrained-editor-plugin',
        },
        mode: 'development',
    },
    // // CommonJS/UMD Configuration
    // {
    //     entry: './src/index.ts',
    //     output: {
    //         path: path.resolve(__dirname, 'dist'),
    //         filename: 'codeExercises.js', // Output file name for CommonJS or UMD
    //         library: {
    //             name: 'CodeExercises', // Global variable name for UMD
    //             type: 'umd', // Specify UMD as the library target
    //         },
    //         globalObject: 'this', // Ensure compatibility in different environments
    //     },
    //     resolve: {
    //         extensions: ['.ts', '.js'],
    //     },
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.ts$/,
    //                 use: 'ts-loader',
    //                 exclude: /node_modules/,
    //             },
    //         ],
    //     },
    //     mode: 'development',
    // },
];
