'use strict';

import firebase from './node_modules/firebase/package.json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'

const targetDir = process.env.STORE_DIR && process.env.STORE_DIR.length>0 ? process.env.STORE_DIR + "/docs" : "./docs"

export default [{
  input: 'src/index.ts',
  output: {
    file: targetDir +'/wcfbAuth.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    replace({
      'FIREBASE_SDK_VERSION': firebase.version,
    }),
    resolve({
      dedupe: [
        'lit'
      ]
    }),
    typescript({ typescript: require('typescript') }),
  ]
}]
