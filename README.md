# Regexper [![Build Status](https://travis-ci.org/javallone/regexper-static.svg?branch=react)](https://travis-ci.org/javallone/regexper-static)

Code for the http://regexper.com/ site.

## Contributing

I greatly appreciate any contributions that you may have for the site. Feel free to fork the project and work on any of the reported issues, or let me know about any improvements you think would be beneficial.

When sending pull requests, please keep them focused on a single issue. I would rather deal with a dozen pull requests for a dozen issues with one change each over one pull request fixing a dozen issues. Also, I appreciate tests to be included with feature development, but for minor changes I will probably not put up much of a fuss if they're missing.

### Working with the code

Node is required for working with this site.

To start with, install the necessary dependencies:

    $ yarn install

To start a development server, run:

    $ yarn start

### Available scripts

* `yarn start` - Start a development server on port 8080
* `yarn start:prod` - Run a build and start a web server on port 8080. This will not automatically rebuild.
* `yarn build` - Run a production build (used for deployments and for rebuilding when running `yarn start:prod`)
* `yarn deploy` - Deploy application to AWS S3 bucket
* `yarn test` - Run lint and unit tests
* `yarn test:lint` - Run eslint
* `yarn test:unit` - Run jest unit tests
* `yarn test:watch` - Run jest in watch mode
* `yarn test:bundle-analyzer` - Generate webpack-bundle-analyzer report
* `yarn i18n:scrub` - Scrubs i18n locale configs. Adds missing keys and normalizes YAML formatting

## Configuration

Several environment variables are used to configure the application at build-time. None of these values are required during testing.

* `NODE_ENV` - Effects build-time optimizations. Set to `"production"` for builds and unit tests in package.json. Setting to anything else will show a banner in the application's header.
* `GA_PROPERTY` - Google Analytics property ID.
* `SENTRY_KEY` - Sentry.io DSN key for error reporting.
* `CIRCLE_BRANCH`, `CIRCLE_BUILD_NUM`, and `CIRCLE_SHA1` - CircleCI values used to generate build ID. Displayed in application footer and used in Sentry.io error reports.
* `DEPLOY_BUCKET` - AWS S3 bucket to deploy application to when running `yarn deploy`.
* `DEPLOY_ENV` - Environment the applicatoin will be deployed to. Used to report environment in Sentry.io error reports. Typically set to either "preview" or "production".
* `BANNER` - Text to display in header banner. Generally generated from `NODE_ENV`
* `BUILD_ID` - Application build ID. Generated from `CIRCLE_BRANCH`, `CIRCLE_BUILD_NUM`, and `CIRCLE_SHA1` if not set.

## License

See [LICENSE.txt](/LICENSE.txt) file for licensing details.
