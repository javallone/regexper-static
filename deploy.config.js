const path = require('path');

module.exports = {
  bucket: process.env.DEPLOY_BUCKET,
  deployFrom: path.resolve(__dirname, 'build'),
  paths: [
    {
      match: /^service-worker.js/,
      CacheControl: 'max-age=0'
    },
    {
      match: /^(js|css|icons-\w{8})/,
      CacheControl: 'public, max-age=31536000'
    },
    { // Default config. MUST BE LAST
      match: /./,
      CacheControl: 'public, max-age=96400'
    }
  ]
};
