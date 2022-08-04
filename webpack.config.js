import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: 'server.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    experiments: {
        outputModule: true,
    },
    plugins: [
        '@babel/plugin-transform-runtime'
    ],
    module: {
        // https://webpack.js.org/loaders/babel-loader/#root
        rules: [
            {
                test: /.m?ts$/,
                use: 'ts-loader',
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ],
    },
    devtool: 'source-map'
}