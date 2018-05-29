const path = require('path');

module.exports = {
  s3Bucket: process.env.DEPLOY_BUCKET,
  cloudFrontId: process.env.CLOUD_FRONT_ID,
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
