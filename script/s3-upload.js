/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');
const colors = require('colors/safe');
const readdir = require('recursive-readdir');
const AWS = require('aws-sdk');
const mime = require('mime-types');

const s3 = new AWS.S3();
const config = require(path.resolve(process.argv[2]));

const configFor = path => {
  const { match, ...conf } = config.paths.find(conf => conf.match.test(path)); // eslint-disable-line no-unused-vars
  return {
    ContentEncoding: mime.lookup(path) || 'application/octet-stream',
    ...conf
  };
};

const bucketContents = s3.listObjectsV2({
  Bucket: config.bucket
}).promise()
  .then(result => {
    return result.Contents.map(item => item.Key);
  })
  .catch(err => {
    console.error(colors.red.bold('Failed to fetch bucket contents:'), err);
    process.exit(1);
  });

const uploadDetails = readdir(config.deployFrom)
  .then(paths => paths.map(p => {
    const key = path.relative(config.deployFrom, p);
    return {
      Key: key,
      Body: fs.createReadStream(p),
      ...configFor(key)
    };
  }))
  .catch(err => {
    console.error(colors.red.bold('Error:'), err);
    process.exit(1);
  });

Promise.all([bucketContents, uploadDetails]).then(([bucket, upload]) => {
  const deleteKeys = bucket.filter(key => !upload.find(conf => key === conf.Key));

  const uploadPromises = upload.map(params => {
    console.log(`Starting upload for ${ params.Key }`);
    return s3.upload({
      Bucket: config.bucket,
      ...params
    }).promise()
      .then(() => console.log(colors.green(`${ params.Key } successful`)))
      .catch(err => {
        console.error(colors.red.bold(`${ params.Key } failed`));
        return Promise.reject(err);
      });
  });

  return Promise.all(uploadPromises).then(() => {
    console.log(`Deleting ${ deleteKeys.length } stale files`);
    return s3.deleteObjects({
      Bucket: config.bucket,
      Delete: {
        Objects: deleteKeys.map(key => ({ Key: key }))
      }
    }).promise()
      .then(() => console.log(colors.green('Delete successful')))
      .catch(err => {
        console.error(colors.red.bold('Delete failed'));
        return Promise.reject(err);
      });
  });
})
  .catch(err => {
    console.error(colors.red.bold('Error:'), err);
    process.exit(1);
  });
