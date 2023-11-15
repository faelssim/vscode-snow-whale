import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from 'rollup-plugin-img';
// import json from '@rollup/plugin-json';

export default {
    input: './src/views/panel.js',
    output: {
        file: './src/dist/bundle.js',
        format: 'umd',
        name: 'Panel',
        globals: {
            'md5': 'md5',
            'uuid': 'uuid',
            // axios: 'axios',
        }
    },
    plugins: [
        resolve(),
        commonjs(),
        image({
            output: './src/dist/images',
            extensions: /\.(png|jpg|jpeg|gif|svg)$/,
            limit: 8192,
            exclude: 'node_modules/**',
        })
        // json(),
    ],
    // external: ['md5', 'uuid', 'axios']
}