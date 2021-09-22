const path = require("path");
const glob = require("glob");
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deepcopy = require('deepcopy');
const tailwindcss = require('tailwindcss');

const getEntries = entryRoot => {
    const entries = {};
    const pattern = entryRoot + '/{,!(vendor)/**}/*.entry.jsx';

    glob.sync(pattern).forEach((file) => {
        //trim path from filename
        fileKey = file.slice(file.lastIndexOf("/")).replace(".entry.jsx", "")
        entries[fileKey] = path.join(__dirname, file);
    });

    return entries;
}

const createConfig = (entryRoot, override = null) => {

    var config = {
        ...defaultConfig,
        module: deepcopy(defaultConfig.module),
        entry: getEntries(entryRoot),
        output: {
            ...defaultConfig.output,
            filename: "[name].js",
            path: path.resolve(__dirname, entryRoot, "assets/js"),
            publicPath: `/wp-content/plugins/${entryRoot}/assets/js/`,
        },
        resolve: {
            alias: {
                microsoft_core: path.resolve(__dirname, 'microsoft-core/'),
            }
        }
    }

    for(var rule of config.module.rules) {
        if(rule.use && rule.use.length) {
            for(var loader of rule.use) {
                if(loader.loader && loader.loader.indexOf('postcss-loader') != -1) {
                    loader.options.plugins.unshift(tailwindcss(`./${entryRoot}/tailwind.config.js`));
                }
            }
        }
    }

    if (override) {
        config = override(config);
    }

    return config;
}

module.exports = [   
    createConfig('microsoft-news'),
]
