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
      script: 'vivy-modules/vivy-system/dist/main.js',
      ...env,
    },
    // {
    //   name: 'vivy-template',
    //   script: 'vivy-modules/vivy-template/dist/main.js',
    //   ...env,
    // },
  ],
}
