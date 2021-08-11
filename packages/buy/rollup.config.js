'use strict';

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const targetDir = process.env.STORE_DIR && process.env.STORE_DIR.length>0? process.env.STORE_DIR + "/docs"  : "./docs"

export default [{
  input: 'src/index.ts',
  output: {
    file: targetDir +'/wcfbBuy.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve({
      dedupe: [
        'lit'
      ]
    }),
    typescript({ typescript: require('typescript') }),
  ]
}]
