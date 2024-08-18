/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const env = {
  env: {
    NODE_ENV: 'production',
  },
  env_production: {
    NODE_ENV: 'production',
  },
  env_development: {
    NODE_ENV: 'development',
  },
}

module.exports = {
  apps: [
    {
      name: 'vivy-system',
      cwd: path.resolve(__dirname, 'vivy-modules/vivy-system'),
      script: 'dist/main.js',
      ...env,
    },
    // {
    //   name: 'vivy-template',
    //   cwd: path.resolve(__dirname, 'vivy-modules/vivy-template'),
    //   script: 'dist/main.js',
    //   ...env,
    // },
  ],
}
